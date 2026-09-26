import type { ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function FormAlert({ message }: { message?: string }): ReactNode {
  if (!message) return null;

  return (
    <Alert variant="destructive">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
