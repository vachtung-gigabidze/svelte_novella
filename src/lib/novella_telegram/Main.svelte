<script>
  import { onMount, setContext } from 'svelte'
  import { supabase } from '../supabaseClient.js'
  import { initializeTelegram, getTelegramUser } from '../telegram'
  import DialogueCard from '../components/DialogueCard.svelte'
  


  let tg = $state(null)
  let telegramUser = $state(null)
  let user = $state(null)
  let session = $state(null)
  let isLoading = $state(true)
  let error = $state('')
  let dialogues = $state([])
  let currentDialogueIndex = $state(0)
  setContext('defaultAssetsUrl', '/svelte_novella/assets/')
  // Инициализация приложения
  onMount(async () => {
    try {
      tg = initializeTelegram()
      telegramUser = getTelegramUser(tg)

      // Проверяем существующую сессию
      const { data: sessionData } = await supabase.auth.getSession()
      session = sessionData?.session

      if (session) {
        const { data: userData } = await supabase.auth.getUser()
        user = userData?.user
        await loadDialogues()
      }
    } catch (err) {
      error = 'Ошибка инициализации: ' + err.message
    } finally {
      isLoading = false
    }
  })

  // Аутентификация через Edge Function
  async function authenticate() {
    try {
      isLoading = true
      error = ''

      const initData = tg.initData
      if (!initData) throw new Error("Telegram init data not available")

      const { data, error: invokeError } = await supabase.functions.invoke(
              "tma-auth",
              { body: { initData } }
      )

      if (invokeError) throw invokeError

      const { error: authError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      })

      if (authError) throw authError

      const { data: userData } = await supabase.auth.getUser()
      user = userData?.user
      session = { access_token: data.access_token, refresh_token: data.refresh_token }

      await loadDialogues()

    } catch (err) {
      error = "Ошибка авторизации: " + err.message
      console.error('Auth error:', err)
    } finally {
      isLoading = false
    }
  }

  // Загрузка диалогов
  async function loadDialogues() {
    try {
      const { data, error } = await supabase.storage
              .from('dracula')
              .download('dracula_story.json')

      if (error) throw error

      const text = await data.text()
      const storyData = JSON.parse(text)
      dialogues = storyData.dialogues

    } catch (err) {
      error = 'Ошибка загрузки диалогов: ' + err.message
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
      await supabase.auth.signOut()
      user = null
      session = null
      dialogues = []
      currentDialogueIndex = 0
    } catch (err) {
      error = 'Ошибка выхода: ' + err.message
    }
  }

  // Добавляем обработчик события
  onMount(() => {
    window.addEventListener('dialogueChange', handleDialogueChange)
    return () => window.removeEventListener('dialogueChange', handleDialogueChange)
  })
</script>

<div class="app">
  {#if isLoading}
    <div class="loading">
      <p>Загрузка...</p>
    </div>

  {:else if error}
    <div class="error">
      {error}
    </div>

  {:else if user && session}
    <!-- Шапка -->
    <div class="header">
      <div class="user-avatar">
        {#if user.user_metadata?.first_name}
          {user.user_metadata.first_name[0]}
        {:else}
          U
        {/if}
      </div>
      <div class="user-info">
        <h3 class="user-name">
          {user.user_metadata?.first_name} {user.user_metadata?.last_name || ''}
        </h3>
        <p class="user-meta">
          {#if user.user_metadata?.username}
            @{user.user_metadata.username}
          {:else}
            ID: {user.user_metadata?.telegram_id}
          {/if}
        </p>
      </div>
      <button class="button button-logout" onclick={logout}>
        Выйти
      </button>
    </div>

    <!-- Карусель диалогов -->
    <div class="dialogues-container">
      {#if dialogues.length > 0}
        <DialogueCard {dialogue} />

        <!-- Навигация -->
        <div class="dots-navigation">
          {#each dialogues as _, index}
            <div
                    class="dot {index === currentDialogueIndex ? 'active' : ''}"
                    onclick={() => goToDialogue(index)}
            />
          {/each}
        </div>

        <div class="navigation">
          <button class="nav-button" onclick={prevDialogue} disabled={currentDialogueIndex === 0}>
            ← Назад
          </button>
          <button class="nav-button" onclick={nextDialogue} disabled={currentDialogueIndex === dialogues.length - 1}>
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
    <!-- Аутентификация -->
    <div class="auth-section">
      <h1 class="welcome-title">
        {#if telegramUser}
          Привет, {telegramUser.first_name}!
        {:else}
          Дракула: История
        {/if}
      </h1>

      <p class="welcome-text">
        Погрузитесь в атмосферную историю с интерактивными диалогами
      </p>

      <button class="button" onclick={authenticate}>
        {#if telegramUser}
          Начать историю как {telegramUser.first_name}
        {:else}
          Начать историю
        {/if}
      </button>
    </div>
  {/if}
</div>