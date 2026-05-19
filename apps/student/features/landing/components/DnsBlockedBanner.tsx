'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DnsBlockedBanner() {
    const [isVisible, setIsVisible] = useState(true)
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        const dismissed = localStorage.getItem('dns-banner-dismissed')
        if (dismissed === 'true') {
            setIsVisible(false)
        }
    }, [])

    const handleDismiss = () => {
        setIsVisible(false)
        localStorage.setItem('dns-banner-dismissed', 'true')
    }

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4 mb-6"
            >
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-orange-300">
                                Connection Issue Detected
                            </h3>
                            <button
                                onClick={handleDismiss}
                                className="text-gray-500 hover:text-white transition-colors"
                                aria-label="Dismiss"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-300 mb-3">
                            Some Indian ISPs are blocking access to our authentication service. 
                            If you're experiencing login issues, try changing your DNS settings.
                        </p>

                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="w-4 h-4" />
                                    Hide instructions
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4" />
                                    Show DNS setup guide
                                </>
                            )}
                        </button>

                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-4 space-y-4 overflow-hidden"
                                >
                                    <div className="bg-black/30 rounded-lg p-4 space-y-3">
                                        <h4 className="text-sm font-semibold text-white">Quick Fix: Change DNS to Cloudflare or Google</h4>
                                        
                                        <div className="space-y-2 text-xs text-gray-300">
                                            <p className="font-medium text-orange-300">Recommended DNS Servers:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2">
                                                <li>Cloudflare: <code className="bg-gray-800 px-2 py-0.5 rounded">1.1.1.1</code> and <code className="bg-gray-800 px-2 py-0.5 rounded">1.0.0.1</code></li>
                                                <li>Google: <code className="bg-gray-800 px-2 py-0.5 rounded">8.8.8.8</code> and <code className="bg-gray-800 px-2 py-0.5 rounded">8.8.4.4</code></li>
                                            </ul>
                                        </div>

                                        <div className="border-t border-gray-700 pt-3 space-y-3">
                                            <details className="group">
                                                <summary className="cursor-pointer text-sm font-medium text-white hover:text-orange-300 transition-colors">
                                                    📱 Android Instructions
                                                </summary>
                                                <ol className="mt-2 ml-4 space-y-1 text-xs text-gray-300 list-decimal">
                                                    <li>Open Settings → Network & Internet → Wi-Fi</li>
                                                    <li>Long press your connected network → Modify</li>
                                                    <li>Advanced options → IP settings → Static</li>
                                                    <li>DNS 1: <code className="bg-gray-800 px-1 rounded">1.1.1.1</code></li>
                                                    <li>DNS 2: <code className="bg-gray-800 px-1 rounded">1.0.0.1</code></li>
                                                    <li>Save and reconnect</li>
                                                </ol>
                                            </details>

                                            <details className="group">
                                                <summary className="cursor-pointer text-sm font-medium text-white hover:text-orange-300 transition-colors">
                                                    🍎 iOS Instructions
                                                </summary>
                                                <ol className="mt-2 ml-4 space-y-1 text-xs text-gray-300 list-decimal">
                                                    <li>Open Settings → Wi-Fi</li>
                                                    <li>Tap (i) next to your connected network</li>
                                                    <li>Scroll to Configure DNS → Manual</li>
                                                    <li>Remove existing servers</li>
                                                    <li>Add: <code className="bg-gray-800 px-1 rounded">1.1.1.1</code> and <code className="bg-gray-800 px-1 rounded">1.0.0.1</code></li>
                                                    <li>Save</li>
                                                </ol>
                                            </details>

                                            <details className="group">
                                                <summary className="cursor-pointer text-sm font-medium text-white hover:text-orange-300 transition-colors">
                                                    💻 Windows Instructions
                                                </summary>
                                                <ol className="mt-2 ml-4 space-y-1 text-xs text-gray-300 list-decimal">
                                                    <li>Open Settings → Network & Internet</li>
                                                    <li>Click your connection → Properties</li>
                                                    <li>Scroll to DNS server assignment → Edit</li>
                                                    <li>Select Manual → IPv4 On</li>
                                                    <li>Preferred: <code className="bg-gray-800 px-1 rounded">1.1.1.1</code></li>
                                                    <li>Alternate: <code className="bg-gray-800 px-1 rounded">1.0.0.1</code></li>
                                                    <li>Save</li>
                                                </ol>
                                            </details>
                                        </div>

                                        <p className="text-xs text-gray-400 italic mt-3">
                                            Note: After changing DNS, you may need to restart your browser or device.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
