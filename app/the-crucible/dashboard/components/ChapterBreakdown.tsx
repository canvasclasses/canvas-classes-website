'use client';

import { ChapterStats } from '../utils/calculateAnalytics';
import { getAccuracyColor, getAccuracyLabel } from '../utils/calculateAnalytics';

interface ChapterBreakdownProps {
  chapters: ChapterStats[];
  onChapterClick?: (chapterId: string) => void;
}

export default function ChapterBreakdown({ chapters, onChapterClick }: ChapterBreakdownProps) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: '24px',
    }}>
      <h3 style={{
        fontSize: 18,
        fontWeight: 800,
        color: '#fff',
        marginBottom: 20,
      }}>
        📚 Chapter-wise Performance
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {chapters.slice(0, 5).map(chapter => {
          const color = getAccuracyColor(chapter.accuracy);
          const label = getAccuracyLabel(chapter.accuracy);

          return (
            <div
              key={chapter.chapterId}
              onClick={() => onChapterClick?.(chapter.chapterId)}
              style={{
                cursor: onChapterClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (onChapterClick) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 4,
                  }}>
                    {chapter.chapterName}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    {chapter.testsCount} test{chapter.testsCount !== 1 ? 's' : ''} • {chapter.questionsAttempted} questions
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <span style={{
                    fontSize: 11,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: `${color}20`,
                    color: color,
                    fontWeight: 700,
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: color,
                    fontFamily: 'monospace',
                    minWidth: 60,
                    textAlign: 'right',
                  }}>
                    {chapter.accuracy}%
                  </span>
                  {chapter.trend !== 'neutral' && (
                    <span style={{ fontSize: 16, color: chapter.trend === 'up' ? '#34d399' : '#f87171' }}>
                      {chapter.trend === 'up' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: 6,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 3,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${chapter.accuracy}%`,
                  height: '100%',
                  background: color,
                  borderRadius: 3,
                  transition: 'width 0.5s ease-out',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {chapters.length > 5 && (
        <button style={{
          marginTop: 16,
          width: '100%',
          padding: '10px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10,
          color: 'rgba(255,255,255,0.7)',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}>
          View All {chapters.length} Chapters →
        </button>
      )}
    </div>
  );
}
