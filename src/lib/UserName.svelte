<script lang="ts">
  import { retrieveLaunchParams } from "@telegram-apps/sdk-svelte";
  import BackButton from "./BackButton.svelte";
  import { onMount } from "svelte";
  import { derived } from "svelte/store";

  const { initDataRaw, initData } = retrieveLaunchParams();
  let information = $derived(initData);
  const bg = window.Telegram.WebApp.backgroundColor;
  // const tgInitData = window.Telegram.WebApp.initDataUnsafe.user;
  const first_name = window.Telegram.WebApp.initDataUnsafe.user?.first_name;

  onMount(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      //initData = window.Telegram.WebApp.initDataUnsafe;
      // Parse initData and use the information as needed
      console.log(initData);
    } else {
    }
  });

  // window.Telegram.WebApp.initDataUnsafe;
  // const initializeTelegramSDK = async () => {
  //   try {
  //     await init();

  //     if (miniApp.ready.isAvailable()) {
  //       await miniApp.ready();
  //       miniApp.setHeaderColor("#fcb69f");
  //       console.log("Mini App готово");
  //     }
  //   } catch (error) {
  //     console.error("Ошибка инициализации:", error);
  //   }
  // };

  // initializeTelegramSDK();

  // let score = 0;

  //   onMount(() => {
  //     // Set up main button when component mounts
  //     setupMainButton();

  //     // Cleanup when component unmounts
  //     return () => {
  //       if (mainButton) {
  //         mainButton.offClick('click');
  //         mainButton.hide();
  //       }
  //     };
  //   });

  //   function setupMainButton() {
  //     if (!mainButton) return;

  //     // Configure and show main button
  //     mainButton
  //       .setParams({
  //         color: '#aa1388',
  //         text_color: '#000000',
  //         text: 'Поделиться очками',
  //         is_active: true,
  //         is_visible: true
  //       })
  //       .show();

  //     // Add click handler
  //     mainButton.on('click', shareScore);
  //   }

  //   function shareScore() {
  //     try {
  //       const message = `Посмотрите! У меня ${score} очков в игре Memory!`;

  //       if (miniApp?.sendData) {
  //         miniApp.sendData(JSON.stringify({
  //           message: message,
  //           score: score
  //         }));
  //       } else {
  //         // Fallback for non-Telegram environments
  //         navigator.clipboard?.writeText(message);
  //         alert('Сообщение скопировано: ' + message);
  //       }
  //     } catch (error) {
  //       console.error('Error sharing score:', error);
  //     }
  //   }

  //   // Update localStorage when score changes
  //   $: {
  //     if (typeof localStorage !== 'undefined') {
  //       localStorage.setItem('memory-game-score', score);
  //     }
  //   }
</script>

<p>BackGround {bg}</p>
<p>Привет {first_name}</p>
<BackButton />
