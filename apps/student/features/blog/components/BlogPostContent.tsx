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
    const safeContent = typeof content === 'string' ? content.trim() : '';

    // Custom Rehype Plugin to group consecutive images into a single paragraph
    interface HastNode {
        tagName?: string;
        type: string;
        value?: string;
        properties?: Record<string, unknown>;
        children?: HastNode[];
    }

    interface HastTree {
        children: HastNode[];
    }

    // HAST element nodes MUST carry a `properties` object — react-markdown calls
    // Object.hasOwn(properties, key) during rendering, which throws "Cannot convert
    // undefined or null to object" if properties is missing.
    const makeImageParagraph = (images: HastNode[]): HastNode => ({
        type: 'element',
        tagName: 'p',
        properties: {},
        children: images,
    });

    const rehypeImageGrouper = () => {
        return (tree: HastTree) => {
            if (!tree || !Array.isArray(tree.children)) return;
            const newChildren: HastNode[] = [];
            let bufferedImages: HastNode[] = [];

            const isImageNode = (node: HastNode) => node?.tagName === 'img';
            const isWhitespace = (node: HastNode) => node?.type === 'text' && !node.value?.trim();
            const isImageParagraph = (node: HastNode) => {
                if (!node || node.tagName !== 'p') return false;
                if (!node.children) return false;
                const meaningfulChildren = node.children.filter((child) => !isWhitespace(child));
                return meaningfulChildren.length > 0 && meaningfulChildren.every(isImageNode);
            };

            tree.children.forEach((child) => {
                if (isImageParagraph(child)) {
                    const images = child.children?.filter(isImageNode) ?? [];
                    bufferedImages.push(...images);
                } else {
                    if (bufferedImages.length > 0) {
                        newChildren.push(makeImageParagraph([...bufferedImages]));
                        bufferedImages = [];
                    }
                    newChildren.push(child);
                }
            });

            if (bufferedImages.length > 0) {
                newChildren.push(makeImageParagraph([...bufferedImages]));
            }
            tree.children = newChildren;
        };
    };

    interface MarkdownPProps {
        node?: HastNode;
        children?: React.ReactNode;
        [key: string]: unknown;
    }

    interface MarkdownImgProps {
        src?: string;
        alt?: string;
        className?: string;
    }

    const markdownComponents: Partial<Record<string, React.ElementType<Record<string, unknown>>>> = {
        p: ({ node, children, ...props }: MarkdownPProps) => {
            const textContent = typeof children === 'string' ? children :
                (Array.isArray(children) ? children.map((c: React.ReactNode) => typeof c === 'string' ? c : '').join('') : '');

            // 1. Heading Detection
            if (textContent.trim().endsWith(':') && textContent.length < 80) {
                return (
                    <p className="mb-4 mt-8 text-gray-100 font-bold text-xl" {...props}>
                        {children}
                    </p>
                );
            }

            // 2. Image Gallery Detection
            const hasImages = node?.children?.some((child: HastNode) => child.tagName === 'img');
            if (hasImages) {
                const nonImageChildren = node?.children?.filter((child: HastNode) =>
                    !(child.tagName === 'img' || (child.type === 'text' && !child.value?.trim()))
                );

                if (!nonImageChildren || nonImageChildren.length === 0) {
                    const validChildren = React.Children.toArray(children).filter(child =>
                        !(typeof child === 'string' && !child.trim())
                    );
                    if (validChildren.length > 1) {
                        return (
                            <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto" {...props}>
                                {React.Children.map(validChildren, (child) =>
                                    React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<Record<string, unknown>>, { className: 'w-full h-full' }) : child
                                )}
                            </div>
                        );
                    }
                    return <>{children}</>;
                }
            }
            return <p className="mb-6 text-gray-400 leading-8 text-lg" {...props}>{children}</p>;
        },
        img: ({ src, alt, className }: MarkdownImgProps) => (
            <div
                className={`rounded-xl overflow-hidden border border-gray-800 shadow-lg bg-gray-900 cursor-pointer group relative ${className || 'max-w-2xl w-full mx-auto my-10'}`}
                onClick={() => setLightboxImage(src ?? null)}
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
        h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-4xl font-extrabold text-gray-100 mt-12 mb-8 pb-3 border-b border-gray-800/60">{children}</h1>,
        h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-3xl font-bold text-gray-100 mt-12 mb-6">{children}</h2>,
        h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-2xl font-bold text-gray-100 mt-10 mb-4">{children}</h3>,
        ul: ({ children }: { children?: React.ReactNode }) => <ul className="space-y-4 mb-8 ml-1">{children}</ul>,
        ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal list-outside ml-6 space-y-4 mb-8 text-gray-400 marker:text-purple-500 marker:font-bold">{children}</ol>,
        li: ({ children }: { children?: React.ReactNode }) => (
            <li className="flex items-start gap-3 text-gray-400 text-lg">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                <span className="leading-relaxed">{children}</span>
            </li>
        ),
        blockquote: ({ children }: { children?: React.ReactNode }) => (
            <blockquote className="border-l-4 border-purple-500 pl-6 py-5 my-10 bg-purple-500/5 rounded-r-2xl italic text-gray-400 text-lg leading-relaxed">
                {children}
            </blockquote>
        ),
        code: ({ children, inline }: { children?: React.ReactNode; inline?: boolean }) => {
            if (inline) {
                return <code className="bg-gray-800 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-700">{children}</code>;
            }
            return <code className="block bg-gray-900 text-gray-300 p-6 rounded-2xl text-sm font-mono overflow-x-auto my-6 border border-gray-800">{children}</code>;
        },
    };

    return (
        <>
            <div className="prose prose-invert max-w-none text-gray-400">
                {safeContent ? (
                    <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex, rehypeRaw, rehypeImageGrouper]}
                        components={markdownComponents}
                    >
                        {safeContent}
                    </ReactMarkdown>
                ) : (
                    <p className="text-gray-500 italic">This post has no content yet.</p>
                )}
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
