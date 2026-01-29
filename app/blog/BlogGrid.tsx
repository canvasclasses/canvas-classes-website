'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Post } from '../lib/blog';

// Client Component for Search & Grid
export default function BlogGrid({ initialPosts }: { initialPosts: Post[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Get all unique tags
    const allTags = Array.from(new Set(initialPosts.flatMap(post => post.tags)));

    const filteredPosts = initialPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    return (
        <div>
            {/* Filter Section */}
            <div className="mb-12 space-y-6">
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-4 border border-gray-800 rounded-2xl leading-5 bg-gray-900/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-900 focus:border-purple-500 transition-all shadow-lg"
                        placeholder="Search for topics, chapters, or exam tips..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedTag
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tag === selectedTag
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts Grid */}
            {filteredPosts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post) => (
                        <motion.article
                            key={post.slug}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-900/10 transition-all flex flex-col h-full group"
                        >
                            <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                                {post.image ? (
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 opacity-60" />
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />
                                        <BookOpen className="w-12 h-12 text-gray-700 group-hover:text-purple-500/50 transition-colors" />
                                    </div>
                                )}

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(post.date).toLocaleDateString()}
                                        </div>
                                        {post.tags.length > 0 && (
                                            <div className="flex items-center gap-1 text-purple-400">
                                                <Tag size={14} />
                                                {post.tags[0]}
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-purple-400 transition-colors">
                                        {post.title}
                                    </h2>

                                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center text-sm font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                                        Read Article <ArrowRight size={16} className="ml-2" />
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <BookOpen className="mx-auto h-16 w-16 text-gray-800 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
                    <p className="text-gray-400">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
}
