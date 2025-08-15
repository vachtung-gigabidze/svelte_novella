<script lang="ts">

    import Header from "./Header.svelte";
    import Auth from "./lib/Auth.svelte";
    import UserName from "./lib/UserName.svelte";

    let name = "User Name"
   

</script>
<Header name={name}/>
<!-- <Auth/> -->
<UserName/>


<style>
   .error {
        color: red;
    }
</style>
