'use client'

import { useState, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion'
import { Mail, Lock, ArrowRight, Loader2, Sparkles, CheckCircle2, X } from 'lucide-react'
import { createClient } from '../utils/supabase/client'
import { sanitizeRedirect } from '@/lib/redirectValidation'
import Link from 'next/link'
import DnsBlockedBanner from '../components/DnsBlockedBanner'
import { PRIVACY_VERSION, TERMS_VERSION } from '@/lib/legal/versions'

function LoginContent() {
    const [isLogin, setIsLogin] = useState(true)
    const searchParams = useSearchParams()
    const nextPath = searchParams.get('next') || '/'
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)
    const [showDnsBanner, setShowDnsBanner] = useState(false)
    const [failureCount, setFailureCount] = useState(0)
    const [consentChecked, setConsentChecked] = useState(false)

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true)
        setMessage(null)

        const consentParam = !isLogin ? '&consent=1' : ''
        window.location.href = `/api/auth/google-direct/start?next=${encodeURIComponent(nextPath)}${consentParam}`
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const next = formData.get('next') as string || '/'
        
        try {
            const supabase = createClient()
            
            if (!supabase) {
                setMessage({ text: 'Authentication service not configured', type: 'error' })
                setIsLoading(false)
                return
            }

            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (error) {
                    const errorMsg = error.message.includes('Invalid login credentials') 
                        ? 'Invalid email or password' 
                        : error.message
                    setMessage({ text: errorMsg, type: 'error' })
                    setIsLoading(false)
                    return
                }

                window.location.href = sanitizeRedirect(next)
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            privacy_version: PRIVACY_VERSION,
                            terms_version: TERMS_VERSION,
                            consent_accepted_at: new Date().toISOString(),
                        },
                    },
                })

                if (error) {
                    const errorMsg = error.message.includes('already registered')
                        ? 'This email is already registered. Please sign in instead.'
                        : error.message
                    setMessage({ text: errorMsg, type: 'error' })
                    setIsLoading(false)
                    return
                }

                setMessage({ text: 'Check your email to confirm your account!', type: 'success' })
                setIsLoading(false)
            }
            
            setFailureCount(0)
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.error('Auth error:', errorMessage)
            setIsLoading(false)
            const newCount = failureCount + 1
            setFailureCount(newCount)

            if (newCount >= 2) {
                setShowDnsBanner(true)
            }

            setMessage({
                text: 'Connection failed. Please check your internet connection.',
                type: 'error'
            })
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]" />
            </div>

            <div className="w-full max-w-sm mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full"
                >
                    {/* Clean floating container */}
                    <div className="relative">
                        {/* Header - enhanced with icon and animation */}
                        <div className="text-center mb-6">
                            <motion.h1
                                key={isLogin ? 'signin' : 'signup'}
                                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="text-2xl font-semibold text-white tracking-tight"
                            >
                                {isLogin ? 'Sign in' : 'Create account'}
                            </motion.h1>
                            <motion.p
                                key={isLogin ? 'signin-sub' : 'signup-sub'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="text-sm text-zinc-400 mt-1"
                            >
                                {isLogin ? 'Welcome back to Canvas' : 'Join the Canvas community'}
                            </motion.p>
                        </div>

                        {/* DNS Blocked Banner */}
                        {showDnsBanner && <DnsBlockedBanner />}

                        {/* Pill Toggle - with sliding animation */}
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/10 relative">
                                <motion.div
                                    className="absolute top-1 bottom-1 bg-white rounded-full"
                                    initial={false}
                                    animate={{ 
                                        left: isLogin ? '4px' : 'calc(50% + 2px)',
                                        width: isLogin ? 'calc(50% - 6px)' : 'calc(50% - 6px)'
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                />
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`relative z-10 px-5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 ${isLogin ? 'text-black' : 'text-zinc-400 hover:text-zinc-300'}`}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`relative z-10 px-5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 ${!isLogin ? 'text-black' : 'text-zinc-400 hover:text-zinc-300'}`}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="hidden" name="next" value={nextPath} />
                            
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isLogin ? 'login-form' : 'signup-form'}
                                    initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full bg-transparent border-b border-white/10 py-3 px-1 text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-colors text-sm"
                                        placeholder="Email address"
                                    />

                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        minLength={6}
                                        className="w-full bg-transparent border-b border-white/10 py-3 px-1 text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-colors text-sm"
                                        placeholder="Password"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {!isLogin && (
                                <label className="flex items-start gap-2 text-xs text-zinc-400 select-none cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={consentChecked}
                                        onChange={(e) => setConsentChecked(e.target.checked)}
                                        className="mt-0.5 accent-orange-500 cursor-pointer"
                                    />
                                    <span>
                                        I have read and agree to the{' '}
                                        <Link
                                            href="/privacy"
                                            target="_blank"
                                            rel="noopener"
                                            className="underline text-zinc-300 hover:text-white"
                                        >
                                            Privacy Policy
                                        </Link>{' '}
                                        and{' '}
                                        <Link
                                            href="/terms"
                                            target="_blank"
                                            rel="noopener"
                                            className="underline text-zinc-300 hover:text-white"
                                        >
                                            Terms &amp; Conditions
                                        </Link>
                                        .
                                    </span>
                                </label>
                            )}

                            {/* Messages */}
                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-3 rounded-lg text-sm ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}
                                    >
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isLoading || isGoogleLoading || (!isLogin && !consentChecked)}
                                className="w-full py-3 bg-white text-black font-medium text-sm rounded-xl hover:bg-slate-200 active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                ) : (
                                    <motion.span
                                        key={isLogin ? 'continue' : 'create'}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isLogin ? 'Continue' : 'Create account'}
                                    </motion.span>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wide">or</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Google - elevated visibility */}
                        <motion.button
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading || isLoading || (!isLogin && !consentChecked)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-3 px-4 bg-black border border-white/20 rounded-xl text-white font-medium text-sm hover:border-white/30 transition-all disabled:opacity-40 flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-black/20"
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </motion.button>

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
