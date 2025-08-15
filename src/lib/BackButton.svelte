/**
 * Component which controls the Back Button visibility.
 */
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { backButton, useSignal } from '@telegram-apps/sdk-svelte';

  const isVisible = useSignal(backButton.isVisible);

  $: console.log('The button is', isVisible.value ? 'visible' : 'invisible')

  onMount(() => {
    backButton.show();
  });

  onDestroy(() => {
    backButton.hide();
  });
</script>