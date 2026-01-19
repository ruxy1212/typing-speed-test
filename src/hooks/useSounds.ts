'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getSoundPreference, saveSoundPreference } from '@/lib/storage';

export function useSounds() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Audio refs - using refs to persist Audio objects across renders
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const cheerSound = useRef<HTMLAudioElement | null>(null);
  const booSound = useRef<HTMLAudioElement | null>(null);
  const cheerSoft = useRef<HTMLAudioElement | null>(null);

  // Initialize audio objects and load preference on mount
  useEffect(() => {
    // Load sound preference
    setSoundEnabled(getSoundPreference());
    
    // Preload audio files
    correctSoundRef.current = new Audio('/sounds/right.mp3');
    wrongSoundRef.current = new Audio('/sounds/wrong.mp3');
    cheerSound.current = new Audio('/sounds/cheer.mp3');
    booSound.current = new Audio('/sounds/boo.mp3');
    cheerSoft.current = new Audio('/sounds/cheer-soft.mp3');
    
    // Set volume (optional - adjust as needed)
    if (correctSoundRef.current) correctSoundRef.current.volume = 0.3;
    if (wrongSoundRef.current) wrongSoundRef.current.volume = 0.3;
    if (cheerSound.current) cheerSound.current.volume = 0.5;
    if (booSound.current) booSound.current.volume = 0.5;
    if (cheerSoft.current) cheerSoft.current.volume = 0.5;
  }, []);

  // Play correct keystroke sound
  const playCorrect = useCallback(() => {
    if (!soundEnabled || !correctSoundRef.current) return;
    
    // Reset to start for rapid keypresses
    correctSoundRef.current.currentTime = 0;
    correctSoundRef.current.play().catch(() => {
      toast.info('Sound playback failed');
    });
  }, [soundEnabled]);

  // Play wrong keystroke sound
  const playWrong = useCallback(() => {
    if (!soundEnabled || !wrongSoundRef.current) return;
    
    // Reset to start for rapid keypresses
    wrongSoundRef.current.currentTime = 0;
    wrongSoundRef.current.play().catch(() => {
      toast.info('Sound playback failed');
    });
  }, [soundEnabled]);

  const playCheer = useCallback(() => {
    if (!soundEnabled || !cheerSound.current) return;

    cheerSound.current.currentTime = 0;
    cheerSound.current.play().catch(() => {
      toast.info('Sound playback failed');
    });
  }, [soundEnabled]);

  const playBoo = useCallback(() => {
    if (!soundEnabled || !booSound.current) return;

    booSound.current.currentTime = 0;
    booSound.current.play().catch(() => {
      toast.info('Sound playback failed');
    });
  }, [soundEnabled]);

  const playCheerSoft = useCallback(() => {
    if (!soundEnabled || !cheerSoft.current) return;

    cheerSoft.current.currentTime = 0;
    cheerSoft.current.play().catch(() => {
      toast.info('Sound playback failed');
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
    playCheer,
    playBoo,
    playCheerSoft,
  };
}