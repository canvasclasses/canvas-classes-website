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

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                return { error: 'Invalid email or password' }
            }
            return { error: error.message }
        }

        revalidatePath('/', 'layout')
        redirect(next)
    } catch (error: any) {
        console.error('Login error:', error)
        return { 
            error: 'Connection failed. Please check your internet connection and try again.' 
        }
    }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    if (!supabase) {
        return { error: 'Authentication service not configured' }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            if (error.message.includes('already registered')) {
                return { error: 'This email is already registered. Please sign in instead.' }
            }
            return { error: error.message }
        }

        revalidatePath('/', 'layout')
        redirect('/')
    } catch (error: any) {
        console.error('Signup error:', error)
        return { 
            error: 'Connection failed. Please check your internet connection and try again.' 
        }
    }
}

export async function signInWithGoogle(next: string = '/') {
    const supabase = await createClient()

    if (!supabase) {
        redirect('/login?error=Authentication service not configured')
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const callbackUrl = `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`

    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: callbackUrl,
            },
        })

        if (error) {
            console.error('Google Auth Error:', error)
            redirect('/login?error=Google login failed. Please try again.')
        }

        if (data.url) {
            redirect(data.url)
        }
    } catch (error: any) {
        console.error('Google OAuth error:', error)
        redirect('/login?error=Connection failed. Please check your internet connection.')
    }
}
