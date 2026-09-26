'use client';

import { type ReactNode, useActionState } from 'react';
import { Form } from '@/components/form/form';
import { FormAlert } from '@/components/form/form-alert';
import { FormSubmit } from '@/components/form/form-submit';
import { revokeAllSessionsAction } from '@/features/auth/auth.actions';
import { idleFormState } from '@/lib/utils/form.util';

export function RevokeAllSessionsButton(): ReactNode {
  const [state, action] = useActionState(
    revokeAllSessionsAction,
    idleFormState(),
  );

  return (
    <Form action={action} className="flex flex-col items-start gap-2">
      <FormSubmit variant="destructive">Tüm cihazlardan çıkış yap</FormSubmit>
      <FormAlert message={state.formError} />
    </Form>
  );
}
