'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, ArrowRight, Loader2, Sparkles, CheckCircle2, X } from 'lucide-react'
import { login, signup, signInWithGoogle } from './actions'
import Link from 'next/link'

function LoginContent() {
    const [isLogin, setIsLogin] = useState(true)
    const searchParams = useSearchParams()
    const nextPath = searchParams.get('next') || '/'
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true)
        setMessage(null)
        try {
            await signInWithGoogle(nextPath)
        } catch (error: any) {
            // Next.js redirect() throws internally — let it propagate
            if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error
            setMessage({ text: 'Failed to initiate Google login', type: 'error' })
            setIsGoogleLoading(false)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        setMessage(null)

        const action = isLogin ? login : signup
        const result = await action(formData)

        setIsLoading(false)
        if (result?.error) {
            setMessage({ text: result.error, type: 'error' })
        } else if (!isLogin) {
            setMessage({ text: 'Check your email to confirm your account!', type: 'success' })
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-purple-900/20 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
                <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[100px] opacity-40 mix-blend-screen" />
            </div>

            <div className="w-full max-w-md mx-auto relative z-10 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                >
                    {/* Glass Card */}
                    <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">

                        {/* Cancel Button */}
                        <Link href="/" className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full">
                            <X className="w-4 h-4" />
                        </Link>

                        {/* Top Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 blur-[2px]" />

                        {/* Header Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-purple-500 to-blue-600 p-[1px] shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                <div className="w-full h-full bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-white drop-shadow-md" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {isLogin ? 'Log in to save your progress & access all features' : 'Start your journey with us today'}
                            </p>
                        </div>

                        {/* Toggle Switch */}
                        <div className="flex p-1 bg-black/40 rounded-xl mb-8 relative border border-white/5">
                            <motion.div
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gray-800/80 rounded-[10px] shadow-sm border border-white/5"
                                animate={{ left: isLogin ? '4px' : 'calc(50%)' }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2.5 text-sm font-medium relative z-10 transition-colors duration-200 ${isLogin ? 'text-white' : 'text-gray-500 hover:text-gray-400'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2.5 text-sm font-medium relative z-10 transition-colors duration-200 ${!isLogin ? 'text-white' : 'text-gray-500 hover:text-gray-400'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form action={handleSubmit} className="space-y-5">
                            <input type="hidden" name="next" value={nextPath} />
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all"
                                        placeholder="hello@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        minLength={6}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <AnimatePresence mode='wait'>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={`p-3 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'error'
                                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}
                                    >
                                        {message.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isLoading || isGoogleLoading}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#13141f] px-2 text-gray-500 sm:bg-transparent">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading || isLoading}
                            className="w-full py-3.5 bg-white text-gray-900 border-none hover:bg-gray-100 font-semibold rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 mb-2"
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span>Continue with Google</span>
                                </>
                            )}
                        </button>

                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B]" />}>
            <LoginContent />
        </Suspense>
    )
}
