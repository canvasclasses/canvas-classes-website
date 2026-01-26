'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
    Search,
    FlaskConical,
    BookOpen,
    Atom,
    Home,
    Calculator,
    FileQuestion,
    GraduationCap,
    Youtube,
    FileText
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SearchItem } from '../lib/searchIndices'

interface CommandPaletteProps {
    itemsPromise?: Promise<SearchItem[]>;
}

export function CommandPalette({ itemsPromise }: CommandPaletteProps) {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState<SearchItem[]>([]);
    const router = useRouter()

    // Unwrap promise if provided
    // Unwrap promise if provided
    useEffect(() => {
        if (itemsPromise && typeof itemsPromise.then === 'function') {
            itemsPromise.then(
                (data) => {
                    setItems(data);
                },
                (err) => {
                    console.error('Failed to load search items:', err);
                }
            );
        }
    }, [itemsPromise]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)

        // Listen for custom event from Navbar (dispatched on window)
        const openHandler = () => {
            console.log("Command Palette opened via event");
            setOpen(true);
        };
        window.addEventListener('openCommandPalette', openHandler);

        return () => {
            document.removeEventListener('keydown', down)
            window.removeEventListener('openCommandPalette', openHandler);
        }
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    // Helper to get icon based on category
    const getIcon = (category: string, title?: string) => {
        const lowerTitle = title?.toLowerCase() || '';
        if (category === 'Reactions') return <FlaskConical className="mr-3 h-5 w-5 text-green-400" />;
        if (category === 'Concepts') return <BookOpen className="mr-3 h-5 w-5 text-amber-400" />;
        if (category === 'Videos') return <Youtube className="mr-3 h-5 w-5 text-red-500" />;
        if (category === 'Lectures') return <GraduationCap className="mr-3 h-5 w-5 text-teal-400" />;
        if (category === 'Chapters') return <BookOpen className="mr-3 h-5 w-5 text-indigo-400" />; // Chapters generic

        if (lowerTitle.includes('note')) return <FileText className="mr-3 h-5 w-5 text-yellow-400" />;
        if (lowerTitle.includes('assertion')) return <FileQuestion className="mr-3 h-5 w-5 text-rose-400" />;

        return <FileText className="mr-3 h-5 w-5 text-gray-400" />;
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0B]/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Command className="w-full">
                                <div className="flex items-center border-b border-white/10 px-4" cmdk-input-wrapper="">
                                    <Search className="mr-2 h-5 w-5 shrink-0 text-gray-500" />
                                    <Command.Input
                                        placeholder="Search for tools, elements, or pages..."
                                        className="flex h-14 w-full rounded-md bg-transparent py-3 text-lg outline-none placeholder:text-gray-500 text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>

                                <Command.List className="max-h-[60vh] overflow-y-auto overflow-x-hidden py-2 px-2">
                                    <Command.Empty className="py-6 text-center text-sm text-gray-500">
                                        No results found.
                                    </Command.Empty>

                                    {/* Critical Tools (Always visible) */}
                                    <Command.Group heading="Tools & Simulators" className="text-xs font-medium text-gray-500 mb-2 px-2">
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push('/salt-analysis'))}
                                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-3 text-sm text-gray-200 hover:bg-white/5 hover:text-white aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                                        >
                                            <FlaskConical className="mr-3 h-5 w-5 text-purple-400" />
                                            <div className="flex flex-col">
                                                <span className="font-medium">Salt Analysis Simulator</span>
                                                <span className="text-xs text-gray-500">Interactive Cation & Anion Tests</span>
                                            </div>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push('/interactive-periodic-table'))}
                                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-3 text-sm text-gray-200 hover:bg-white/5 hover:text-white aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                                        >
                                            <Atom className="mr-3 h-5 w-5 text-cyan-400" />
                                            <div className="flex flex-col">
                                                <span className="font-medium">Periodic Table</span>
                                                <span className="text-xs text-gray-500">Elements, Trends, and Properties</span>
                                            </div>
                                        </Command.Item>
                                    </Command.Group>

                                    {/* Dynamic Content */}
                                    {items.length > 0 && (
                                        <>
                                            <Command.Separator className="my-2 h-px bg-white/10" />
                                            <Command.Group heading="Chemistry Content" className="text-xs font-medium text-gray-500 mb-2 px-2">
                                                {items.map((item) => (
                                                    <Command.Item
                                                        key={item.id}
                                                        value={`${item.title} ${item.keywords?.join(' ')}`}
                                                        onSelect={() => runCommand(() => router.push(item.url))}
                                                        className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-3 text-sm text-gray-200 hover:bg-white/5 hover:text-white aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                                                    >
                                                        {getIcon(item.category, item.title)}
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{item.title}</span>
                                                            <span className="text-xs text-gray-500">{item.subtitle}</span>
                                                        </div>
                                                    </Command.Item>
                                                ))}
                                            </Command.Group>
                                        </>
                                    )}

                                    <Command.Separator className="my-2 h-px bg-white/10" />

                                    <Command.Group heading="General" className="text-xs font-medium text-gray-500 mb-2 px-2">
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push('/'))}
                                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-3 text-sm text-gray-200 hover:bg-white/5 hover:text-white aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                                        >
                                            <Home className="mr-3 h-5 w-5 text-gray-400" />
                                            <span>Home</span>
                                        </Command.Item>
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push('/login'))}
                                            className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-3 text-sm text-gray-200 hover:bg-white/5 hover:text-white aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                                        >
                                            <GraduationCap className="mr-3 h-5 w-5 text-gray-400" />
                                            <span>Login / Sign Up</span>
                                        </Command.Item>
                                    </Command.Group>
                                </Command.List>
                            </Command>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
