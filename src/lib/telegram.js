export function initializeTelegram() {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        tg.expand()
        tg.enableClosingConfirmation()
        tg.ready()
        return tg
    }
    return null
}

export function getTelegramUser(tg) {
    return tg?.initDataUnsafe?.user || null
}