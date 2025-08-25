<script>
    import { authStore, signInAnonymously } from './auth.js'

    let username = ''
    let isLoading = false
    let error = ''

    async function handleSubmit() {
        if (!username.trim()) return

        isLoading = true
        error = ''

        try {
            await signInAnonymously(username.trim())
        } catch (err) {
            error = err.message
        } finally {
            isLoading = false
        }
    }
</script>

<div class="login-form">
    <h2>Введите имя пользователя</h2>

    <form on:submit|preventDefault={handleSubmit}>
        <input
                type="text"
                bind:value={username}
                placeholder="user1"
                disabled={isLoading}
        />

        <button type="submit" disabled={isLoading || !username.trim()}>
            {isLoading ? 'Загрузка...' : 'Войти'}
        </button>
    </form>

    {#if error}
        <div class="error-message">
            {error}
        </div>
    {/if}
</div>

<style>
    .login-form {
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
        margin-top: 0;
        color: #495057;
        text-align: center;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input {
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 1rem;
    }

    button {
        padding: 0.75rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
    }

    button:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
    }

    .error-message {
        margin-top: 1rem;
        padding: 0.75rem;
        background-color: #f8d7da;
        color: #721c24;
        border-radius: 4px;
        border: 1px solid #f5c6cb;
    }
</style>