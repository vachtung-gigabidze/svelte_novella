<script lang="ts">
    // import {onMount} from 'svelte';
   // import Rive from './Rive.svelte'
   // import Auth from "./lib/Auth.svelte";



import MyWidget from "./MyWidget.svelte";

let name = $state("Dmitrii");
let status: 'OPEN' | 'CLOSE' = $state('OPEN');
let full_name = $derived(name + ' Ziidik');

function onclick() {
    status = status === 'OPEN' ? 'CLOSE': 'OPEN';
}
</script>
<main>
    <div>
<!--       <Rive/>-->
<!--        <Auth/>-->
        <p>Привет {full_name}</p>
      <MyWidget {name}/>
      <input type="text" bind:value={name}/>
        <button {onclick}>Поменять</button>
    </div>
</main>
