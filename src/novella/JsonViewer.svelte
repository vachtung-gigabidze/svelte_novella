<script>
    import { supabase } from './supabase.js'
    import { authStore } from './auth.js'
    import { onMount } from 'svelte'

    let jsonData = null
    let isLoading = false
    let error = ''

    // Функция для загрузки JSON файла
    async function loadJsonFile() {
        let bucketName, username

        // Получаем текущие значения из store
        authStore.subscribe(store => {
            bucketName = store.bucketName
            username = store.user?.user_metadata?.username
        })()

        if (!bucketName || !username) {
            error = 'Не удалось определить бакет или пользователя'
            return
        }

        isLoading = true
        error = ''

        try {
            // Загрузка файла из Supabase Storage
            const { data, error: downloadError } = await supabase.storage
                .from(bucketName)
                .download(`${username}/data.json`)

            if (downloadError) throw downloadError

            // Чтение и парсинг файла
            const text = await data.text()
            jsonData = JSON.parse(text)
        } catch (err) {
            error = err.message
            console.error('Ошибка загрузки файла:', err)
        } finally {
            isLoading = false
        }
    }

    // Загружаем файл при монтировании компонента
    onMount(() => {
        loadJsonFile()
    })
</script>

<div class="json-viewer">
    {#if isLoading}
        <div class="loading">Загрузка данных...</div>
    {:else if error}
        <div class="error">
            <p>Ошибка: {error}</p>
            <button on:click={loadJsonFile}>Повторить</button>
        </div>
    {:else if jsonData}
        <div class="json-content">
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
    {:else}
        <div class="empty">Нет данных для отображения</div>
    {/if}
</div>

<style>
    .json-viewer {
        margin: 2rem auto;
        max-width: 1000px;
        padding: 0 1rem;
    }

    .loading, .empty {
        text-align: center;
        padding: 2rem;
        color: #6c757d;
    }

    .error {
        text-align: center;
        padding: 2rem;
        color: #dc3545;
    }

    .error button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .json-content {
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        padding: 1rem;
        overflow: auto;
    }

    pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-all;
    }
</style>