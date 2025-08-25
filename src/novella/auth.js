import { writable } from 'svelte/store'
import { supabase } from './supabase'

// Создание store для управления состоянием аутентификации
export const authStore = writable({
    user: null,
    bucketName: null,
    isLoading: true,
    error: null
})

// Функция для анонимной аутентификации
export async function signInAnonymously(username) {
    try {
        authStore.update(store => ({ ...store, isLoading: true, error: null }))

        // Поиск пользователя в таблице user_buckets
        const { data: userData, error: userError } = await supabase
            .from('user_buckets')
            .select('bucket_name')
            .eq('username', username)
            .single()

        if (userError) throw new Error('Пользователь не найден')

        // Анонимная аутентификация
        const { data: authData, error: authError } = await supabase.auth.signInAnonymously({
            options: {
                data: { username }
            }
        })

        if (authError) throw authError

        // Обновление store
        authStore.set({
            user: authData.user,
            bucketName: userData.bucket_name,
            isLoading: false,
            error: null
        })

        return authData.user
    } catch (error) {
        authStore.update(store => ({
            ...store,
            isLoading: false,
            error: error.message
        }))
        throw error
    }
}

// Функция для выхода
export async function signOut() {
    const { error } = await supabase.auth.signOut()
    authStore.set({
        user: null,
        bucketName: null,
        isLoading: false,
        error: null
    })
    if (error) throw error
}

// Инициализация - проверка существующей сессии
supabase.auth.getSession().then(({ data: { session } }) => {
    authStore.update(store => ({
        ...store,
        user: session?.user ?? null,
        isLoading: false
    }))
})

// Слушатель изменений состояния аутентификации
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        authStore.update(store => ({
            ...store,
            user: session.user,
            isLoading: false
        }))
    } else if (event === 'SIGNED_OUT') {
        authStore.set({
            user: null,
            bucketName: null,
            isLoading: false,
            error: null
        })
    }
})