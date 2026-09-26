'use client';

import { type ReactNode, useActionState } from 'react';
import { Form } from '@/components/form/form';
import { FormAlert } from '@/components/form/form-alert';
import { FormSubmit } from '@/components/form/form-submit';
import { removeMyAvatarAction } from '@/features/user/user.actions';
import { idleFormState } from '@/lib/utils/form.util';

export function RemoveAvatarButton(): ReactNode {
  const [state, action] = useActionState(removeMyAvatarAction, idleFormState());

  return (
    <Form action={action} className="flex flex-col items-start gap-2">
      <FormSubmit variant="ghost" size="sm">
        Fotoğrafı kaldır
      </FormSubmit>
      <FormAlert message={state.formError} />
    </Form>
  );
}
