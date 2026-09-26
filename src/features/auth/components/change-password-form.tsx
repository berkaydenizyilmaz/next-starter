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
import { changePasswordAction } from '@/features/auth/auth.actions';
import { idleFormState } from '@/lib/utils/form.util';

export function ChangePasswordForm(): ReactNode {
  const [state, action] = useActionState(changePasswordAction, idleFormState());

  return (
    <Form action={action}>
      <FieldGroup>
        <FormAlert message={state.formError} />
        {state.status === 'success' && (
          <FormAlert
            variant="default"
            message="Şifren değişti. Diğer cihazlardaki oturumların kapatıldı."
          />
        )}
        <Field data-invalid={!!state.fieldErrors.currentPassword}>
          <FieldLabel htmlFor="currentPassword">Mevcut şifre</FieldLabel>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!state.fieldErrors.currentPassword}
          />
          <FieldError>{state.fieldErrors.currentPassword}</FieldError>
        </Field>
        <Field data-invalid={!!state.fieldErrors.newPassword}>
          <FieldLabel htmlFor="newPassword">Yeni şifre</FieldLabel>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!state.fieldErrors.newPassword}
          />
          <FieldError>{state.fieldErrors.newPassword}</FieldError>
        </Field>
        <FormSubmit>Şifreyi değiştir</FormSubmit>
      </FieldGroup>
    </Form>
  );
}
