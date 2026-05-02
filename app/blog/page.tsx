import React from 'react';
import { Metadata } from 'next';
import Navbar from '../components/Navbar';
import BlogGrid from './BlogGrid';
import { getPublishedPosts } from '../lib/blogDb';

export const revalidate = 60;

const BASE_URL = 'https://www.canvasclasses.in';

export const metadata: Metadata = {
    title: 'Canvas Classes Blog — JEE & NEET Chemistry Insights, Strategy & Study Tips',
    description: 'Chemistry concepts, exam strategy, syllabus updates, and study tips for JEE Main, JEE Advanced, NEET, and CBSE board exams. Written by Paaras Sir and the Canvas Classes team.',
    keywords: [
        'JEE Chemistry blog',
        'NEET Chemistry blog',
        'JEE preparation tips',
        'NEET preparation strategy',
        'CBSE chemistry guide',
        'Paaras Sir blog',
        'Canvas Classes blog',
        'chemistry exam strategy',
        'JEE Main 2026',
        'NEET 2026 syllabus',
    ],
    alternates: {
        canonical: `${BASE_URL}/blog`,
    },
    openGraph: {
        type: 'website',
        url: `${BASE_URL}/blog`,
        siteName: 'Canvas Classes',
        title: 'Canvas Classes Blog — JEE & NEET Chemistry Strategy',
        description: 'Chemistry concepts, exam strategy, and study tips for JEE Main, JEE Advanced, NEET, and CBSE.',
        images: [
            {
                url: `${BASE_URL}/og-image.png`,
                width: 1200,
                height: 630,
                alt: 'Canvas Classes Blog',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Canvas Classes Blog — JEE & NEET Chemistry Strategy',
        description: 'Chemistry concepts, exam strategy, and study tips for JEE Main, JEE Advanced, NEET, and CBSE.',
        creator: '@canvasclasses',
    },
    robots: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
    },
};

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
