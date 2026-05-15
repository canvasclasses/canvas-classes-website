'use client';

import { ITestResult } from '@/lib/models/TestResult';
import { formatTime, getAccuracyColor } from '../utils/calculateAnalytics';

interface RecentTestsProps {
  tests: ITestResult[];
  chapterMap: Record<string, string>;
  onReview?: (testId: string) => void;
  onRetake?: (chapterId: string) => void;
}

export default function RecentTests({ tests, chapterMap, onReview, onRetake }: RecentTestsProps) {
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
        🕐 Recent Tests
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tests.slice(0, 5).map(test => {
          const color = getAccuracyColor(test.score.percentage);
          const date = new Date(test.created_at);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

          return (
            <div
              key={test._id.toString()}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: '16px',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 4,
                  }}>
                    {chapterMap[test.chapter_id] || test.chapter_id}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    {test.test_config.difficulty_mix} • {test.test_config.count}Q • {test.test_config.question_sort}
                  </div>
                </div>
                <div style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.4)',
                  textAlign: 'right',
                }}>
                  {dateStr}, {timeStr}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 12,
              }}>
                <div style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: color,
                  fontFamily: 'monospace',
                }}>
                  {test.score.correct}/{test.score.total}
                </div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: color,
                }}>
                  {test.score.percentage}%
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  • {formatTime(test.timing.total_seconds)}
                </div>
                {test.saved_to_progress && (
                  <div style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: 'rgba(52,211,153,0.15)',
                    color: '#34d399',
                    fontWeight: 700,
                  }}>
                    SAVED
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: 4,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 2,
                overflow: 'hidden',
                marginBottom: 12,
              }}>
                <div style={{
                  width: `${test.score.percentage}%`,
                  height: '100%',
                  background: color,
                  borderRadius: 2,
                }} />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {onReview && (
                  <button
                    onClick={() => onReview(test._id.toString())}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'rgba(124,58,237,0.15)',
                      border: '1px solid rgba(124,58,237,0.3)',
                      borderRadius: 8,
                      color: '#a78bfa',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Review Solutions
                  </button>
                )}
                {onRetake && (
                  <button
                    onClick={() => onRetake(test.chapter_id)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Retake Test
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
