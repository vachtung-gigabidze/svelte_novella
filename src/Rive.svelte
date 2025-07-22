<script>
    import { onMount } from "svelte";
    import * as rive from "@rive-app/canvas";

    let isJumpingInput = $state();
    let canvas = $state();

    onMount(() => {
        if (!canvas) return;

        // Create the Rive instance
        const riveInstance = new rive.Rive({
            src: "https://public.rive.app/community/runtime-files/186-341-flame-and-spark.riv",
            canvas,
            autoplay: true,
            // stateMachines: "blob",
            // onLoad: () => {
            //     riveInstance.resizeDrawingSurfaceToCanvas();
            //     const inputs = riveInstance.stateMachineInputs("blob");
            //     // Reference the inputs we defined in Rive
            //     isJumpingInput = inputs.find((i) => i.name === "isJumping");
            // },
        });

        // Cleanup the Rive instance when the component unmounts
        return () => {
            riveInstance.cleanup();
        };
    });
</script>

<div class="main-container">
    <canvas bind:this={canvas} width="300" height="300"></canvas>
    <div class="headline">
        <p class="title">Привет!</p>
        <p class="headline-text">Ведутся работы</p>
    </div>
<!--    <button-->
<!--            class="cta"-->
<!--            onmouseenter={() => {-->
<!--			if (isJumpingInput) isJumpingInput.value = true;-->
<!--		}}-->
<!--            onmouseleave={() => {-->
<!--			if (isJumpingInput) isJumpingInput.value = false;-->
<!--		}}-->
<!--    >-->
<!--        <p>Hover me</p>-->
<!--    </button>-->
</div>