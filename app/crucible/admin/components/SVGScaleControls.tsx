'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface SVGScaleControlsProps {
  imageUrl?: string;
  initialScale?: number;
  onScaleChange?: (scale: number) => void;
  step?: number;
  compact?: boolean;
}

export default function SVGScaleControls({ 
  imageUrl = '', 
  initialScale = 100,
  onScaleChange, 
  step = 5,
  compact = false 
}: SVGScaleControlsProps) {
  const [scale, setScale] = useState(initialScale);

  // Sync if parent changes initialScale (e.g. switching questions)
  const prevInitial = useState(initialScale)[0];
  if (scale === prevInitial && initialScale !== prevInitial) {
    setScale(initialScale);
  }

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    onScaleChange?.(newScale);
  };

  const resetScale = () => {
    setScale(100);
    onScaleChange?.(100);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 p-1.5 bg-gray-800/50 border border-gray-700/50 rounded">
        <button onClick={resetScale} className="p-0.5 hover:bg-gray-700 rounded transition" title="Reset to 100%">
          <RotateCcw size={10} className="text-gray-500" />
        </button>
        <input
          type="range"
          min="10"
          max="300"
          step={step}
          value={scale}
          onChange={(e) => handleScaleChange(parseInt(e.target.value))}
          className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <span className="text-xs text-gray-400 font-mono w-9 text-right">{scale}%</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Scale:</span>
        <button
          onClick={resetScale}
          className="ml-auto p-1 hover:bg-gray-700 rounded transition"
          title="Reset to 100%"
        >
          <RotateCcw size={12} className="text-gray-400" />
        </button>
      </div>
      <input
        type="range"
        min="10"
        max="300"
        step={step}
        value={scale}
        onChange={(e) => handleScaleChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
      <span className="text-xs text-gray-400 font-mono text-center">
        {scale}%
      </span>
      {imageUrl && (
        <div className="mt-1 overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Preview" 
            style={{ width: `${scale}%`, height: 'auto', display: 'block', margin: '0 auto' }}
            className="transition-all"
          />
        </div>
      )}
    </div>
  );
}
