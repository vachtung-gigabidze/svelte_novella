<script lang="ts">
    import {createState, MyState} from './state.svelte';

    let {name}: { name: string } = $props();

    const myState = createState();
    const myState2 = new MyState();
</script>
<div>

    <h1>

        {name ? name : "User"} Form
    </h1>
    <button onclick={()=>myState.up()}>{myState.value}</button>
    <button onclick={()=>myState2.up()}>{myState2.value}</button>
</div>
<style>
    div {
        background: red;
    }
</style>