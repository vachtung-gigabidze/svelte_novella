<script lang="ts">

    let { name, fake_name = "null" } : {name : string; fake_name?:string | null;} = $props();
    let count = $state(10);



    function inc() {
        count++;
    }
</script>
<main>
    <div>
        <button onclick={inc}>
            {name.replaceAll('i','и')} is clicks: {count}
        </button>
    </div>
    {fake_name}
</main>

<style>
    button {
        background: red;
    }
</style>