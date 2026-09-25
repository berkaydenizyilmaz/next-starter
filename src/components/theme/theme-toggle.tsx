'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { THEME } from '@/components/theme/theme.constants';
import { isTheme, useTheme } from '@/components/theme/use-theme';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const THEME_OPTIONS = [
  { value: THEME.LIGHT, label: 'Açık' },
  { value: THEME.DARK, label: 'Koyu' },
  { value: THEME.SYSTEM, label: 'Sistem' },
] as const;

export function ThemeToggle(): ReactNode {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Temayı değiştir" />
        }
      >
        <SunIcon className="dark:hidden" />
        <MoonIcon className="hidden dark:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value: unknown) => {
            if (isTheme(value)) setTheme(value);
          }}
        >
          {THEME_OPTIONS.map(({ value, label }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
