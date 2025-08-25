<script>
    export let size = 'medium' // small, medium, large
    export let message = 'Загрузка...'

    $: spinnerClass = `spinner spinner-${size}`
</script>

<div class="loading-container">
    <div class={spinnerClass}>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
        <div class="spinner-circle"></div>
    </div>

    {#if message}
        <p class="loading-message">{message}</p>
    {/if}
</div>

<style>
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .spinner {
        position: relative;
        display: inline-block;
    }

    .spinner-small {
        width: 24px;
        height: 24px;
    }

    .spinner-medium {
        width: 40px;
        height: 40px;
    }

    .spinner-large {
        width: 60px;
        height: 60px;
    }

    .spinner-circle {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
    }

    .spinner-circle:before {
        content: '';
        display: block;
        width: 15%;
        height: 15%;
        background-color: #007bff;
        border-radius: 100%;
        animation: spinner-fade 1.2s linear infinite;
    }

    .spinner-circle:nth-child(1) {
        transform: rotate(30deg);
    }

    .spinner-circle:nth-child(1):before {
        animation-delay: -1.1s;
    }

    .spinner-circle:nth-child(2) {
        transform: rotate(60deg);
    }

    .spinner-circle:nth-child(2):before {
        animation-delay: -1s;
    }

    .spinner-circle:nth-child(3) {
        transform: rotate(90deg);
    }

    .spinner-circle:nth-child(3):before {
        animation-delay: -0.9s;
    }

    .spinner-circle:nth-child(4) {
        transform: rotate(120deg);
    }

    .spinner-circle:nth-child(4):before {
        animation-delay: -0.8s;
    }

    .spinner-circle:nth-child(5) {
        transform: rotate(150deg);
    }

    .spinner-circle:nth-child(5):before {
        animation-delay: -0.7s;
    }

    .spinner-circle:nth-child(6) {
        transform: rotate(180deg);
    }

    .spinner-circle:nth-child(6):before {
        animation-delay: -0.6s;
    }

    .spinner-circle:nth-child(7) {
        transform: rotate(210deg);
    }

    .spinner-circle:nth-child(7):before {
        animation-delay: -0.5s;
    }

    .spinner-circle:nth-child(8) {
        transform: rotate(240deg);
    }

    .spinner-circle:nth-child(8):before {
        animation-delay: -0.4s;
    }

    .spinner-circle:nth-child(9) {
        transform: rotate(270deg);
    }

    .spinner-circle:nth-child(9):before {
        animation-delay: -0.3s;
    }

    .spinner-circle:nth-child(10) {
        transform: rotate(300deg);
    }

    .spinner-circle:nth-child(10):before {
        animation-delay: -0.2s;
    }

    .spinner-circle:nth-child(11) {
        transform: rotate(330deg);
    }

    .spinner-circle:nth-child(11):before {
        animation-delay: -0.1s;
    }

    .spinner-circle:nth-child(12) {
        transform: rotate(360deg);
    }

    .spinner-circle:nth-child(12):before {
        animation-delay: 0s;
    }

    @keyframes spinner-fade {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    .loading-message {
        margin-top: 1rem;
        color: #6c757d;
        font-size: 0.9rem;
        text-align: center;
    }
</style>