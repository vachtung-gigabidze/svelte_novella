<script>
    import {authStore} from './auth.js'
    import { supabase } from './supabase.js'
    // Инициализация Telegram Web App
    const tg = window.Telegram.WebApp;
    let appError = $state('');

    tg.expand(); // Раскрываем на весь экран
    tg.enableClosingConfirmation(); // Подтверждение закрытия



    // Проверка аутентификации
    async function initApp() {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (session && session.user) {
            showContent(session.user);
        } else {
            // Показываем кнопку аутентификации
            document.getElementById('auth-section').style.display = 'block';

            // Показываем данные пользователя из Telegram
            const user = tg.initDataUnsafe?.user;
            if (user) {
                document.getElementById('user-data').innerHTML = `
                        <p>Привет, ${user.first_name}!</p>
                        <p>@${user.username}</p>
                    `;
            }
        }
    }

    // Аутентификация через Telegram
    async function authenticate() {
        try {
            const initData = tg.initData;

            const { data, error } = await supabase.functions.invoke('tma-auth', {
                body: { initData }
            });

            if (error) throw error;

            // Устанавливаем сессию
            const { error: authError } = await supabase.auth.setSession({
                access_token: data.access_token,
                refresh_token: data.refresh_token
            });

            if (authError) throw authError;

            showContent(data.user);

        } catch (error) {
            console.error('Auth error:', error);
            appError = `Auth error: ${error}`
            tg.showPopup({ title: 'Ошибка', message: 'Не удалось войти' });
        }
    }

    function showContent(user) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('content').style.display = 'block';

        // Здесь можно загружать защищенный контент
        loadProtectedContent();
    }

    async function loadProtectedContent() {
        // Пример запроса к защищенному API
        const { data, error } = await supabase
            .from('protected_data')
            .select('*');

        if (!error) {
            console.log('Protected data:', data);
        }
    }

    // Инициализация при загрузке
    tg.ready();
    initApp();
</script>

<div class="container">
    <h1>Мое TMA Приложение</h1>
    <div id="user-data"></div>
    <div id="auth-section" style="display:none;">
        <button class="button" onclick={authenticate}>Войти через Telegram</button>
    </div>
    <div id="content" style="display:none;">
        <h2>Добро пожаловать!</h2>
        <p>Вы успешно аутентифицированы</p>
    </div>
</div>
{#if appError}
    <p class="error">{appError}</p>
{/if}
<style>
    .error {
        color: red;
    }
</style>