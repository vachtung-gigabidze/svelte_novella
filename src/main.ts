import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { init, miniApp } from '@telegram-apps/sdk-svelte';

const initializeTelegramSDK = async () => {
  try {
    await init();
    
    if (miniApp?.ready) {
      await miniApp.ready();
      console.log('Mini Main готово');
    }
  } catch (error) {
    console.error('Ошибка инициализации:', error);
  }
};

// Initialize Telegram SDK
initializeTelegramSDK();
const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
