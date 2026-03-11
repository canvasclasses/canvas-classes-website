"use client";

// Adaptive practice question card with:
// - SCQ/MCQ option selection with correct/incorrect highlighting after answer
// - NVT numerical input with submit button
// - Solution display after answering
// - Clean minimal dark UI

import { useState, useCallback } from 'react';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Question } from '@/app/the-crucible/components/types';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';

interface AdaptiveQuestionCardProps {
  question: Question;
  onAnswered: (isCorrect: boolean) => void;
}

export default function AdaptiveQuestionCard({ question, onAnswered }: AdaptiveQuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [nvtInput, setNvtInput] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  const isMCQ = question.type === 'MCQ';
  const isNVT = question.type === 'NVT';
  const hasSolution = !!question.solution?.text_markdown;

  const handleOptionClick = useCallback((optionId: string) => {
    if (answered) return;

    if (isMCQ) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      // SCQ - select and submit immediately
      setSelectedOption(optionId);
      setAnswered(true);
      const option = question.options?.find(o => o.id === optionId);
      const correct = option?.is_correct ?? false;
      setIsCorrectAnswer(correct);
      onAnswered(correct);
    }
  }, [answered, isMCQ, question.options, onAnswered]);

  const handleSubmitMCQ = useCallback(() => {
    if (selectedOptions.length === 0 || answered) return;
    setAnswered(true);
    
    const correctIds = question.options?.filter(o => o.is_correct).map(o => o.id) ?? [];
    const isCorrect = 
      correctIds.length === selectedOptions.length &&
      selectedOptions.every(id => correctIds.includes(id));
    
    setIsCorrectAnswer(isCorrect);
    onAnswered(isCorrect);
  }, [selectedOptions, answered, question.options, onAnswered]);

  const handleNVTSubmit = useCallback(() => {
    if (!nvtInput.trim() || answered) return;
    setAnswered(true);
    const userVal = parseFloat(nvtInput.trim());
    const correctVal = question.answer?.integer_value;
    const isCorrect = correctVal !== undefined && !isNaN(userVal) && Math.abs(userVal - correctVal) < 0.01;
    setIsCorrectAnswer(isCorrect);
    onAnswered(isCorrect);
  }, [nvtInput, answered, question.answer, onAnswered]);

  // Helper for option styling after answer
  const getOptionStyle = (option: { id: string; is_correct: boolean }) => {
    const isSelected = isMCQ ? selectedOptions.includes(option.id) : selectedOption === option.id;
    if (!answered) {
      return {
        border: `1.5px solid ${isSelected ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
        background: isSelected ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)',
      };
    }
    // After answer: highlight correct green, wrong red
    if (option.is_correct) {
      return {
        border: '1.5px solid rgba(52,211,153,0.5)',
        background: 'rgba(52,211,153,0.08)',
      };
    }
    if (isSelected && !option.is_correct) {
      return {
        border: '1.5px solid rgba(248,113,113,0.5)',
        background: 'rgba(248,113,113,0.08)',
      };
    }
    return {
      border: '1.5px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.015)',
    };
  };

  const getOptionBadgeStyle = (option: { id: string; is_correct: boolean }) => {
    const isSelected = isMCQ ? selectedOptions.includes(option.id) : selectedOption === option.id;
    if (!answered) {
      return {
        border: `1.5px solid ${isSelected ? '#3b82f6' : 'rgba(255,255,255,0.3)'}`,
        background: isSelected ? '#3b82f6' : 'transparent',
        color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)',
      };
    }
    if (option.is_correct) {
      return { border: '1.5px solid #34d399', background: '#34d399', color: '#fff' };
    }
    if (isSelected && !option.is_correct) {
      return { border: '1.5px solid #f87171', background: '#f87171', color: '#fff' };
    }
    return { border: '1.5px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.3)' };
  };

  const diffColor = question.metadata.difficulty === 'Easy' ? '#34d399' : question.metadata.difficulty === 'Medium' ? '#fbbf24' : '#f87171';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '28px 32px',
      }}>
        {/* Question Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 6, letterSpacing: '0.05em' }}>
            {question.display_id}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: diffColor, background: `${diffColor}18`, padding: '4px 10px', borderRadius: 6 }}>
            {question.metadata.difficulty}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 6 }}>
            {question.type}
          </span>
          {question.metadata.is_pyq && question.metadata.exam_source && (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '4px 10px', borderRadius: 6 }}>
              {question.metadata.exam_source.exam} {question.metadata.exam_source.year}
            </span>
          )}
          {/* Result badge after answering */}
          {answered && (
            <span style={{
              fontSize: 11, fontWeight: 800, marginLeft: 'auto',
              padding: '4px 10px', borderRadius: 6, letterSpacing: '0.04em',
              color: isCorrectAnswer ? '#34d399' : '#f87171',
              background: isCorrectAnswer ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
              border: `1px solid ${isCorrectAnswer ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
            }}>
              {isCorrectAnswer ? '✓ CORRECT' : '✗ INCORRECT'}
            </span>
          )}
        </div>

        {/* Question Text */}
        <div style={{ marginBottom: 24, fontSize: 17, lineHeight: 1.7, color: '#fff' }}>
          <MathRenderer 
            markdown={question.question_text.markdown} 
            fontSize={17}
            imageScale={question.svg_scales?.question ?? 100}
          />
        </div>

        {/* MCQ Notice */}
        {isMCQ && !answered && (
          <div style={{ fontSize: 11, color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', padding: '8px 14px', borderRadius: 8, marginBottom: 16, fontWeight: 600 }}>
            Select one or more correct options
          </div>
        )}

        {/* Options (SCQ/MCQ) */}
        {question.options && question.options.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {question.options.map(option => {
              const optStyle = getOptionStyle(option);
              const badgeStyle = getOptionBadgeStyle(option);
              const isSelected = isMCQ ? selectedOptions.includes(option.id) : selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  disabled={answered}
                  style={{
                    padding: '14px 18px', borderRadius: 12,
                    ...optStyle,
                    cursor: answered ? 'default' : 'pointer',
                    textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{
                    width: 24, height: 24, borderRadius: 6,
                    ...badgeStyle,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>
                    {answered && option.is_correct ? <Check style={{ width: 12, height: 12 }} /> :
                     answered && isSelected && !option.is_correct ? <X style={{ width: 12, height: 12 }} /> :
                     isSelected && isMCQ ? <Check style={{ width: 12, height: 12 }} /> :
                     option.id.toUpperCase()}
                  </span>
                  <span style={{ flex: 1, fontSize: 15, color: answered && !option.is_correct && !isSelected ? 'rgba(255,255,255,0.4)' : '#fff' }}>
                    <MathRenderer 
                      markdown={option.text} 
                      fontSize={15}
                      imageScale={question.svg_scales?.[`option_${option.id}`] ?? 100}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Submit button for MCQ */}
        {isMCQ && selectedOptions.length > 0 && !answered && (
          <button onClick={handleSubmitMCQ} style={{
            marginTop: 16, padding: '12px 24px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%',
          }}>
            Submit Answer
          </button>
        )}

        {/* NVT numerical input */}
        {isNVT && (
          <div style={{ marginTop: 4 }}>
            {!answered ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
                <input
                  type="text"
                  value={nvtInput}
                  onChange={e => setNvtInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleNVTSubmit(); }}
                  placeholder="Enter answer..."
                  style={{
                    flex: 1, padding: '14px 18px', borderRadius: 12,
                    border: '1.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)',
                    color: '#fff', fontSize: 16, fontWeight: 600, outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
                <button
                  onClick={handleNVTSubmit}
                  disabled={!nvtInput.trim()}
                  style={{
                    padding: '14px 24px', borderRadius: 12, border: 'none',
                    background: nvtInput.trim() ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.04)',
                    color: nvtInput.trim() ? '#fff' : 'rgba(255,255,255,0.2)',
                    fontSize: 14, fontWeight: 700, cursor: nvtInput.trim() ? 'pointer' : 'not-allowed',
                    flexShrink: 0,
                  }}
                >
                  Submit
                </button>
              </div>
            ) : (
              <div style={{
                padding: '14px 18px', borderRadius: 12,
                background: isCorrectAnswer ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                border: `1.5px solid ${isCorrectAnswer ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Your answer:</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: isCorrectAnswer ? '#34d399' : '#f87171' }}>{nvtInput}</span>
                {question.answer?.integer_value !== undefined && !isCorrectAnswer && (
                  <>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Correct:</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#34d399' }}>{question.answer.integer_value}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Subjective type */}
        {question.type === 'SUBJ' && (
          <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
              Solve this on paper, then check the solution
            </div>
            <button
              onClick={() => { setAnswered(true); onAnswered(false); }}
              disabled={answered}
              style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.1)', color: '#a78bfa', fontSize: 13, fontWeight: 600, cursor: answered ? 'default' : 'pointer' }}
            >
              {answered ? 'Answered' : 'Mark as Attempted'}
            </button>
          </div>
        )}

        {/* Solution toggle — only after answering */}
        {answered && hasSolution && (
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => setShowSolution(!showSolution)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '12px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              {showSolution ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
            {showSolution && (
              <div style={{
                marginTop: 10, padding: '20px 24px', borderRadius: 12,
                background: 'rgba(45,212,191,0.03)', border: '1px solid rgba(45,212,191,0.12)',
                fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)',
              }}>
                <MathRenderer
                  markdown={question.solution.text_markdown}
                  fontSize={15}
                  imageScale={question.svg_scales?.solution ?? 100}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
