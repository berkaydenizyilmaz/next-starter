'use client';

import { useSyncExternalStore } from 'react';
import {
  DARK_SCHEME_QUERY,
  THEME,
  THEME_STORAGE_KEY,
} from '@/components/theme/theme.constants';

export type Theme = (typeof THEME)[keyof typeof THEME];
export type ResolvedTheme = typeof THEME.LIGHT | typeof THEME.DARK;

const THEMES: readonly unknown[] = Object.values(THEME);

export function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value);
}

export function useTheme(): {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
} {
  const theme = useSyncExternalStore(
    subscribeToStorage,
    readTheme,
    () => THEME.SYSTEM,
  );
  const prefersDark = useSyncExternalStore(
    subscribeToColorScheme,
    readPrefersDark,
    () => false,
  );

  return { theme, resolvedTheme: resolveTheme(theme, prefersDark), setTheme };
}

function resolveTheme(theme: Theme, prefersDark: boolean): ResolvedTheme {
  if (theme !== THEME.SYSTEM) return theme;
  return prefersDark ? THEME.DARK : THEME.LIGHT;
}

function subscribeToStorage(onChange: () => void): () => void {
  const listener = (event: StorageEvent): void => {
    if (event.key === THEME_STORAGE_KEY) onChange();
  };

  window.addEventListener('storage', listener);
  return () => window.removeEventListener('storage', listener);
}

function subscribeToColorScheme(onChange: () => void): () => void {
  const query = window.matchMedia(DARK_SCHEME_QUERY);

  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : THEME.SYSTEM;
  } catch {
    return THEME.SYSTEM;
  }
}

function readPrefersDark(): boolean {
  return window.matchMedia(DARK_SCHEME_QUERY).matches;
}

function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(
    new StorageEvent('storage', { key: THEME_STORAGE_KEY, newValue: theme }),
  );
}
