<script lang="ts">
  function sendData() {
    window.Telegram.WebApp.sendData("test message");
  }
</script>

<button onclick={sendData}>PRESS To Send</button>
