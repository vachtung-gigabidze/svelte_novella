<!-- DialogueCard.svelte -->
<script>
    import { onMount } from 'svelte';
    import { supabase } from './supabaseClient.js';

    let { dialogue } = $props(); // Вместо export let dialogue

    let backgroundImageUrl = $state(null);
    let characterImageUrl = $state(null);
    let isLoading = $state(true);
    let error = $state(null);

    // Загрузка медиа-файлов
    async function loadMediaFiles() {
        try {
            isLoading = true;
            error = null;

            // Загружаем background image
            if (dialogue.backgroundImage && dialogue.backgroundImage !== 'back.riv') {
                const { data: bgData, error: bgError } = await supabase.storage
                    .from('dracula')
                    .download(dialogue.backgroundImage);

                if (!bgError && bgData) {
                    backgroundImageUrl = URL.createObjectURL(bgData);
                }
            }

            // Загружаем character image
            if (dialogue.characterImage) {
                const { data: charData, error: charError } = await supabase.storage
                    .from('dracula')
                    .download(dialogue.characterImage);

                if (!charError && charData) {
                    characterImageUrl = URL.createObjectURL(charData);
                }
            }

        } catch (err) {
            error = 'Ошибка загрузки медиа: ' + err.message;
            console.error('Media loading error:', err);
        } finally {
            isLoading = false;
        }
    }

    // Очистка URL объектов
    function cleanupUrls() {
        if (backgroundImageUrl) URL.revokeObjectURL(backgroundImageUrl);
        if (characterImageUrl) URL.revokeObjectURL(characterImageUrl);
        backgroundImageUrl = null;
        characterImageUrl = null;
    }

    // Эффект для загрузки медиа при изменении диалога
    $effect(() => {
        cleanupUrls();
        loadMediaFiles();

        return () => {
            cleanupUrls();
        };
    });

    // Обработчик выбора варианта ответа
    function handleOptionSelect(nextDialogueId) {
        const event = new CustomEvent('dialogueChange', {
            detail: { nextDialogueId }
        });
        window.dispatchEvent(event);
    }
</script>

<div class="dialogue-container">
    <!-- Фон -->
    {#if backgroundImageUrl}
        <div class="background-media">
            {#if dialogue.backgroundImage.endsWith('.riv')}
                <div class="rive-container">
                    <p class="media-placeholder">Rive Animation: {dialogue.backgroundImage}</p>
                </div>
            {:else}
                <img
                        src={backgroundImageUrl}
                        alt="Background"
                        class="background-image"
                        onload={() => isLoading = false}
                        onerror={(e) => {
            error = 'Ошибка загрузки фона';
            console.error('Background load error:', e);
          }}
                />
            {/if}
        </div>
    {/if}

    <!-- Персонаж -->
    {#if characterImageUrl}
        <div class="character-media">
            {#if dialogue.characterImage.endsWith('.riv')}
                <div class="rive-container">
                    <p class="media-placeholder">Character Rive: {dialogue.characterImage}</p>
                </div>
            {:else}
                <img
                        src={characterImageUrl}
                        alt="Character"
                        class="character-image"
                        onload={() => isLoading = false}
                        onerror={(e) => {
            error = 'Ошибка загрузки персонажа';
            console.error('Character load error:', e);
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

    <!-- Индикатор загрузки -->
    {#if isLoading}
        <div class="loading-overlay">
            <div class="loading-spinner"></div>
        </div>
    {/if}

    <!-- Сообщение об ошибке -->
    {#if error}
        <div class="error-overlay">
            <p class="error-text">{error}</p>
        </div>
    {/if}

    <!-- Отладочная информация -->
    <div class="debug-info">
        <p class="dialogue-id">ID: {dialogue.id} → Next: {dialogue.nextDialogueId}</p>
        {#if dialogue.stateMachineBackgroundRive}
            <p class="dialogue-meta">🎬 BG Animation: {dialogue.stateMachineBackgroundRive}</p>
        {/if}
        {#if dialogue.smTriggerBackgroundRive}
            <p class="dialogue-meta">⚡ Trigger: {dialogue.smTriggerBackgroundRive}</p>
        {/if}
    </div>
</div>

<style>
    /* Стили остаются без изменений */
    .dialogue-container {
        position: relative;
        width: 100%;
        height: 400px;
        border-radius: 16px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(139, 0, 0, 0.3);
    }

    .background-media {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
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
    }

    .character-image {
        height: 100%;
        max-height: 300px;
        object-fit: contain;
    }

    .rive-container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
    }

    .media-placeholder {
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
        text-align: center;
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

    .option-button:active {
        transform: translateY(0);
    }

    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
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
    }

    .error-text {
        margin: 0;
        font-size: 12px;
    }

    .debug-info {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.6);
        padding: 8px 12px;
        border-radius: 8px;
        z-index: 4;
    }

    .dialogue-id {
        font-size: 11px;
        opacity: 0.6;
        margin: 0;
        color: #cccccc;
        font-family: monospace;
    }

    .dialogue-meta {
        font-size: 10px;
        opacity: 0.5;
        margin: 2px 0 0 0;
        color: #999999;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>