'use client';

import type { ComponentProps, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export function FormSubmit({
  children,
  disabled,
  ...props
}: Omit<ComponentProps<typeof Button>, 'type'>): ReactNode {
  const { pending } = useFormStatus();

  return (
    <Button {...props} type="submit" disabled={pending || disabled}>
      {pending && <Spinner />}
      {children}
    </Button>
  );
}
