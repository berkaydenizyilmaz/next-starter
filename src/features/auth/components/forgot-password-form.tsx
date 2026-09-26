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
import { requestPasswordResetAction } from '@/features/auth/auth.actions';
import { idleFormState } from '@/lib/utils/form.util';

export function ForgotPasswordForm(): ReactNode {
  const [state, action] = useActionState(
    requestPasswordResetAction,
    idleFormState(),
  );

  return (
    <Form action={action}>
      <FieldGroup>
        <FormAlert message={state.formError} />
        {state.status === 'success' && (
          <FormAlert
            variant="default"
            message="Bu e-postayla bir hesap varsa şifre sıfırlama bağlantısını gönderdik."
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
        <FormSubmit>Bağlantı gönder</FormSubmit>
      </FieldGroup>
    </Form>
  );
}
