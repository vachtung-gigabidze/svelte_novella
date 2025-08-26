<script lang="ts">

    import App from "./novella/App.svelte";
    import {onMount} from 'svelte';

    let userId: string | null = null;


    const urlParams = new URLSearchParams(window.location.search);
    userId = urlParams.get('id');


</script>
<p>User ID: {userId}</p>
<App></App>
<style>

</style>