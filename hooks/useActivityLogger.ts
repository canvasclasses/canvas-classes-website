/**
 * Activity Logger Hook
 * 
 * Provides a function to log question attempts to the backend API.
 * Handles timing, session management, and error recovery.
 */

'use client';

import { useCallback, useRef, useState } from 'react';

interface LogActivityParams {
    questionId: string;
    isCorrect: boolean;
    timeSpentSec: number;
    selectedOptionId?: string;
    enteredAnswer?: string;
    mode?: 'practice' | 'exam' | 'review' | 'challenge';
}

interface MasteryStatus {
    accuracy: number;
    attempts: number;
    correct: number;
    status: 'RED' | 'YELLOW' | 'GREEN' | 'UNRATED';
    last_attempt: string;
}

interface LogActivityResponse {
    success: boolean;
    masteryUpdates: Record<string, MasteryStatus>;
    message: string;
}

export function useActivityLogger() {
    const [isLogging, setIsLogging] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);
    const sessionIdRef = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const questionStartTimeRef = useRef<number>(Date.now());

    // Start timing for a new question
    const startQuestionTimer = useCallback(() => {
        questionStartTimeRef.current = Date.now();
    }, []);

    // Calculate time spent on current question
    const getTimeSpent = useCallback(() => {
        return Math.round((Date.now() - questionStartTimeRef.current) / 1000);
    }, []);

    // Log an activity
    const logActivity = useCallback(async (params: LogActivityParams): Promise<LogActivityResponse | null> => {
        setIsLogging(true);
        setLastError(null);

        try {
            const response = await fetch('/api/activity/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...params,
                    sessionId: sessionIdRef.current,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to log activity');
            }

            const data: LogActivityResponse = await response.json();
            return data;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Activity logging failed:', errorMessage);
            setLastError(errorMessage);

            // Don't throw - activity logging should be non-blocking
            return null;

        } finally {
            setIsLogging(false);
        }
    }, []);

    // Quick log with auto-timing
    const logQuestionAttempt = useCallback(async (
        questionId: string,
        isCorrect: boolean,
        selectedOptionId?: string,
        mode: 'practice' | 'exam' = 'practice'
    ) => {
        const timeSpentSec = getTimeSpent();
        return logActivity({
            questionId,
            isCorrect,
            timeSpentSec,
            selectedOptionId,
            mode,
        });
    }, [logActivity, getTimeSpent]);

    // Start a new session (e.g., when starting a new practice round)
    const startNewSession = useCallback(() => {
        sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Get current session ID
    const getSessionId = useCallback(() => {
        return sessionIdRef.current;
    }, []);

    return {
        logActivity,
        logQuestionAttempt,
        startQuestionTimer,
        getTimeSpent,
        startNewSession,
        getSessionId,
        isLogging,
        lastError,
    };
}
