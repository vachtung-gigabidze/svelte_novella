<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let isTelegram = false;

  // Проверяем, что мы внутри Telegram WebApp
  onMount(() => {
    isTelegram = typeof window.Telegram?.WebApp !== 'undefined';
  });

  const telegramAuth = async () => {
    if (!isTelegram) {
      alert('Эта функция доступна только в Telegram');
      return;
    }

    try {
      const initData = window.Telegram.WebApp.initData;

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'telegram',
        token: initData.user.id,
        access_token: initData.hash
      });

      if (error) throw error;
      goto('/stories');
    } catch (err) {
      console.error('Auth error:', err);
      alert('Ошибка авторизации');
    }
  };
</script>

{#if isTelegram}
  <button on:click={telegramAuth} class="auth-btn">
    Войти через Telegram
  </button>
{:else}
  <p>Для авторизации откройте приложение в Telegram</p>
{/if}

<style>
  .auth-btn {
    background: #0088cc;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
  }
</style>