'use client';

import { type ReactNode, useActionState } from 'react';
import { Form } from '@/components/form/form';
import { FormAlert } from '@/components/form/form-alert';
import { FormSubmit } from '@/components/form/form-submit';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteMeAction } from '@/features/user/user.actions';
import { idleFormState } from '@/lib/utils/form.util';

export function DeleteAccountDialog(): ReactNode {
  const [state, action] = useActionState(deleteMeAction, idleFormState());

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Hesabı sil
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hesabın silinsin mi?</AlertDialogTitle>
          <AlertDialogDescription>
            Bütün cihazlardaki oturumların kapanır. Geri alma süresi içinde
            tekrar giriş yaparsan hesabın geri açılır; süre dolunca kişisel
            verilerin kalıcı olarak silinir.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormAlert message={state.formError} />
        <AlertDialogFooter>
          <AlertDialogCancel>Vazgeç</AlertDialogCancel>
          <Form action={action}>
            <FormSubmit variant="destructive" className="w-full">
              Hesabı sil
            </FormSubmit>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
