'use client';

import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { type LaTeXValidationResult } from '@/lib/latexValidator';

interface LaTeXValidatorProps {
  validation: LaTeXValidationResult | null;
  label: string;
}

export default function LaTeXValidatorDisplay({ validation, label }: LaTeXValidatorProps) {
  if (!validation) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Status Indicator */}
      <div className={`flex items-center gap-2 text-xs font-medium ${
        validation.isValid ? 'text-green-400' : 'text-red-400'
      }`}>
        {validation.isValid ? (
          <>
            <CheckCircle size={14} />
            <span>{label} LaTeX is valid</span>
          </>
        ) : (
          <>
            <AlertCircle size={14} />
            <span>{label} has LaTeX errors</span>
          </>
        )}
      </div>

      {/* Errors */}
      {validation.errors.length > 0 && (
        <div className="space-y-1">
          {validation.errors.map((error, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2 bg-red-900/20 border border-red-600/30 rounded text-xs"
            >
              <AlertCircle size={12} className="text-red-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-mono text-red-300">
                  Line {error.line}, Col {error.column}
                </div>
                <div className="text-red-200 mt-0.5">{error.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warnings */}
      {validation.warnings.length > 0 && (
        <div className="space-y-1">
          {validation.warnings.map((warning, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2 bg-yellow-900/20 border border-yellow-600/30 rounded text-xs"
            >
              <AlertTriangle size={12} className="text-yellow-400 mt-0.5 shrink-0" />
              <div className="text-yellow-200">{warning}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
