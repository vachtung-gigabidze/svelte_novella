<script>
  import { onMount } from "svelte";
  import * as rive from "@rive-app/canvas";
  import {bucketName, supabaseUrlFile} from '../store/store.svelte'
  let { fileName } = $props();
  // let isJumpingInput = $state();
  let canvas = $state();
  // console.log(fileName);
  onMount( () => {
     if (!canvas) return;
   
   // console.log( `${supabaseUrl}/storage/v1/object/public/${bucketName}/${fileName}`);
    // Create the Rive instance
    const riveInstance = new rive.Rive({
      src:  `${supabaseUrlFile}/storage/v1/object/public/${bucketName}/${fileName}`,//`${defaultAssetsUrl}${fileName}`,
      canvas,
      autoplay: true,
      stateMachines: "SM1",
    });
    // Cleanup the Rive instance when the component unmounts
    return () => {
      riveInstance.cleanup();
    };
  });

  	async function loadingUrl() {
		//console.log("A lot of background work...")
	//	 const fileUrl = await createSignedUrl(fileName);
     if (!canvas) return;
    
   
    // Create the Rive instance
    const riveInstance = new rive.Rive({
      src:  `https://${supabaseUrlFile}.supabase.co/storage/v1/object/public/[bucket]/${fileName}`,//`${defaultAssetsUrl}${fileName}`,
      canvas,
      autoplay: true,
      stateMachines: "SM1",
    });
    // Cleanup the Rive instance when the component unmounts
    return () => {
      riveInstance.cleanup();
    };
		//return fileUrl
	}
</script>
<!-- {#await loadingUrl() then data} -->
<div class="main-container">
  <canvas bind:this={canvas} width="400" height="500"></canvas>
  <!-- <div class="headline">
    <p class="title">Привет!</p>
    <p class="headline-text">Ведутся работы</p>
  </div> -->
</div>
<!-- {/await} -->