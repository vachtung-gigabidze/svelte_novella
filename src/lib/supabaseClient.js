import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const bucketName = 'dracula';
// Инициализация клиента Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    global: {
        headers: {
            'Content-Type': 'application/json',
        }
    }
})

export async function createSignedUrl(fileName){
        const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 3600); 

    if (data) {
     return data.signedUrl;
    }
}

// Аутентификация через Edge Function
 //{ data, error: invokeError } 
 export async function getTmaAuthInvoke(initData){
 await  supabase.functions.invoke(
              "tma-auth",
              { body: { initData } }
      )
    };

// Функция для проверки подключения
export async function checkSupabaseConnection() {
    try {
        const { data, error } = await supabase.from('_dummy').select('count').limit(1)
        if (error && error.code !== '42P01') { // Игнорируем ошибку отсутствия таблицы
            throw error
        }
        return true
    } catch (error) {
        console.error('Supabase connection error:', error)
        return false
    }
}

// Sign up a new user
export async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    return data
    if (error) console.error('Error signing up:', error.message);
    else console.log('User signed up:', data.user);
}

// Sign in a user
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) console.error('Error signing in:', error.message);
    else console.log('User signed in:', data.session);
}

// Get the current session
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) console.error('Error getting session:', error.message);
    else if (session) console.log('Current user:', session.user);
    else console.log('No active session.');
}
