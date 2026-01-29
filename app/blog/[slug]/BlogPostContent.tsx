'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { ZoomIn, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogPostContent({ content }: { content: string }) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // Custom Rehype Plugin to group consecutive images into a single paragraph
    const rehypeImageGrouper = () => {
        return (tree: any) => {
            const newChildren: any[] = [];
            let bufferedImages: any[] = [];

            const isImageNode = (node: any) => node.tagName === 'img';
            const isWhitespace = (node: any) => node.type === 'text' && !node.value.trim();
            const isImageParagraph = (node: any) => {
                if (node.tagName !== 'p') return false;
                if (!node.children) return false;
                const meaningfulChildren = node.children.filter((child: any) => !isWhitespace(child));
                return meaningfulChildren.length > 0 && meaningfulChildren.every(isImageNode);
            };

            tree.children.forEach((child: any) => {
                if (isImageParagraph(child)) {
                    const images = child.children.filter(isImageNode);
                    bufferedImages.push(...images);
                } else {
                    if (bufferedImages.length > 0) {
                        newChildren.push({
                            type: 'element',
                            tagName: 'p',
                            properties: {},
                            children: [...bufferedImages]
                        });
                        bufferedImages = [];
                    }
                    newChildren.push(child);
                }
            });

            if (bufferedImages.length > 0) {
                newChildren.push({
                    type: 'element',
                    tagName: 'p',
                    properties: {},
                    children: [...bufferedImages]
                });
            }
            tree.children = newChildren;
        };
    };

    const markdownComponents = {
        p: ({ node, children, ...props }: any) => {
            const textContent = typeof children === 'string' ? children :
                (Array.isArray(children) ? children.map((c: any) => typeof c === 'string' ? c : '').join('') : '');

            // 1. Heading Detection
            if (textContent.trim().endsWith(':') && textContent.length < 80) {
                return (
                    <p className="mb-4 mt-8 text-gray-100 font-bold text-xl" {...props}>
                        {children}
                    </p>
                );
            }

            // 2. Image Gallery Detection
            const hasImages = node?.children?.some((child: any) => child.tagName === 'img');
            if (hasImages) {
                const nonImageChildren = node?.children?.filter((child: any) =>
                    !(child.tagName === 'img' || (child.type === 'text' && !child.value.trim()))
                );

                if (!nonImageChildren || nonImageChildren.length === 0) {
                    const validChildren = React.Children.toArray(children).filter(child =>
                        !(typeof child === 'string' && !child.trim())
                    );
                    if (validChildren.length > 1) {
                        return (
                            <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto" {...props}>
                                {React.Children.map(validChildren, (child: any) =>
                                    React.cloneElement(child, { className: 'w-full h-full' })
                                )}
                            </div>
                        );
                    }
                    return <>{children}</>;
                }
            }
            return <p className="mb-6 text-gray-400 leading-8 text-lg" {...props}>{children}</p>;
        },
        img: ({ src, alt, className }: any) => (
            <div
                className={`rounded-xl overflow-hidden border border-gray-800 shadow-lg bg-gray-900 cursor-pointer group relative ${className || 'max-w-2xl w-full mx-auto my-10'}`}
                onClick={() => setLightboxImage(src)}
            >
                <img src={src} alt={alt || ''} className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.01]" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                    <div className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0">
                        <ZoomIn size={14} /> Tap to Expand
                    </div>
                </div>
                {alt && (
                    <p className="text-center text-sm text-gray-500 py-3 px-4 bg-gray-900/50 border-t border-gray-800 font-medium relative z-10">
                        {alt}
                    </p>
                )}
            </div>
        ),
        h1: ({ children }: any) => <h1 className="text-4xl font-extrabold text-gray-100 mt-12 mb-8 pb-3 border-b border-gray-800/60">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-3xl font-bold text-gray-100 mt-12 mb-6">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-2xl font-bold text-gray-100 mt-10 mb-4">{children}</h3>,
        ul: ({ children }: any) => <ul className="space-y-4 mb-8 ml-1">{children}</ul>,
        ol: ({ children }: any) => <ol className="list-decimal list-outside ml-6 space-y-4 mb-8 text-gray-400 marker:text-purple-500 marker:font-bold">{children}</ol>,
        li: ({ children }: any) => (
            <li className="flex items-start gap-3 text-gray-400 text-lg">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                <span className="leading-relaxed">{children}</span>
            </li>
        ),
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-purple-500 pl-6 py-5 my-10 bg-purple-500/5 rounded-r-2xl italic text-gray-400 text-lg leading-relaxed">
                {children}
            </blockquote>
        ),
        code: ({ children, inline }: any) => {
            if (inline) {
                return <code className="bg-gray-800 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-700">{children}</code>;
            }
            return <code className="block bg-gray-900 text-gray-300 p-6 rounded-2xl text-sm font-mono overflow-x-auto my-6 border border-gray-800">{children}</code>;
        },
    };

    return (
        <>
            <div className="prose prose-invert max-w-none text-gray-400">
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw, rehypeImageGrouper]}
                    components={markdownComponents as any}
                >
                    {content}
                </ReactMarkdown>
            </div>

            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-black/20 p-2 rounded-full">
                            <X size={32} />
                        </button>
                        <motion.img
                            src={lightboxImage}
                            alt="Full screen preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
