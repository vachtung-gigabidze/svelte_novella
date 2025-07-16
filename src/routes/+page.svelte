<script lang="ts">
    import Auth from '../lib/Auth.svelte';
    import StoryList from '../lib/StoryList.svelte';
    import { supabase } from '$lib/supabase';

    let isLoggedIn = false;

    supabase.auth.onAuthStateChange((event) => {
        isLoggedIn = event === 'SIGNED_IN';
    });
</script>

{#if !isLoggedIn}
    <Auth />
{:else}
    <StoryList />
{/if}