'use client';

const STORAGE_KEY = 'typing-speed-test1212';

export interface StorageData {
  soundEnabled: boolean;
  profileId: string;
  username: string;
  personalBest: number | null;
  keyStats: { [key: string]: { count: number; errors: number } };
}

const defaultData: StorageData = {
  soundEnabled: true,
  profileId: '',
  username: '',
  personalBest: null,
  keyStats: {},
};

// Get all storage data
export function getStorageData(): StorageData {
  if (typeof window === 'undefined') return { ...defaultData };
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { ...defaultData };
  }
  
  try {
    const parsed = JSON.parse(stored);
    return { ...defaultData, ...parsed };
  } catch {
    return { ...defaultData };
  }
}

// Save all storage data
export function saveStorageData(data: Partial<StorageData>): void {
  if (typeof window === 'undefined') return;
  
  const current = getStorageData();
  const updated = { ...current, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Sound preference
export function getSoundPreference(): boolean {
  return getStorageData().soundEnabled;
}

export function saveSoundPreference(enabled: boolean): void {
  saveStorageData({ soundEnabled: enabled });
}

// Profile ID
export function getProfileId(): string {
  const data = getStorageData();
  if (!data.profileId) {
    const profileId = crypto.randomUUID ? crypto.randomUUID() : `fallback-${Date.now()}`;
    saveStorageData({ profileId });
    return profileId;
  }
  return data.profileId;
}

// Username
export function getUsername(): string {
  const data = getStorageData();
  if (!data.username) {
    const username = getProfileId();
    saveStorageData({ username });
    return username;
  }
  return data.username;
}

export function saveUsername(username: string): void {
  saveStorageData({ username });
}

// Personal best
export function getPersonalBest(): number | null {
  return getStorageData().personalBest;
}

export function savePersonalBest(wpm: number): void {
  saveStorageData({ personalBest: wpm });
}

// Key stats
export function getKeyStats(): { [key: string]: { count: number; errors: number } } {
  return getStorageData().keyStats;
}

export function saveKeyStats(stats: { [key: string]: { count: number; errors: number } }): void {
  saveStorageData({ keyStats: stats });
}
