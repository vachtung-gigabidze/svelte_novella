<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';
  import { supabase } from './supabaseClient.js';
  import DialogueCard from './DialogueCard.svelte';


  // Состояния приложения
  let isLoading = true;
  let error = '';
  let user = null;
  let session = null;

  // Данные из Telegram
  let tg = null;
  let telegramUser = null;

  // Данные диалогов
  let dialogues = [];
  let currentDialogueIndex = 0;
  let storyData = null;

  // Инициализация приложения
  onMount(async () => {
    try {
      // Инициализируем Telegram Web App
      if (window.Telegram?.WebApp) {
        tg = window.Telegram.WebApp;
        tg.expand();
        tg.enableClosingConfirmation();
        tg.ready();

        // Получаем данные пользователя
        telegramUser = tg.initDataUnsafe?.user;

        // Проверяем существующую сессию
        const { data: sessionData } = await supabase.auth.getSession();
        session = sessionData?.session;

        if (session) {
          // Получаем данные пользователя из Supabase
          const { data: userData } = await supabase.auth.getUser();
          user = userData?.user;

          // Загружаем диалоги после входа
          await loadDialogues();
        }
      }
    } catch (err) {
      error = 'Ошибка инициализации: ' + err.message;
    } finally {
      isLoading = false;
    }

    // Добавляем обработчик события
    window.addEventListener('dialogueChange', handleDialogueChange);

    return () => {
      window.removeEventListener('dialogueChange', handleDialogueChange);
    };
  });

  // Обработчик изменения диалога
  function handleDialogueChange(event) {
    const nextDialogueId = event.detail.nextDialogueId;
    const nextIndex = dialogues.findIndex(d => d.id === nextDialogueId);

    if (nextIndex !== -1) {
      currentDialogueIndex = nextIndex;
    } else if (dialogue.nextDialogueId) {
      // Если nextDialogueId указан в текущем диалоге
      const fallbackIndex = dialogues.findIndex(d => d.id === dialogue.nextDialogueId);
      if (fallbackIndex !== -1) {
        currentDialogueIndex = fallbackIndex;
      }
    }
  }

  // Аутентификация через Telegram (вызов Edge Function)
  async function authenticate() {
    try {
      isLoading = true;
      error = "";

      const initData = tg.initData;
      if (!initData) {
        throw new Error("Telegram init data not available");
      }

      // Вызываем Edge Function для аутентификации
      const { data, error: invokeError } = await supabase.functions.invoke(
              "tma-auth",
              {
                body: { initData },
              }
      );

      if (invokeError) throw invokeError;

      // Устанавливаем сессию в Supabase Client
      const { error: authError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (authError) throw authError;

      // Получаем данные пользователя после установки сессии
      const { data: userData } = await supabase.auth.getUser();
      user = userData?.user;
      session = { access_token: data.access_token, refresh_token: data.refresh_token };

      // Загружаем диалоги после успешной аутентификации
      await loadDialogues();

    } catch (err) {
      error = "Ошибка авторизации: " + err.message;
      console.error('Auth error:', err);
    } finally {
      isLoading = false;
    }
  }

  // Загрузка диалогов из Supabase Storage
  async function loadDialogues() {
    try {
      const { data, error } = await supabase.storage
              .from('dracula')
              .download('dracula_story.json');

      if (error) throw error;

      // Читаем содержимое файла
      const text = await data.text();
      storyData = JSON.parse(text);
      dialogues = storyData.dialogues;

    } catch (err) {
      error = 'Ошибка загрузки диалогов: ' + err.message;
    }
  }

  // Навигация по диалогам
  function nextDialogue() {
    if (currentDialogueIndex < dialogues.length - 1) {
      currentDialogueIndex++;
    }
  }

  function prevDialogue() {
    if (currentDialogueIndex > 0) {
      currentDialogueIndex--;
    }
  }

  function goToDialogue(index) {
    currentDialogueIndex = index;
  }

  // Выход из системы
  async function logout() {
    try {
      await supabaseClient.auth.signOut();
      user = null;
      session = null;
      dialogues = [];
      currentDialogueIndex = 0;
    } catch (err) {
      error = 'Ошибка выхода: ' + err.message;
    }
  }
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
    <!-- Шапка с информацией пользователя -->
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
      <button class="button button-logout" on:click={logout}>
        Выйти
      </button>
    </div>

    <!-- Карусель диалогов -->
    <div class="dialogues-container">
      {#if dialogues.length > 0}
        <DialogueCard
                dialogue={dialogues[currentDialogueIndex]}
                on:dialogueChange={handleDialogueChange}
        />

        <!-- Навигация точками -->
        <div class="dots-navigation">
          {#each dialogues as _, index}
            <div
                    class="dot {index === currentDialogueIndex ? 'active' : ''}"
                    on:click={() => goToDialogue(index)}
            />
          {/each}
        </div>

        <!-- Кнопки навигации -->
        <div class="navigation">
          <button
                  class="nav-button"
                  on:click={prevDialogue}
                  disabled={currentDialogueIndex === 0}
          >
            ← Назад
          </button>

          <button
                  class="nav-button"
                  on:click={nextDialogue}
                  disabled={currentDialogueIndex === dialogues.length - 1}
          >
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
        {#if telegramUser}
          Привет, {telegramUser.first_name}!
        {:else}
          Дракула: История
        {/if}
      </h1>

      <p class="welcome-text">
        Погрузитесь в атмосферную историю с интерактивными диалогами
      </p>

      <button class="button" on:click={authenticate}>
        {#if telegramUser}
          Начать историю как {telegramUser.first_name}
        {:else}
          Начать историю
        {/if}
      </button>
    </div>
  {/if}
</div>