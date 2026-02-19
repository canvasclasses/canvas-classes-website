'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/app/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    if (!supabase) {
        return { error: 'Authentication service not configured' }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const next = (formData.get('next') as string) || '/'

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect(next)
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    if (!supabase) {
        return { error: 'Authentication service not configured' }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signInWithGoogle(next: string = '/') {
    const supabase = await createClient()

    if (!supabase) {
        redirect('/login?error=Authentication service not configured')
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const callbackUrl = `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: callbackUrl,
        },
    })

    if (error) {
        console.error('Google Auth Error:', error)
        redirect('/login?error=Google login failed')
    }

    if (data.url) {
        redirect(data.url)
    }
}
