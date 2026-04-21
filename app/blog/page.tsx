import React from 'react';
import Navbar from '../components/Navbar';
import BlogGrid from './BlogGrid';
import { getPublishedPosts } from '../lib/blogDb';

export const revalidate = 60;

export default async function BlogPage() {
    const posts = await getPublishedPosts();

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-purple-500/30">
            <Navbar authButton={<div />} />

            <main className="pt-28 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
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
