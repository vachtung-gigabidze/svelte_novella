<script>
    import { supabase } from '../supabaseClient'

    let email = $state('')
    let password = $state('')
    let confirmPassword = $state('')
    let isLoading = $state(false)
    let error = $state('')
    let isLogin = $state(true)
    let successMessage = $state('')

    async function handleAuth() {
        try {
            isLoading = true
            error = ''
            successMessage = ''

            // Валидация
            if (!email || !password) {
                throw new Error('Заполните все поля')
            }

            if (!isLogin) {
                if (password !== confirmPassword) {
                    throw new Error('Пароли не совпадают')
                }
                if (password.length < 6) {
                    throw new Error('Пароль должен содержать минимум 6 символов')
                }
            }

            let result

            if (isLogin) {
                // Вход
                result = await supabase.auth.signInWithPassword({
                    email: email.toLowerCase().trim(),
                    password
                })
            } else {
                // Регистрация
                result = await supabase.auth.signUp({
                    email: email.toLowerCase().trim(),
                    password,
                    options: {
                        emailRedirectTo: window.location.origin,
                        data: {
                            created_at: new Date().toISOString(),
                            username: email.split('@')[0]
                        }
                    }
                })
            }

            if (result.error) {
                throw new Error(result.error.message)
            }

            if (isLogin) {
                // Успешный вход
                window.dispatchEvent(new CustomEvent('authSuccess', {
                    detail: {
                        user: result.data.user,
                        session: result.data.session
                    }
                }))
            } else {
                // Успешная регистрация
                successMessage = 'Проверьте вашу почту для подтверждения регистрации!'
                // Очищаем форму после успешной регистрации
                email = ''
                password = ''
                confirmPassword = ''
            }

        } catch (err) {
            error = `Auth error: ${err.message}`;
            console.error('Auth error:', err)
        } finally {
            isLoading = false
        }
    }

    function switchMode() {
        isLogin = !isLogin
        error = ''
        successMessage = ''
        password = ''
        confirmPassword = ''
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleAuth()
        }
    }
</script>

<div class="auth-form">
    <h2 class="auth-title">
        {#if isLogin}
            Вход в систему
        {:else}
            Регистрация
        {/if}
    </h2>

    {#if error}
        <div class="auth-error">
            ⚠️ {error}
        </div>
    {/if}

    {#if successMessage}
        <div class="auth-success">
            ✅ {successMessage}
        </div>
    {/if}

    <form on:submit|preventDefault={handleAuth}>
        <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
                    id="email"
                    type="email"
                    bind:value={email}
                    required
                    class="form-input"
                    placeholder="Введите ваш email"
                    on:keypress={handleKeyPress}
                    disabled={isLoading}
            />
        </div>

        <div class="form-group">
            <label for="password" class="form-label">Пароль</label>
            <input
                    id="password"
                    type="password"
                    bind:value={password}
                    required
                    class="form-input"
                    placeholder="Введите пароль"
                    minlength="6"
                    on:keypress={handleKeyPress}
                    disabled={isLoading}
            />
        </div>

        {#if !isLogin}
            <div class="form-group">
                <label for="confirmPassword" class="form-label">Подтверждение пароля</label>
                <input
                        id="confirmPassword"
                        type="password"
                        bind:value={confirmPassword}
                        required
                        class="form-input"
                        placeholder="Повторите пароль"
                        minlength="6"
                        on:keypress={handleKeyPress}
                        disabled={isLoading}
                />
            </div>
        {/if}

        <button
                type="submit"
                class="auth-button"
                disabled={isLoading}
        >
            {#if isLoading}
                <div class="button-spinner"></div>
                {#if isLogin}
                    Вход...
                {:else}
                    Регистрация...
                {/if}
            {:else}
                {#if isLogin}
                    Войти
                {:else}
                    Зарегистрироваться
                {/if}
            {/if}
        </button>
    </form>

    <div class="auth-switch">
        <p>
            {#if isLogin}
                Нет аккаунта?
            {:else}
                Уже есть аккаунт?
            {/if}
            <button on:click={switchMode} class="switch-button" disabled={isLoading}>
                {#if isLogin}
                    Зарегистрироваться
                {:else}
                    Войти
                {/if}
            </button>
        </p>
    </div>
</div>

<style>
    .auth-form {
        max-width: 400px;
        margin: 0 auto;
        padding: 40px 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .auth-title {
        text-align: center;
        margin: 0 0 30px 0;
        color: #ffffff;
        font-size: 24px;
        font-weight: 600;
    }

    .auth-error {
        background: rgba(255, 59, 48, 0.2);
        color: #ff3b30;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 59, 48, 0.3);
        font-size: 14px;
    }

    .auth-success {
        background: rgba(76, 175, 80, 0.2);
        color: #4caf50;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 1px solid rgba(76, 175, 80, 0.3);
        font-size: 14px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-label {
        display: block;
        margin-bottom: 8px;
        color: #cccccc;
        font-size: 14px;
        font-weight: 500;
    }

    .form-input {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.3);
        color: #ffffff;
        font-size: 16px;
        transition: border-color 0.2s;
    }

    .form-input:focus {
        outline: none;
        border-color: #8b0000;
        background: rgba(0, 0, 0, 0.4);
    }

    .form-input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .form-input::placeholder {
        color: #888888;
    }

    .auth-button {
        width: 100%;
        padding: 14px;
        background: #8b0000;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 48px;
    }

    .auth-button:hover:not(:disabled) {
        background: #a52a2a;
        transform: translateY(-1px);
    }

    .auth-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    .button-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .auth-switch {
        text-align: center;
        margin-top: 20px;
        color: #cccccc;
        font-size: 14px;
    }

    .switch-button {
        background: none;
        border: none;
        color: #8b0000;
        cursor: pointer;
        text-decoration: underline;
        font-size: inherit;
        padding: 0;
        margin-left: 5px;
    }

    .switch-button:hover:not(:disabled) {
        color: #a52a2a;
    }

    .switch-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>