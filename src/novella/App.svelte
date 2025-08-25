<script>
    import { authStore } from './auth.js'
    import Header from './Header.svelte'
    import LoginForm from './LoginForm.svelte'
    import JsonViewer from './JsonViewer.svelte'
    import LoadingSpinner from './LoadingSpinner.svelte'

    let authState = {}

    // Подписываемся на изменения состояния аутентификации
    authStore.subscribe(state => {
        authState = state
    })
</script>

<main>
    {#if authState.isLoading}
        <LoadingSpinner />
    {:else if !authState.user}
        <LoginForm />
    {:else}
        <Header
                bucketName={authState.bucketName}
                username={authState.user.user_metadata.username || 'User'}
        />
        <JsonViewer />
    {/if}
</main>

<style>
    main {
        min-height: 100vh;
        background-color: #f8f9fa;
    }
</style>