<!--<script lang="ts">-->

<!--  import Rive from './Rive.svelte'-->
<!--</script>-->

<!--<main>-->
<!--  <div class="card">-->
<!--    <Rive />-->
<!--  </div>-->
<!--</main>-->

<script>
  import { onMount } from 'svelte';
  import Rive from './Rive.svelte'
  // Инициализация Supabase (вынесите в отдельный файл, например, supabase.js)

  import { supabase }  from './lib/supabase.js' ;

  let isTelegram = false;
  let isLoading = false;
  let error = '';

  onMount(() => {
    isTelegram = !!window.Telegram?.WebApp;
  });

  const handleTelegramAuth = async () => {
    if (!isTelegram) return;

    isLoading = true;
    error = '';

    try {
      const tgWebApp = window.Telegram.WebApp;
      const initData = tgWebApp.initData;

      // Альтернатива для тестирования вне Telegram
      const testData = {
        user: { id: 12345 },
        hash: 'test_hash'
      };

      const authData = initData ? initData : testData;

      const { error: authError } = await supabase.auth.signInWithIdToken({
        provider: 'telegram',
        token: authData.user.id,
        access_token: authData.hash
      });

      if (authError) throw authError;

      // Перенаправление (замените на ваш роутер)
      window.location.href = '/stories';

    } catch (err) {
      error = err.message;
      console.error('Auth error:', err);
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="auth-container">
  {#if !isTelegram}
    <p class="warning">
      Откройте приложение в Telegram для авторизации
    </p>
  {:else}
    <Rive />
    <button
            on:click={handleTelegramAuth}
            disabled={isLoading}
            class="auth-btn"
    >
      {isLoading ? 'Вход...' : 'Войти через Telegram'}
    </button>

    {#if error}
      <p class="error">{error}</p>
    {/if}
  {/if}
</div>

<style>
  .auth-container {
    max-width: 300px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }

  .auth-btn {
    background: #0088cc;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
  }

  .auth-btn:hover {
    background: #006699;
  }

  .auth-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  .warning {
    color: #ff9900;
  }

  .error {
    color: #ff3333;
    margin-top: 10px;
  }
</style>