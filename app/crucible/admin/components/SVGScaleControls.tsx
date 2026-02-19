'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface SVGScaleControlsProps {
  imageUrl?: string;
  onScaleChange?: (scale: number) => void;
  step?: number; // Increment step (1 for fine control, 5 for options)
  compact?: boolean; // Compact mode for options
}

export default function SVGScaleControls({ 
  imageUrl = '', 
  onScaleChange, 
  step = 1,
  compact = false 
}: SVGScaleControlsProps) {
  const [scale, setScale] = useState(100);

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
      <div className="flex items-center gap-1 p-1.5 bg-gray-800/50 border border-gray-700/50 rounded">
        <input
          type="range"
          min="1"
          max="100"
          step={step}
          value={scale}
          onChange={(e) => handleScaleChange(parseInt(e.target.value))}
          className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <span className="text-xs text-gray-400 font-mono w-8 text-center">{scale}%</span>
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
        min="1"
        max="100"
        step={step}
        value={scale}
        onChange={(e) => handleScaleChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
      <span className="text-xs text-gray-400 font-mono text-center">
        {scale}%
      </span>
      {imageUrl && (
        <div className="mt-1">
          <img 
            src={imageUrl} 
            alt="Preview" 
            style={{ transform: `scale(${scale / 100})`, transformOrigin: 'center' }}
            className="max-h-16 mx-auto transition-transform"
          />
        </div>
      )}
    </div>
  );
}
