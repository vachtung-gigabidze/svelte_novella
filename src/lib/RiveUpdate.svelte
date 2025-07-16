<script lang="ts">
  import { supabase } from './supabase';

  let file: File | null = null;
  let isUploading = false;
  let uploadError = '';

  async function handleUpload() {
    if (!file) return;
    isUploading = true;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await supabase.storage
        .from('rive-assets')
        .upload(`${user.id}/${file.name}`, file);

      // Добавляем запись в таблицу rive_assets
      await supabase.from('rive_assets').insert({
        author_id: user.id,
        name: file.name,
        storage_path: `${user.id}/${file.name}`
      });

      alert('Файл загружен!');
    } catch (err) {
      uploadError = err.message;
    } finally {
      isUploading = false;
    }
  }
</script>

<div class="uploader">
  <input
    type="file"
    accept=".riv"
    bind:files={file ? [file] : []}
    on:change={(e) => file = e.target.files?.[0] || null}
  />
  <button
    on:click={handleUpload}
    disabled={!file || isUploading}
  >
    {isUploading ? 'Загрузка...' : 'Загрузить'}
  </button>
  {#if uploadError}
    <p class="error">{uploadError}</p>
  {/if}
</div>

<style>
  .error {
    color: red;
  }
</style>