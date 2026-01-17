'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import passageData from '@/app/data/data.json';
import layout from "simple-keyboard-layouts/build/layouts/english";

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Mode = 'timed' | 'passage';
export type TestState = 'idle' | 'running' | 'completed';
export type Verdict = 'new-game' | 'default' | 'high-score';

interface Passage {
  id: string;
  text: string;
}

interface TestResult {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  verdict: Verdict;
}

const DEFAULT_TIMED_MODE_DURATION = 60;
const PERSONAL_BEST_KEY = 'typing-test-personal-best';

// Extract all single-character keys from the layout
const allKeysArray = Object.values(layout.layout)
  .flat()
  .join(" ")
  .split(/\s+/)
  .filter(key => key.trim() !== "")

// Use a Set to remove duplicates (like functional keys found in both layers)
const keyList = Array.from(new Set(allKeysArray));

// Get personal best from localStorage
function getPersonalBest(): number | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(PERSONAL_BEST_KEY);
  return stored ? parseInt(stored, 10) : null;
}

// Save personal best to localStorage
function savePersonalBest(wpm: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PERSONAL_BEST_KEY, wpm.toString());
}

// Get a random passage from the specified difficulty
function getRandomPassage(difficulty: Difficulty): Passage {
  const passages = passageData[difficulty] as Passage[];
  const randomIndex = Math.floor(Math.random() * passages.length);
  return passages[randomIndex];
}

export function useTypingTest() {
  // Settings
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mode, setMode] = useState<Mode>('timed');
  const [timedDuration, setTimedDuration] = useState<number>(DEFAULT_TIMED_MODE_DURATION);
  
  // Test state
  const [testState, setTestState] = useState<TestState>('idle');
  const [passage, setPassage] = useState<Passage>(passageData['easy'][0]);
  const [typedText, setTypedText] = useState<string>('');
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [personalBest, setPersonalBest] = useState<number | null>(null);
  
  // Error tracking - tracks indices where errors occurred (even if later corrected)
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  
  // Result
  const [result, setResult] = useState<TestResult | null>(null);

  // Heatmap
  const [keyStats, setKeyStats] = useState<{ [key: string]: { count: number; errors: number } }>({});

  
  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Load personal best on mount
  useEffect(() => {
    setPersonalBest(getPersonalBest());
    setPassage(getRandomPassage('easy'));
  }, []);

  keyList.forEach((key) => {
    if (!keyStats[key]) {
      setKeyStats((prev) => ({
        ...prev,
        [key]: { count: 0, errors: 0 }
      }))
    }
  });

  // Calculate current stats
  const currentCharIndex = typedText.length;
  const passageText = passage.text;
  
  // Count correct and incorrect characters
  const { correctChars, incorrectChars } = (() => {
    let correct = 0;
    let incorrect = 0;
    
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === passageText[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }
    
    return { correctChars: correct, incorrectChars: incorrect };
  })();
  
  // Calculate WPM (words per minute)
  // Standard: 5 characters = 1 word
  const calculateWPM = useCallback((chars: number, seconds: number): number => {
    if (seconds === 0) return 0;
    const words = chars / 5;
    const minutes = seconds / 60;
    return Math.round(words / minutes);
  }, []);
  
  // Calculate accuracy
  const calculateAccuracy = useCallback((correct: number, total: number): number => {
    if (total === 0) return 100;
    return Math.round((correct / total) * 100);
  }, []);
  
  // Get current WPM
  const currentWPM = timeElapsed > 0 ? calculateWPM(correctChars, timeElapsed) : 0;
  
  // Get current accuracy (based on total errors ever made, not just current state)
  const totalErrorCount = errorIndices.size;
  // const totalTypedEver = Math.max(typedText.length, errorIndices.size > 0 ? Math.max(...Array.from(errorIndices)) + 1 : 0);
  const currentAccuracy = typedText.length > 0 
    ? calculateAccuracy(typedText.length - totalErrorCount, typedText.length)
    : 100;
  
  // Format time for display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  // Get time remaining for timed mode, or elapsed for passage mode
  const displayTime = mode === 'timed' 
    ? formatTime(Math.max(0, timedDuration - timeElapsed))
    : formatTime(timeElapsed);
  
  // Start the timer
  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeElapsed(elapsed);
      }
    }, 100);
  }, []);
  
  // Stop the timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // Complete the test
  const completeTest = useCallback(() => {
    stopTimer();
    setTestState('completed');
    
    const finalWPM = calculateWPM(correctChars, timeElapsed);
    const finalAccuracy = calculateAccuracy(correctChars, correctChars + errorIndices.size);
    
    // Determine verdict
    let verdict: Verdict = 'default';
    const currentPersonalBest = getPersonalBest();
    
    if (currentPersonalBest === null) {
      // First test ever
      verdict = 'new-game';
      savePersonalBest(finalWPM);
      setPersonalBest(finalWPM);
    } else if (finalWPM > currentPersonalBest) {
      // New high score
      verdict = 'high-score';
      savePersonalBest(finalWPM);
      setPersonalBest(finalWPM);
    }
    
    setResult({
      wpm: finalWPM,
      accuracy: finalAccuracy,
      correctChars,
      incorrectChars,
      verdict,
    });
  }, [stopTimer, calculateWPM, calculateAccuracy, correctChars, incorrectChars, timeElapsed, errorIndices.size]);
  
  // Check for test completion
  useEffect(() => {
    if (testState !== 'running') return;
    let timerId: number | undefined;
    
    // Check if passage is completed
    if (typedText.length >= passageText.length) {
      timerId = window.setTimeout(() => {
        completeTest();
      }, 0);
    }
    
    // Check if time is up in timed mode
    else if (mode === 'timed' && timeElapsed >= timedDuration) {
      timerId = window.setTimeout(() => {
        completeTest();
      }, 0);
    }
    return () => {
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
    };
  }, [testState, typedText.length, passageText.length, mode, timeElapsed, timedDuration, completeTest]);
  
  // Start the test
  const startTest = useCallback(() => {
    if (testState === 'running') return;
    setTestState('running');
    startTimer();
  }, [testState, startTimer]);
  
  // Handle key press
  const handleKeyPress = useCallback((key: string) => {
    if (testState === 'completed') return;
    // Start test on first keypress if idle
    if (testState === 'idle') {
      startTest();
    }
    
    if (key === 'Backspace') {
      setTypedText(prev => prev.slice(0, -1));
    } else if (key.length === 1) {
      const newTypedText = typedText + key;
      const newIndex = typedText.length;
      const currentKey = passageText[newIndex];
      const keyValue = currentKey === ' ' ? '{space}' : currentKey === 'Backspace' ? '{bksp}' : key; 
      const isError = key !== currentKey;
      
      // Check if this character is an error
      if (isError) {
        setErrorIndices(prev => new Set(prev).add(newIndex));
      }
      
      setTypedText(newTypedText);
      setKeyStats((prev) => ({
        ...prev,
        [keyValue]: {
          count: prev[keyValue]?.count + 1,
          errors: prev[keyValue]?.errors + (isError ? 1 : 0),
        },
      }));
    }
  }, [testState, typedText, passageText, startTest]);
  
  // Restart the test
  const restart = useCallback(() => {
    stopTimer();
    setTestState('idle');
    setTypedText('');
    setTimeElapsed(0);
    setErrorIndices(new Set());
    setResult(null);
    setPassage(getRandomPassage(difficulty));
  }, [stopTimer, difficulty]);
  
  // Handle difficulty change
  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    if (testState === 'idle') {
      setPassage(getRandomPassage(newDifficulty));
    }
  }, [testState]);
  
  // Handle mode change
  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
  }, []);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Get character status for rendering
  const getCharacterStatus = useCallback((index: number): 'correct' | 'incorrect' | 'current' | 'upcoming' => {
    if (index < typedText.length) {
      return typedText[index] === passageText[index] ? 'correct' : 'incorrect';
    } else if (index === typedText.length) {
      return 'current';
    }
    return 'upcoming';
  }, [typedText, passageText]);
  
  return {
    // Settings
    difficulty,
    mode,
    setDifficulty: handleDifficultyChange,
    setMode: handleModeChange,
    
    // Test state
    testState,
    passage,
    typedText,
    currentCharIndex,
    
    // Stats
    currentWPM,
    currentAccuracy,
    displayTime,
    correctChars,
    incorrectChars,
    personalBest,
    
    // Actions
    startTest,
    restart,
    handleKeyPress,
    
    // Helpers
    getCharacterStatus,
    
    // Result
    result,

    // Heatmap
    keyList,
    keyStats,

    // Timed config
    timedDuration,
    setTimedDuration,
  };
}
