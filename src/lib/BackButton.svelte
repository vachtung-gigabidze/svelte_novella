
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { backButton, useSignal, isBackButtonVisible, initData } from '@telegram-apps/sdk-svelte';
 
  const isVisible = useSignal(backButton.isVisible);

  let info = $derived(`The button is, ${isBackButtonVisible() ? 'visible' : 'invisible'}`);
  initData.restore();
  let user = $derived(initData.user);

  onMount(() => {
    backButton.show();
  });

  onDestroy(() => {
    backButton.hide();
  });
</script>

<p>`{info}  {JSON.stringify(user)}`</p>