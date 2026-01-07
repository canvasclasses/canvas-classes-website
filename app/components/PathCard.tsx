'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PathCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
    iconBg: string;
    href?: string;
    hasChildren?: boolean;
    onClick?: () => void;
    index: number;
}

export default function PathCard({
    icon: Icon,
    title,
    description,
    gradient,
    iconBg,
    href,
    hasChildren,
    onClick,
    index,
}: PathCardProps) {
    const cardContent = (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative overflow-hidden rounded-2xl p-6 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${gradient}`}
        >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Decorative circle */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-white/80 text-sm leading-relaxed mb-4">
                    {description}
                </p>

                {/* Action indicator */}
                <div className="flex items-center text-white/90 text-sm font-semibold">
                    <span>{hasChildren ? 'Explore Options' : 'Go to Page'}</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
            </div>
        </motion.div>
    );

    if (href && !hasChildren) {
        return <Link href={href}>{cardContent}</Link>;
    }

    return <div onClick={onClick}>{cardContent}</div>;
}
