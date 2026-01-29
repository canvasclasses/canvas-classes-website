import React from 'react';
import Navbar from '../components/Navbar';
// We can use framer-motion in server component BUT the motion.div needs to be in a client component OR just plain div.
// For the Hero section animation, we can make a small client component OR just simplified it.
// Let's make a Header component or just import motion from 'framer-motion' (which usually requires 'use client' for the animation parts).
// To keep it simple and fix the build, let's keep the hero static or move it to BlogGrid too? 
// actually BlogGrid is the content below. 
// Let's move the motion.div to a strictly client component called BlogHeader or put it in BlogGrid.
// For now, let's just make the whole page structure cleaner:
// Server Component -> Fetch Data -> Pass to Client Component (which includes Header + Grid).
// 
// Actually, let's just put the Hero inside BlogGrid for now to keep the animation.

import BlogGrid from './BlogGrid';
import { getAllPosts } from '../lib/blog';

export default function BlogPage() {
    // This runs on the server!
    const posts = getAllPosts();

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-purple-500/30">
            <Navbar authButton={<div />} />

            <main className="pt-28 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    {/* 
                       Note: We removed the motion.div directly here because this is a Server Component.
                       If we want animation, we should put this header inside a Client Component.
                       For now, let's render static or move the header into BlogGrid?
                       
                       Let's pass the header title as props or just duplicate the header inside BlogGrid if we really want animation?
                       Actually, let's just rely on the CSS transitions or simple static header for the Server Component 
                       OR... let's just make a `BlogHeader` component.
                       
                       Let's try to keep it simple: Just static header here is fine, or simple CSS animation.
                     */}
                    <div>
                        <span className="text-purple-400 font-bold uppercase tracking-wider text-sm mb-4 block animate-fade-in-up">
                            Canvas Classes Blog
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight animate-fade-in-up delay-100">
                            Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Study Tips</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
                            Master chemistry concepts, get exam strategies, and updated news for JEE, NEET, and CBSE Board exams.
                        </p>
                    </div>
                </div>

                <BlogGrid initialPosts={posts} />
            </main>
        </div>
    );
}
