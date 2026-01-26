import { createClient } from '../utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'

export async function AuthButton() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const signOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        return redirect('/')
    }

    return user ? (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700/50">
                <User size={14} className="text-purple-400" />
                <span className="hidden sm:inline text-xs">{user.email?.split('@')[0]}</span>
            </div>
            <form action={signOut}>
                <button
                    className="p-2 text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 border border-transparent rounded-lg transition-all"
                    title="Sign Out"
                >
                    <LogOut size={18} />
                </button>
            </form>
        </div>
    ) : (
        <Link
            href="/login"
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full text-sm font-bold shadow-lg shadow-purple-500/20 transition-all transform hover:-translate-y-0.5"
        >
            Sign In
        </Link>
    )
}
