import type { ReactNode } from 'react';
import { Form } from '@/components/form/form';
import { FormSubmit } from '@/components/form/form-submit';
import { logoutAction } from '@/features/auth/auth.actions';

export function SignOutButton(): ReactNode {
  return (
    <Form action={logoutAction}>
      <FormSubmit variant="ghost" size="sm">
        Çıkış yap
      </FormSubmit>
    </Form>
  );
}
