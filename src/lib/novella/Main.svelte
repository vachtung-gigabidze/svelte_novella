<script>
  import { onMount } from "svelte";
  import DialogueCard from "./DialogueCard.svelte";
  import {bucketName, supabaseUrlFile} from '../store/store.svelte'
  let user = $state({ name: "Игрок" });
  let isLoading = $state(true);
  let error = $state("");
  let dialogues = $state([]);
  let currentDialogueIndex = $state(0);
  //setContext('defaultAssetsUrl', '/assets/');///svelte_novella
  // Инициализация приложения
  onMount(async () => {
    try {
      await loadDialogues();
    } catch (err) {
      error = "Ошибка загрузки истории: " + err.message;
      console.error("Load error:", err);
    } finally {
      isLoading = false;
    }
  });

  // Загрузка диалогов из /assets/dracula_story.json
  async function loadDialogues() {
    try {
      //console.log(`${defaultAssetsUrl}dracula_story.json`);

      const response = await fetch(`${supabaseUrlFile}/storage/v1/object/public/${bucketName}/dracula_story.json`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const storyData = await response.json();

      if (!storyData.dialogues || !Array.isArray(storyData.dialogues)) {
        throw new Error(
          "Неверный формат файла истории: отсутствует dialogues array"
        );
      }

      dialogues = storyData.dialogues;
      console.log("Диалоги загружены:", dialogues.length);
    } catch (err) {
      error = "Ошибка загрузки истории: " + err.message;
      console.error("Load dialogues error:", err);
      throw err;
    }
  }

  // Обработчик изменения диалога
  function handleDialogueChange(event) {
    const nextDialogueId = event.detail.nextDialogueId;
    const nextIndex = dialogues.findIndex((d) => d.id === nextDialogueId);

    if (nextIndex !== -1) {
      currentDialogueIndex = nextIndex;
    } else {
      // Если nextDialogueId не найден, пытаемся найти по nextDialogueId текущего диалога
      const currentDialogue = dialogues[currentDialogueIndex];
      if (currentDialogue.nextDialogueId) {
        const fallbackIndex = dialogues.findIndex(
          (d) => d.id === currentDialogue.nextDialogueId
        );
        if (fallbackIndex !== -1) {
          currentDialogueIndex = fallbackIndex;
        }
      }
    }
  }

  // Навигация
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

  function restartStory() {
    currentDialogueIndex = 0;
  }

  // Перезагрузка истории
  async function reloadStory() {
    isLoading = true;
    error = "";
    try {
      await loadDialogues();
      currentDialogueIndex = 0;
    } catch (err) {
      error = "Ошибка перезагрузки: " + err.message;
    } finally {
      isLoading = false;
    }
  }

  // Добавляем обработчик события диалогов
  onMount(() => {
    window.addEventListener("dialogueChange", handleDialogueChange);
    return () =>
      window.removeEventListener("dialogueChange", handleDialogueChange);
  });
</script>

<div class="app">
  {#if isLoading}
    <div class="loading">
      <p>🔄 Загрузка истории Дракулы...</p>
    </div>
  {:else if error}
    <div class="error">
      ⚠️ {error}
      <div style="margin-top: 15px;">
        <button onclick={reloadStory} class="nav-button">
          🔄 Попробовать снова
        </button>
      </div>
    </div>
  {:else if dialogues.length > 0}
    <!-- Шапка -->
    <!-- <div class="header">
      <div class="user-avatar">
        {user.name[0].toUpperCase()}
      </div>
      <div class="user-info">
        <h3 class="user-name">
          {user.name}
        </h3>
        <p class="user-email">
          Прогресс: {currentDialogueIndex + 1} / {dialogues.length}
        </p>
      </div>
      <button class="nav-button" onclick={restartStory}>
        🔄 Начать сначала
      </button>
    </div> -->

    <!-- Карусель диалогов -->
    <div class="dialogues-container" onclick={()=>nextDialogue()}>
      <DialogueCard index={currentDialogueIndex} dialogue={dialogues[currentDialogueIndex]} />

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
        <button
          class="nav-button"
          onclick={prevDialogue}
          disabled={currentDialogueIndex === 0}
        >
          ← Назад
        </button>
        <button
          class="nav-button"
          onclick={nextDialogue}
          disabled={currentDialogueIndex === dialogues.length - 1}
        >
          Вперед →
        </button>
      </div>

      <div class="progress-info">
        Сцена {currentDialogueIndex + 1} из {dialogues.length}
      </div>
    </div>
  {:else}
    <!-- Экран приветствия -->
    <div class="welcome-section">
      <h1 class="welcome-title">🧛‍♂️ Дракула: Интерактивная история</h1>

      <p class="welcome-text">
        Погрузитесь в атмосферную готическую историю с интерактивными диалогами.<br
        />
        Принимайте решения, которые влияют на развитие сюжета.
      </p>

      <button class="start-button" onclick={restartStory}>
        🎭 Начать историю
      </button>
    </div>
  {/if}
</div>
