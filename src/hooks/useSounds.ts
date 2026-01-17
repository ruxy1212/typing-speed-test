'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

const SOUND_STORAGE_KEY = 'typing-test-sound-enabled';

// Get sound preference from localStorage
function getSoundPreference(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(SOUND_STORAGE_KEY);
  return stored !== null ? stored === 'true' : true; // Default to enabled
}

// Save sound preference to localStorage
function saveSoundPreference(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
}

export function useSounds() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Audio refs - using refs to persist Audio objects across renders
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio objects and load preference on mount
  useEffect(() => {
    // Load sound preference
    setSoundEnabled(getSoundPreference());
    
    // Preload audio files
    correctSoundRef.current = new Audio('/sounds/right.mp3');
    wrongSoundRef.current = new Audio('/sounds/wrong.mp3');
    
    // Set volume (optional - adjust as needed)
    if (correctSoundRef.current) correctSoundRef.current.volume = 0.3;
    if (wrongSoundRef.current) wrongSoundRef.current.volume = 0.3;
  }, []);

  // Play correct keystroke sound
  const playCorrect = useCallback(() => {
    if (!soundEnabled || !correctSoundRef.current) return;
    
    // Reset to start for rapid keypresses
    correctSoundRef.current.currentTime = 0;
    correctSoundRef.current.play().catch(() => {
      // Ignore autoplay errors (user hasn't interacted with page yet)
    });
  }, [soundEnabled]);

  // Play wrong keystroke sound
  const playWrong = useCallback(() => {
    if (!soundEnabled || !wrongSoundRef.current) return;
    
    // Reset to start for rapid keypresses
    wrongSoundRef.current.currentTime = 0;
    wrongSoundRef.current.play().catch(() => {
      // Ignore autoplay errors
    });
  }, [soundEnabled]);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      saveSoundPreference(newValue);
      return newValue;
    });
  }, []);

  return {
    soundEnabled,
    toggleSound,
    playCorrect,
    playWrong,
  };
}