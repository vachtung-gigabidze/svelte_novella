<script lang="ts">
    import { supabase } from './supabase';
    import { onMount } from 'svelte';

    export let storyId: string;

    let title = '';
    let jsonContent = {};
    let riveAssets = [];

    // Загружаем историю и Rive-ассеты
    onMount(async () => {
        const { data: story } = await supabase
            .from('stories')
            .select('*')
            .eq('id', storyId)
            .single();

        title = story.title;

        // Загружаем JSON из Storage
        const { data: jsonData } = await supabase.storage
            .from('story-json')
            .download(story.json_url);

        jsonContent = await jsonData?.json();

        // Загружаем Rive-ассеты пользователя
        const { data: { user } } = await supabase.auth.getUser();
        const { data: assets } = await supabase
            .from('rive_assets')
            .select('*')
            .eq('author_id', user.id);

        riveAssets = assets || [];
    });

    async function saveStory() {
        const { error } = await supabase.storage
            .from('story-json')
            .update(`${storyId}.json`, JSON.stringify(jsonContent));

        if (error) alert('Ошибка сохранения: ' + error.message);
        else alert('Сохранено!');
    }
</script>

<div class="editor">
    <h1>{title}</h1>

    <!-- Превью Rive -->
    <div class="rive-preview">
        {#each riveAssets as asset}
            <rive-player src={supabase.storage.from('rive-assets').getPublicUrl(asset.storage_path)} />
        {/each}
    </div>

    <!-- Кнопка сохранения -->
    <button on:click={saveStory}>Сохранить</button>
</div>