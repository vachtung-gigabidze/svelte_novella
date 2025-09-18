<script lang="ts">
    import { isAppleClient } from "./lib/client_utils";
    import Main from "./lib/novella/Main.svelte";
    import TelegramApp from "./lib/novella_telegram/TelegramApp.svelte";
    import { ifUseTelegram } from "./lib/telegram";

   
  if (ifUseTelegram()) {
    console.log("Запущено в Telegram Mini App");
  } else {
    console.log("Обычный браузер");
  }

</script>
{#if ifUseTelegram()}
  <TelegramApp></TelegramApp>
{:else if isAppleClient()}
  <Main/>
{:else}
  <Main/>
  <p>Ты кто такой с*ка? Чтоб это сделать</p>
  <p>Мне бы очень не хотелось переходить на личности, вы уж извините, но хватает ли вашего уровня компетенции для работы в данном заведении?</p>
{/if}
