import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;



export const supabase = createClient(supabaseUrl, supabaseKey);

export async function createStory(title: string, authorId: string) {
    const { data, error } = await supabase
        .from('stories')
        .insert({
            title,
            author_id: authorId,
            json_url: `story-json/${authorId}/${Date.now()}.json`  // Пример пути
        })
        .select();

    if (error) throw new Error(error.message);
    return data;
}

export async function getUserStories(userId: string) {
    const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('author_id', userId);

    if (error) throw new Error(error.message);
    return data;
}

export async function saveStoryJson(jsonUrl: string, content: object) {
    const { error } = await supabase.storage
        .from('story-json')
        .upload(jsonUrl, JSON.stringify(content));

    if (error) throw new Error(error.message);
}

export async function uploadRiveFile(file: File, userId: string) {
    const path = `rive-assets/${userId}/${file.name}`;

    const { data, error } = await supabase.storage
        .from('rive-assets')
        .upload(path, file);

    if (error) throw new Error(error.message);
    return data?.path;  // Возвращает путь к файлу
}

export async function getUserRiveAssets(userId: string) {
    const { data, error } = await supabase
        .from('rive_assets')
        .select('*')
        .eq('author_id', userId);

    if (error) throw new Error(error.message);
    return data;
}
