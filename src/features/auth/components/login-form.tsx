'use client';

import { type ReactNode, useActionState } from 'react';
import { Form } from '@/components/form/form';
import { FormAlert } from '@/components/form/form-alert';
import { FormSubmit } from '@/components/form/form-submit';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { login } from '@/features/auth/auth.actions';
import { REDIRECT_PARAM } from '@/features/auth/auth.constants';
import { idleFormState } from '@/lib/form/form.types';

export function LoginForm({ redirectTo }: { redirectTo?: string }): ReactNode {
  const [state, action] = useActionState(login, idleFormState());

  return (
    <Form action={action}>
      <FieldGroup>
        <FormAlert message={state.formError} />
        {redirectTo && (
          <input
            type="hidden"
            name={REDIRECT_PARAM}
            defaultValue={redirectTo}
          />
        )}
        <Field data-invalid={!!state.fieldErrors.email}>
          <FieldLabel htmlFor="email">E-posta</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={state.values.email}
            aria-invalid={!!state.fieldErrors.email}
          />
          <FieldError>{state.fieldErrors.email}</FieldError>
        </Field>
        <Field data-invalid={!!state.fieldErrors.password}>
          <FieldLabel htmlFor="password">Şifre</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!state.fieldErrors.password}
          />
          <FieldError>{state.fieldErrors.password}</FieldError>
        </Field>
        <FormSubmit>Giriş yap</FormSubmit>
      </FieldGroup>
    </Form>
  );
}
