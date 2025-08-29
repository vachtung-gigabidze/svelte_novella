<script>
  import { onMount } from "svelte";
  import Rive from "./Rive.svelte";

  let { dialogue } = $props();

  let backgroundImageUrl = $state(null);
  let characterImageUrl = $state(null);

  let errorMedia = $state(null);
  // Динамический импорт Rive
  onMount(async () => {
    // try {
    //   RiveRuntime = await import("rive-js");
    // } catch (err) {
    //   console.error("Failed to load Rive runtime:", err);
    //   errorMedia = "Не удалось загрузить анимацию";
    // }
  });

  // Загрузка медиа-файлов из /assets/
  async function loadMediaFiles() {
    try {
      errorMedia = null;

      // Загружаем background image
      if (dialogue.backgroundImage) {
        try {
          if (dialogue.backgroundImage.endsWith(".riv")) {
           // await loadRiveAnimation(dialogue.backgroundImage, "background");
          } else {
            backgroundImageUrl = `/assets/${dialogue.backgroundImage}`;
            await testImage(backgroundImageUrl);
          }
        } catch (err) {
          console.warn("Background not found:", dialogue.backgroundImage);
          backgroundImageUrl = null;
        }
      }

      // Загружаем character image
      if (dialogue.characterImage) {
        try {
          if (dialogue.characterImage.endsWith(".riv")) {
            //await loadRiveAnimation(dialogue.characterImage, "character");
          } else {
            characterImageUrl = `/assets/${dialogue.characterImage}`;
            await testImage(characterImageUrl);
          }
        } catch (err) {
          console.warn("Character not found:", dialogue.characterImage);
          characterImageUrl = null;
        }
      }
    } catch (err) {
      errorMedia = "Ошибка загрузки медиа: " + err.message;
      console.error("Media loading error:", err);
      // Fallback: показываем placeholder вместо анимации
      if (dialogue.backgroundImage?.endsWith(".riv")) {
        backgroundImageUrl = null;
      }
      if (dialogue.characterImage?.endsWith(".riv")) {
        characterImageUrl = null;
      }
    } finally {
    }
  }

  // // Загрузка Rive анимации
  // async function loadRiveAnimation(filename, type) {
  //   try {
  //     const response = await fetch(`/assets/${filename}`);
  //     if (!response.ok) throw new Error("Rive file not found");

  //     const arrayBuffer = await response.arrayBuffer();

  //     // Создаем canvas для анимации
  //     const canvasId = `${type}-rive-canvas`;
  //     let canvas = document.getElementById(canvasId);

  //     if (!canvas) {
  //       canvas = document.createElement("canvas");
  //       canvas.id = canvasId;
  //       canvas.className = `rive-canvas ${type}-rive`;
  //       canvas.width = type === "background" ? 800 : 400;
  //       canvas.height = type === "background" ? 600 : 400;

  //       const container = document.createElement("div");
  //       container.className = `rive-container ${type}-rive-container`;
  //       container.appendChild(canvas);

  //       if (type === "background") {
  //         document.querySelector(".background-media")?.appendChild(container);
  //       } else {
  //         document.querySelector(".character-media")?.appendChild(container);
  //       }
  //     }

  //     // Применяем state machine если указана
  //     if (dialogue.stateMachineBackgroundRive && type === "background") {
  //       setTimeout(() => {
  //         try {
  //         } catch (err) {
  //           console.warn(
  //             "State machine not found:",
  //             dialogue.stateMachineBackgroundRive
  //           );
  //         }
  //       }, 100);
  //     }

  //     // Запускаем триггер если указан
  //     if (dialogue.smTriggerBackgroundRive && type === "background") {
  //       setTimeout(() => {
  //         try {
  //         } catch (err) {
  //           console.warn(
  //             "Trigger not found:",
  //             dialogue.smTriggerBackgroundRive
  //           );
  //         }
  //       }, 200);
  //     }
  //   } catch (err) {
  //     console.error("Rive loading error:", err);
  //     throw err;
  //   }
  // }

  // Функция для проверки доступности изображения
  function testImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Image not found: ${url}`));
      img.src = url;
    });
  }

  // Эффект для загрузки медиа при изменении диалога
   loadMediaFiles();

  // Обработчик выбора варианта ответа
  function handleOptionSelect(nextDialogueId) {
    const event = new CustomEvent("dialogueChange", {
      detail: { nextDialogueId },
    });
    window.dispatchEvent(event);
  }
</script>

<div class="dialogue-container">
  <!-- Фон -->
  {#if dialogue.backgroundImage}
    <div class="background-media">
      {#if dialogue.backgroundImage.endsWith(".riv")}
        <Rive fileName={dialogue.backgroundImage} />
      {:else}
        <img
          src={backgroundImageUrl ? backgroundImageUrl : ""}
          alt="Background"
          class="background-image"
          class:hidden={!backgroundImageUrl}
          onerror={() => {
            errorMedia = "Ошибка загрузки фона: " + dialogue.backgroundImage;
            backgroundImageUrl = null;
          }}
        />
      {/if}
    </div>
  {/if}

  <!-- Персонаж -->
  {#if dialogue.characterImage}
    <div class="character-media">
      {#if dialogue.characterImage.endsWith(".riv")}
        <Rive fileName={dialogue.characterImage} />
      {:else}
        <img
          src={characterImageUrl ? characterImageUrl : ""}
          alt="Character"
          class="character-image"
          class:hidden={!characterImageUrl}
          onerror={() => {
            errorMedia =
              "Ошибка загрузки персонажа: " + dialogue.characterImage;
            characterImageUrl = null;
          }}
        />
      {/if}
    </div>
  {/if}

  <!-- Текст диалога -->
  <div class="dialogue-content">
    <div class="dialogue-text">
      "{dialogue.text}"
    </div>

    <!-- Варианты ответов -->
    {#if dialogue.options && dialogue.options.length > 0}
      <div class="options-container">
        {#each dialogue.options as option (option.text)}
          <button
            class="option-button"
            onclick={() => handleOptionSelect(option.nextDialogueId)}
          >
            {option.text}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Сообщение об ошибке -->
  {#if errorMedia}
    <div class="error-overlay">
      <p class="error-text">{errorMedia}</p>
    </div>
  {/if}

  <!-- Отладочная информация -->
  {#if import.meta.env.DEV}
    <div class="debug-info">
      <p>BG: {dialogue.backgroundImage || "нет"}</p>
      <p>Char: {dialogue.characterImage || "нет"}</p>
      <p>State Machine: {dialogue.stateMachineBackgroundRive || "нет"}</p>
      <p>Trigger: {dialogue.smTriggerBackgroundRive || "нет"}</p>
    </div>
  {/if}
</div>

<style>
  .dialogue-container {
    position: relative;
    width: 100%;
    height: 500px;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(139, 0, 0, 0.3);
    margin-bottom: 20px;
  }

  .background-media {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index:1;
    max-height: 70%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.7;
  }

  .character-media {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    max-height: 70%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .character-image {
    height: 100%;
    max-height: 300px;
    object-fit: contain;
  }

  /* Rive стили */
  .rive-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rive-canvas {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .background-rive-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .background-rive {
    width: 100%;
    height: 100%;
  }

  .character-rive-container {
    position: relative;
    height: 100%;
    max-height: 300px;
  }

  .character-rive {
    height: 100%;
    max-height: 300px;
  }

  .rive-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: rgba(255, 255, 255, 0.7);
  }

  .rive-loading-spinner {
    width: 30px;
    height: 30px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid #8b0000;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }

  .rive-loading.hidden {
    display: none;
  }

  .dialogue-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
    padding: 20px;
  }

  .dialogue-text {
    font-size: 18px;
    line-height: 1.4;
    text-align: center;
    margin: 0 0 20px 0;
    color: #ffffff;
    font-style: italic;
    font-weight: 500;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }

  .options-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    margin: 0 auto;
  }

  .option-button {
    background: rgba(139, 0, 0, 0.6);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
  }

  .option-button:hover {
    background: rgba(139, 0, 0, 0.8);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 0, 0, 0.4);
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    color: white;
    gap: 16px;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #8b0000;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .error-overlay {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    background: rgba(255, 59, 48, 0.2);
    color: #ff3b30;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid rgba(255, 59, 48, 0.3);
    z-index: 10;
    font-size: 12px;
  }

  .debug-info {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.6);
    padding: 8px;
    border-radius: 6px;
    font-size: 10px;
    color: #ccc;
    z-index: 4;
  }

  .hidden {
    display: none !important;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
