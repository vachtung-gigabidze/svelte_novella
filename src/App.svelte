<script lang="ts">

    import Header from "./Header.svelte";
    import Game from "./Game.svelte";

    // let form_state = $state({
    //         answers: {}, step: 0, error: ''
    //     }
    // )
    //
    // const QUESTIONS = [
    //     {
    //         question: "What you name?",
    //         id: 'name',
    //         type: 'text'
    //     },
    //     {
    //         question: "What you birthday?",
    //         id: 'birthday',
    //         type: 'date'
    //     },{
    //         question: "What you favorite color?",
    //         id: 'color',
    //         type: 'color'
    //     },
    // ];
    //
    // function next_step(id: string){
    //     if (form_state.answers[id]){
    //         form_state.step +=1;
    //         form_state.error = "";
    //     } else {
    //         form_state.error = `Please input ${id}`
    //     }
    // }

    // $inspect(form_state.step)
    // $effect(()=> {
    //     console.log('on mount');
    //     return ()=> {
    //
    //     console.log('on unmount');
    //     }
    // });
    // $effect(()=> {
    //     console.log('update', form_state.step);
    // });

</script>
<!--<Header name={form_state.answers.name}/>-->
<Game />
<!--<main>-->
<!--    <div>-->
<!--        {#if form_state.step >= QUESTIONS.length}-->
<!--            <p>Спасибо</p>-->
<!--            {:else}-->
<!--        <p>Step: {form_state.step + 1}</p>-->
<!--        {#each QUESTIONS as question , i (question.id)}-->
<!--            {#if (i === form_state.step)}-->
<!--                {@render form_step(question)}-->
<!--            {/if}-->
<!--        {/each}-->
<!--        {/if}-->
<!--    </div>-->
<!--    <p class="error">-->
<!--        {form_state.error}-->
<!--    </p>-->
<!--    &lt;!&ndash;{JSON.stringify(form_state)}&ndash;&gt;-->
<!--</main>-->

<!--{#snippet form_step({question, id, type}: {question:string, id:string, type:string}) }-->
<!--    <article>-->

<!--        <div>-->
<!--            <label for={id}>{question}</label>-->
<!--            <input {type} {id} bind:value={form_state.answers[id]}/>-->
<!--        </div>-->
<!--        <button onclick={()=>next_step(id)}>Next</button>-->
<!--    </article>-->
<!--{/snippet}-->
<!--<style>-->
<!--    .error {-->
<!--        color: red;-->
<!--    }-->
<!--</style>-->
