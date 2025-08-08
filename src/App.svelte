<script lang="ts">

    import Header from "./Header.svelte";
    import Auth from "./lib/Auth.svelte";

    let name = "User Name"
   

</script>
<Header name={name}/>
<Auth/>


<style>
   .error {
        color: red;
    }
</style>
