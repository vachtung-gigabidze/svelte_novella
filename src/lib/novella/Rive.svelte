<script>
  import { onMount } from "svelte";
  import * as rive from "@rive-app/canvas";
  import {defaultAssetsUrl} from './store.svelte'
  let { fileName } = $props();
  // let isJumpingInput = $state();
  let canvas = $state();
  console.log(fileName);
  onMount(() => {
    if (!canvas) return;

    // Create the Rive instance
    const riveInstance = new rive.Rive({
      src: `${defaultAssetsUrl}${fileName}`,
      canvas,
      autoplay: true,
      stateMachines: "SM1",
    });
    // Cleanup the Rive instance when the component unmounts
    return () => {
      riveInstance.cleanup();
    };
  });
</script>

<div class="main-container">
  <canvas bind:this={canvas} width="400" height="500"></canvas>
  <!-- <div class="headline">
    <p class="title">Привет!</p>
    <p class="headline-text">Ведутся работы</p>
  </div> -->
</div>
