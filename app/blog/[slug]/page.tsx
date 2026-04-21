import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import 'katex/dist/katex.min.css';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import BlogPostContent from './BlogPostContent';
import { Metadata } from 'next';
import { getPublishedPostBySlug, getPublishedSlugs } from '../../lib/blogDb';

export const revalidate = 60;

export async function generateStaticParams() {
    const slugs = await getPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;
    const post = await getPublishedPostBySlug(slug);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    const ogImage = post.image
        ? (post.image.startsWith('http') ? post.image : `https://www.canvasclasses.in${post.image}`)
        : 'https://www.canvasclasses.in/og-image.png';

    const metaTitle = post.seo?.title || post.title;
    const metaDesc = post.seo?.description || post.excerpt;

    return {
        title: metaTitle,
        description: metaDesc,
        openGraph: {
            title: metaTitle,
            description: metaDesc,
            url: `https://www.canvasclasses.in/blog/${slug}`,
            siteName: 'Canvas Classes',
            locale: 'en_US',
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            section: 'Education',
            tags: post.tags,
            images: [
                { url: ogImage, width: 1200, height: 630, alt: post.title },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDesc,
            images: [ogImage],
            creator: '@canvasclasses',
        },
        alternates: {
            canonical: `https://www.canvasclasses.in/blog/${slug}`,
        },
    };
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params;

    const post = await getPublishedPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans selection:bg-purple-500/30">
            <Navbar authButton={<div />} />

            <main className="pt-28 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
                <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-purple-400 mb-8 transition-colors font-medium">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Blog
                </Link>

                <article>
                    <div className="mb-12 text-center">
                        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                            {post.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-100 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-gray-500" />
                                <span className="font-medium">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-500" />
                                <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    {post.image && (
                        <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 aspect-video relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                        </div>
                    )}

                    <BlogPostContent content={post.content} />
                </article>
            </main>
        </div>
    );
}
