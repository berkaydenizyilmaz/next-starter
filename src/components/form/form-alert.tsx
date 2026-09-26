import type { ComponentProps, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function FormAlert({
  message,
  variant = 'destructive',
}: {
  message?: string;
  variant?: ComponentProps<typeof Alert>['variant'];
}): ReactNode {
  if (!message) return null;

  return (
    <Alert variant={variant}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
