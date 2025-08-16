<script lang="ts">
  import { init,miniApp, backButton } from '@telegram-apps/sdk-svelte';
  import BackButton from './BackButton.svelte';



  // Initialize the package.
  init();
  
  backButton.mount();
  
</script>

<BackButton />