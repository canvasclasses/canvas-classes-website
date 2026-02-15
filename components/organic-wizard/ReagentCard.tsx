'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ReagentCardProps {
    reagent: {
        id: string;
        display: string;
    };
    isDraggable?: boolean;
    onDragStart?: (e: any, reagent: any) => void;
    onClick?: () => void;
}

const ReagentCard: React.FC<ReagentCardProps> = ({
    reagent,
    isDraggable = true,
    onDragStart,
    onClick
}) => {
    return (
        <motion.div
            layoutId={reagent.id}
            initial={{ scale: 0.9, rotate: Math.random() * 4 - 2 }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
            whileTap={{ scale: 0.95 }}
            drag={isDraggable}
            dragSnapToOrigin
            onDragStart={(e) => onDragStart && onDragStart(e, reagent)}
            className={`
                relative w-32 h-24 p-3 flex items-center justify-center text-center
                bg-yellow-100 shadow-md cursor-grab active:cursor-grabbing
                font-handwriting text-slate-800 border-t-8 border-yellow-200/50
                transform transition-all
            `}
            style={{
                boxShadow: '2px 4px 6px rgba(0,0,0,0.3)',
                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', // Fallback for handwriting
            }}
            onClick={onClick}
        >
            {/* Tape effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/40 rotate-1 backdrop-blur-sm shadow-sm" />

            <div
                className="text-sm font-bold leading-tight"
                dangerouslySetInnerHTML={{ __html: reagent.display }} // Allow HTML for subscripts
            />
        </motion.div>
    );
};

export default ReagentCard;
