'use client';

import { useSyncExternalStore } from 'react';
import { THEME, THEME_STORAGE_KEY } from '@/components/theme/theme.constants';

export type Theme = (typeof THEME)[keyof typeof THEME];

const THEMES: readonly unknown[] = Object.values(THEME);

export function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value);
}

export function useTheme(): {
  theme: Theme;
  setTheme: (theme: Theme) => void;
} {
  const theme = useSyncExternalStore(subscribe, readTheme, () => THEME.SYSTEM);
  return { theme, setTheme };
}

function subscribe(onChange: () => void): () => void {
  const listener = (event: StorageEvent): void => {
    if (event.key === THEME_STORAGE_KEY) onChange();
  };

  window.addEventListener('storage', listener);
  return () => window.removeEventListener('storage', listener);
}

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : THEME.SYSTEM;
  } catch {
    return THEME.SYSTEM;
  }
}

function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(
    new StorageEvent('storage', { key: THEME_STORAGE_KEY, newValue: theme }),
  );
}
