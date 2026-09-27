'use client';

import Link from 'next/link';
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
import { resetPasswordAction } from '@/features/auth/auth.actions';
import { ResetLinkAlert } from '@/features/auth/components/reset-link-alert';
import { ROUTE } from '@/lib/constants/route.constants';
import { idleFormState } from '@/lib/utils/form.util';

export function ResetPasswordForm({ token }: { token: string }): ReactNode {
  const [state, action] = useActionState(resetPasswordAction, idleFormState());

  if (state.status === 'success') {
    return (
      <>
        <FormAlert
          variant="default"
          message="Şifren değişti. Tüm cihazlardaki oturumların kapatıldı."
        />
        <Link
          href={ROUTE.LOGIN}
          className="text-sm text-foreground underline underline-offset-4"
        >
          Giriş yap
        </Link>
      </>
    );
  }

  return (
    <Form action={action}>
      <FieldGroup>
        <FormAlert message={state.formError} />
        {state.fieldErrors.token && (
          <ResetLinkAlert message={state.fieldErrors.token} />
        )}
        <input type="hidden" name="token" defaultValue={token} />
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
        <FormSubmit>Şifreyi belirle</FormSubmit>
      </FieldGroup>
    </Form>
  );
}
