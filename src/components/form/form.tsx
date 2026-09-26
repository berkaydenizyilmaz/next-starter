import type { ComponentProps, ReactNode } from 'react';

export function Form(
  props: Omit<ComponentProps<'form'>, 'noValidate'>,
): ReactNode {
  return <form {...props} noValidate />;
}
