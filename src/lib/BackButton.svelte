
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { backButton, useSignal, isBackButtonVisible } from '@telegram-apps/sdk-svelte';

  const isVisible = useSignal(backButton.isVisible);

  let info = $derived(`The button is, ${isBackButtonVisible() ? 'visible' : 'invisible'}`);

  onMount(() => {
    backButton.show();
  });

  onDestroy(() => {
    backButton.hide();
  });
</script>

<p>`The button is', {info}`</p>