<script lang="ts">

    import Header from "./Header.svelte";

    let form_state = $state({name: '', birthday: '', step: 0, error: ''})
</script>
<Header name={form_state.name}/>
<main>
    <div>
        <p>Step: {form_state.step+1}</p>
        {#if form_state.step === 0}
            <div>
                <label for="name">Your name</label>
                <input id="name" bind:value={form_state.name}/>
            </div>
            <button onclick="{()=>{
                if (form_state.name !== ''){form_state.step+=1; form_state.error = '';} else {form_state.error = 'Your name is empty. Please write your name.';}
            }}">
                Next
            </button>
        {:else if form_state.step === 1}
            <div>
                <label for="bdate">Your birthday</label>
                <input type="date" id="bdate" bind:value={form_state.birthday}/>
            </div>
            <button onclick="{()=>{
                if (form_state.birthday !== ''){form_state.step+=1; form_state.error = '';} else {form_state.error = 'Your birthday is empty. Please write your birthday.';}
            }}">
                Next
            </button>
        {/if}

    </div>
    <p class="error">
        {form_state.error}
    </p>

</main>
<style>
    .error {
        color: red;
    }
</style>
