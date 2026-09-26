'use client';

import { type ReactNode, useActionState } from 'react';
import { Form } from '@/components/form/form';
import { FormAlert } from '@/components/form/form-alert';
import { FormSubmit } from '@/components/form/form-submit';
import { revokeSessionAction } from '@/features/auth/auth.actions';
import { idleFormState } from '@/lib/utils/form.util';

export function RevokeSessionButton({ id }: { id: string }): ReactNode {
  const [state, action] = useActionState(revokeSessionAction, idleFormState());

  return (
    <Form action={action} className="flex flex-col items-end gap-2">
      <input type="hidden" name="id" defaultValue={id} />
      <FormSubmit variant="outline" size="sm">
        Oturumu kapat
      </FormSubmit>
      <FormAlert message={state.formError ?? state.fieldErrors.id} />
    </Form>
  );
}
