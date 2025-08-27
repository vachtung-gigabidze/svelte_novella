<!-- App.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "./supabase";

  // Состояния приложения
  let isLoading = true;
  let error = "";
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
      error = "Ошибка инициализации: " + err.message;
    } finally {
      isLoading = false;
    }
  });

  // Загрузка диалогов из Supabase Storage
  async function loadDialogues() {
    try {
      const { data, error } = await supabase.storage
        .from("dracula")
        .download("dracula_story.json");

      if (error) throw error;

      // Читаем содержимое файла
      const text = await data.text();
      storyData = JSON.parse(text);
      dialogues = storyData.dialogues;
    } catch (err) {
      error = "Ошибка загрузки диалогов: " + err.message;
    }
  }

  // Аутентификация через Telegram
  async function authenticate() {
    try {
      isLoading = true;
      error = "";

      if (!telegramUser?.id) {
        throw new Error("Данные Telegram не доступны");
      }

      // Создаем учетные данные из данных Telegram
      const email = `tg_${telegramUser.id}@tma.example.com`;
      const password = telegramUser.id.toString();

      // Выполняем вход
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      user = authData.user;
      session = authData.session;

      // Загружаем диалоги после успешной аутентификации
      await loadDialogues();
    } catch (err) {
      error = "Ошибка авторизации: " + err.message;
    } finally {
      isLoading = false;
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
      await supabase.auth.signOut();
      user = null;
      session = null;
      dialogues = [];
      currentDialogueIndex = 0;
    } catch (err) {
      error = "Ошибка выхода: " + err.message;
    }
  }
</script>

<svelte:head>
  <title>Dracula Story</title>
  <style>
    :global(body) {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 0;
      background: var(--tg-theme-bg-color, #000000);
      color: var(--tg-theme-text-color, #ffffff);
    }

    .app {
      min-height: 100vh;
      padding: 0;
      max-width: 100%;
      margin: 0 auto;
    }

    .header {
      background: rgba(0, 0, 0, 0.8);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--tg-theme-button-color, #8b0000);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      font-weight: 600;
      font-size: 14px;
      margin: 0 0 2px 0;
      color: #ffffff;
    }

    .user-meta {
      font-size: 12px;
      opacity: 0.7;
      margin: 0;
      color: #cccccc;
    }

    .dialogues-container {
      padding: 20px;
      min-height: calc(100vh - 120px);
      display: flex;
      flex-direction: column;
    }

    .dialogue-card {
      background: rgba(139, 0, 0, 0.1);
      border: 1px solid rgba(139, 0, 0, 0.3);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .dialogue-text {
      font-size: 18px;
      line-height: 1.6;
      text-align: center;
      margin: 0 0 24px 0;
      color: #ffffff;
      font-style: italic;
    }

    .dialogue-meta {
      font-size: 12px;
      opacity: 0.6;
      text-align: center;
      margin: 8px 0;
      color: #cccccc;
    }

    .navigation {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 20px;
    }

    .nav-button {
      background: rgba(139, 0, 0, 0.3);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 25px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .nav-button:hover {
      background: rgba(139, 0, 0, 0.5);
    }

    .nav-button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .dots-navigation {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin: 16px 0;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: background 0.2s;
    }

    .dot.active {
      background: var(--tg-theme-button-color, #8b0000);
    }

    .dot:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      font-size: 16px;
      color: #ffffff;
    }

    .error {
      background: rgba(255, 59, 48, 0.2);
      color: #ff3b30;
      padding: 12px;
      border-radius: 8px;
      margin: 16px;
      font-size: 14px;
      border: 1px solid rgba(255, 59, 48, 0.3);
    }

    .auth-section {
      text-align: center;
      padding: 60px 20px;
      background: rgba(0, 0, 0, 0.9);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .welcome-title {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #ffffff;
    }

    .welcome-text {
      font-size: 16px;
      opacity: 0.8;
      margin: 0 0 32px 0;
      color: #cccccc;
    }

    .button {
      background: var(--tg-theme-button-color, #8b0000);
      color: var(--tg-theme-button-text-color, #ffffff);
      border: none;
      padding: 16px 32px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .button:hover {
      opacity: 0.9;
    }

    .button-logout {
      background: rgba(255, 59, 48, 0.3);
      color: #ff3b30;
      padding: 8px 16px;
      font-size: 12px;
    }
  </style>
</svelte:head>

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
        {#if telegramUser?.first_name}
          {telegramUser.first_name[0]}
        {:else}
          U
        {/if}
      </div>
      <div class="user-info">
        <h3 class="user-name">
          {telegramUser?.first_name}
          {telegramUser?.last_name || ""}
        </h3>
        <p class="user-meta">
          {#if telegramUser?.username}
            @{telegramUser.username}
          {:else}
            ID: {telegramUser?.id}
          {/if}
        </p>
      </div>
      <button class="button button-logout" on:click={logout}> Выйти </button>
    </div>

    <!-- Карусель диалогов -->
    <div class="dialogues-container">
      {#if dialogues.length > 0}
        <div class="dialogue-card">
          <p class="dialogue-text">
            "{dialogues[currentDialogueIndex].text}"
          </p>

          {#if dialogues[currentDialogueIndex].backgroundImage}
            <p class="dialogue-meta">
              Background: {dialogues[currentDialogueIndex].backgroundImage}
            </p>
          {/if}

          {#if dialogues[currentDialogueIndex].stateMachineBackgroundRive}
            <p class="dialogue-meta">
              Rive State: {dialogues[currentDialogueIndex]
                .stateMachineBackgroundRive}
            </p>
          {/if}
        </div>

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
