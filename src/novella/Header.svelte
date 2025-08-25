<script>
    export let bucketName
    export let username = 'Гость'

    let showTooltip = false
</script>

<header>
    <div class="header-content">
        <h1>Bucket: {bucketName || 'Не выбран'}</h1>

        <div class="user-section" on:mouseenter={() => showTooltip = true} on:mouseleave={() => showTooltip = false}>
            <div class="user-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>

            {#if showTooltip}
                <div class="tooltip">
                    {username}
                </div>
            {/if}
        </div>
    </div>
</header>

<style>
    header {
        background-color: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        padding: 1rem 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
    }

    h1 {
        margin: 0;
        font-size: 1.5rem;
        color: #495057;
    }

    .user-section {
        position: relative;
        cursor: pointer;
    }

    .user-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e9ecef;
        border-radius: 50%;
        color: #6c757d;
    }

    .tooltip {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #495057;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.875rem;
        white-space: nowrap;
        margin-top: 0.5rem;
        z-index: 10;
    }

    .tooltip::before {
        content: '';
        position: absolute;
        bottom: 100%;
        right: 10px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent #495057 transparent;
    }
</style>