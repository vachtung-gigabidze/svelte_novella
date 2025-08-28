<script>
    import { onMount } from 'svelte'
    import { supabase } from '../supabaseClient'
    import AuthForm from '../auth/AuthForm.svelte'
    import DialogueCard from '../components/DialogueCard.svelte'


    let user = $state(null)
    let session = $state(null)
    let isLoading = $state(true)
    let error = $state('')
    let dialogues = $state([])
    let currentDialogueIndex = $state(0)

    // Инициализация приложения
    onMount(async () => {
        try {
            // Проверяем существующую сессию
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

            if (sessionError) {
                console.error('Session error:', sessionError)
                throw sessionError
            }

            session = sessionData?.session

            if (session) {
                const { data: userData, error: userError } = await supabase.auth.getUser()

                if (userError) {
                    console.error('User error:', userError)
                    throw userError
                }

                user = userData?.user
                await loadDialogues()
            }
        } catch (err) {
            error = 'Ошибка инициализации: ' + err.message
            console.error('Init error:', err)
        } finally {
            isLoading = false
        }

        // Слушаем событие успешной аутентификации
        window.addEventListener('authSuccess', handleAuthSuccess)

        // Слушаем изменения аутентификации
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
                console.log('Auth state changed:', event)

                if (event === 'SIGNED_IN' && currentSession) {
                    session = currentSession
                    const { data: userData } = await supabase.auth.getUser()
                    user = userData?.user
                    await loadDialogues()
                } else if (event === 'SIGNED_OUT') {
                    user = null
                    session = null
                    dialogues = []
                    currentDialogueIndex = 0
                }
            }
        )

        return () => {
            window.removeEventListener('authSuccess', handleAuthSuccess)
            subscription?.unsubscribe()
        }
    })

    // Обработчик успешной аутентификации
    function handleAuthSuccess(event) {
        user = event.detail.user
        session = event.detail.session
        loadDialogues()
    }

    // Загрузка диалогов
    async function loadDialogues() {
        try {
            console.log('Loading dialogues...')
            const { data, error: storageError } = await supabase.storage
                .from('dracula')
                .download('dracula_story.json')

            if (storageError) {
                console.error('Storage error:', storageError)
                throw storageError
            }

            const text = await data.text()
            const storyData = JSON.parse(text)
            dialogues = storyData.dialogues
            console.log('Dialogues loaded:', dialogues.length)

        } catch (err) {
            error = 'Ошибка загрузки диалогов: ' + err.message
            console.error('Load dialogues error:', err)
        }
    }

    // Обработчик изменения диалога
    function handleDialogueChange(event) {
        const nextDialogueId = event.detail.nextDialogueId
        const nextIndex = dialogues.findIndex(d => d.id === nextDialogueId)

        if (nextIndex !== -1) {
            currentDialogueIndex = nextIndex
        }
    }

    // Навигация
    function nextDialogue() {
        if (currentDialogueIndex < dialogues.length - 1) {
            currentDialogueIndex++
        }
    }

    function prevDialogue() {
        if (currentDialogueIndex > 0) {
            currentDialogueIndex--
        }
    }

    function goToDialogue(index) {
        currentDialogueIndex = index
    }

    // Выход
    async function logout() {
        try {
            const { error: signOutError } = await supabase.auth.signOut()
            if (signOutError) throw signOutError

            user = null
            session = null
            dialogues = []
            currentDialogueIndex = 0
        } catch (err) {
            error = 'Ошибка выхода: ' + err.message
            console.error('Logout error:', err)
        }
    }

    // Добавляем обработчик события диалогов
    onMount(() => {
        window.addEventListener('dialogueChange', handleDialogueChange)
        return () => window.removeEventListener('dialogueChange', handleDialogueChange)
    })
</script>

<div class="app">
    {#if isLoading}
        <div class="loading">
            <p>Загрузка приложения...</p>
        </div>

    {:else if error}
        <div class="error">
            ⚠️ {error}
        </div>

    {:else if user && session}
        <!-- Шапка -->
        <div class="header">
            <div class="user-avatar">
                {user.email[0].toUpperCase()}
            </div>
            <div class="user-info">
                <h3 class="user-name">
                    {user.email}
                </h3>
                <p class="user-email">
                    ID: {user.id.slice(0, 8)}...
                </p>
            </div>
            <button class="button button-logout" on:click={logout}>
                Выйти
            </button>
        </div>

        <!-- Карусель диалогов -->
        <div class="dialogues-container">
            {#if dialogues.length > 0}
                <DialogueCard dialogue={dialogues[currentDialogueIndex]} />

                <!-- Навигация -->
                <div class="dots-navigation">
                    {#each dialogues as _, index}
                        <div
                                class="dot {index === currentDialogueIndex ? 'active' : ''}"
                                on:click={() => goToDialogue(index)}
                        />
                    {/each}
                </div>

                <div class="navigation">
                    <button class="nav-button" on:click={prevDialogue} disabled={currentDialogueIndex === 0}>
                        ← Назад
                    </button>
                    <button class="nav-button" on:click={nextDialogue} disabled={currentDialogueIndex === dialogues.length - 1}>
                        Вперед →
                    </button>
                </div>

            {:else}
                <div class="loading">
                    <p>Загрузка диалогов...</p>
                </div>
            {/if}
        </div>

    {:else}
        <!-- Экран аутентификации -->
        <div class="auth-section">
            <h1 class="welcome-title">
                Дракула: Интерактивная история
            </h1>

            <p class="welcome-text">
                Погрузитесь в атмосферную историю с интерактивными диалогами
            </p>

            <AuthForm />
        </div>
    {/if}
</div>