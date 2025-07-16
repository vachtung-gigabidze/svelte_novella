<script lang="ts">
  import { supabase } from './supabase';
  import { onMount } from 'svelte';

  let stories: Array<{ id: string; title: string }> = [];
  let isLoading = true;

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('stories')
      .select('id, title')
      .eq('author_id', user.id);

    if (error) console.error(error);
    else stories = data || [];

    isLoading = false;
  });
</script>

<div class="story-list">
  {#if isLoading}
    <p>Загрузка...</p>
  {:else}
    {#each stories as story}
      <a href={`/editor/${story.id}`} class="story-item">
        {story.title}
      </a>
    {:else}
      <p>У вас пока нет историй</p>
    {/each}
  {/if}
</div>

<style>
  .story-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .story-item {
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
    text-decoration: none;
    color: #333;
  }
</style>