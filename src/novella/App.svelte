<script>
    import {authStore} from './auth.js'
    import { supabase } from './supabase.js'
    let appError = $state('');
    // Инициализация Telegram Web App
    const tg = window.Telegram.WebApp;
    // const SUPABASE_URL = 'https://your-project.supabase.co';
    // const SUPABASE_ANON_KEY = 'your-anon-key';

    // const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Основная функция инициализации
    async function initApp() {
        try {
            tg.expand();
            tg.enableClosingConfirmation();

            // Проверяем существующую сессию
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (session && session.user) {
                showContent(session.user);
            } else {
                showAuthSection();
            }
        } catch (error) {
            showError('Ошибка инициализации: ' + error.message);
        }
    }

    // Показ секции аутентификации
    function showAuthSection() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('auth-section').style.display = 'block';

        // Показываем данные пользователя из Telegram
        const user = tg.initDataUnsafe?.user;
        if (user) {
            document.getElementById('user-info').innerHTML = `
                    <p>👋 Привет, <strong>${user.first_name}</strong>!</p>
                    ${user.username ? `<p>📱 @${user.username}</p>` : ''}
                `;
        }
    }

    // Аутентификация через Telegram
    async function authenticate() {
        try {
            const initData = tg.initData;
            if (!initData) {
                throw new Error('Telegram init data not available');
            }

            // Вызываем Edge Function для аутентификации
            const { data, error } = await supabase.functions.invoke('tma-auth', {
                body: { initData }
            });

            if (error) throw error;

            // Устанавливаем сессию в Supabase Client
            const { error: authError } = await supabase.auth.setSession({
                access_token: data.access_token,
                refresh_token: data.refresh_token
            });

            if (authError) throw authError;

            showContent(data.user);

        } catch (error) {
            console.log(appError);
            console.error('Auth error:', error);
            showError('Ошибка авторизации: ' + error.message);
        }
    }

    // Показ авторизованного контента
    function showContent(user) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('content').style.display = 'block';

        // Загружаем защищенные данные
        loadProtectedData();
    }

    // Загрузка защищенных данных
    async function loadProtectedData() {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('telegram_id', tg.initDataUnsafe.user.id);

            if (error) throw error;

            console.log('Protected data loaded:', data);
        } catch (error) {
            console.error('Error loading protected data:', error);
        }
    }

    // Выход из системы
    async function logout() {
        try {
            await supabase.auth.signOut();
            window.location.reload();
        } catch (error) {
            showError('Ошибка выхода: ' + error.message);
        }
    }

    // Показать ошибку
    function showError(message) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = message;
    }

    // Инициализация при загрузке
    tg.ready();
    initApp();
</script>

<div class="container">
    <div id="loading" class="loading">Загрузка...</div>

    <div id="auth-section" style="display:none;">
        <h2>Добро пожаловать!</h2>
        <div id="user-info"></div>
        <button class="button" onclick="authenticate()">Войти через Telegram</button>
    </div>

    <div id="content" style="display:none;">
        <h2>🎉 Вы авторизованы!</h2>
        <p>Теперь вам доступны все функции приложения</p>
        <button class="button" onclick="logout()">Выйти</button>
    </div>

    <div id="error" class="error" style="display:none;"></div>
</div>
{#if appError}
    <p class="error">{appError}</p>
{/if}
