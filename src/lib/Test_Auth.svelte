<script>
    import { supabase, checkSupabaseConnection, signIn } from './supabaseClient'


    let result = $derived(  signIn("dmitry.zyadik@gmail.com", "123456"));
</script>
<p>{JSON.stringify(result)}</p>