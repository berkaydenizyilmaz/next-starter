import Form from 'next/form';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import type { AuditLogSearch } from '@/features/audit-log/audit-log.schemas';
import { AUDIT_EVENT, AUDIT_OUTCOME } from '@/lib/constants/audit.constants';
import { ROUTE } from '@/lib/constants/route.constants';
import {
  auditEventLabel,
  auditOutcomeLabel,
} from '@/lib/messages/audit.messages';

type FilterField = Exclude<keyof AuditLogSearch, 'page'>;

const INPUT_FILTERS: readonly {
  name: FilterField;
  label: string;
  type?: 'date';
}[] = [
  { name: 'actorId', label: 'Aktör id' },
  { name: 'subjectId', label: 'Konu id' },
  { name: 'targetType', label: 'Hedef türü' },
  { name: 'targetId', label: 'Hedef id' },
  { name: 'from', label: 'Başlangıç', type: 'date' },
  { name: 'to', label: 'Bitiş', type: 'date' },
];

export function AuditLogFilters({
  input,
  fieldErrors,
}: {
  input: Partial<Record<FilterField, string>>;
  fieldErrors: Partial<Record<FilterField, string>>;
}): ReactNode {
  return (
    <Form
      action={ROUTE.ADMIN_AUDIT_LOGS}
      noValidate
      className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <Field data-invalid={!!fieldErrors.event}>
        <FieldLabel htmlFor="event">Olay</FieldLabel>
        <NativeSelect
          id="event"
          name="event"
          defaultValue={input.event ?? ''}
          className="w-full"
          aria-invalid={!!fieldErrors.event}
        >
          <NativeSelectOption value="">Tümü</NativeSelectOption>
          {Object.values(AUDIT_EVENT).map((event) => (
            <NativeSelectOption key={event} value={event}>
              {auditEventLabel(event)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <FieldError>{fieldErrors.event}</FieldError>
      </Field>
      <Field data-invalid={!!fieldErrors.outcome}>
        <FieldLabel htmlFor="outcome">Sonuç</FieldLabel>
        <NativeSelect
          id="outcome"
          name="outcome"
          defaultValue={input.outcome ?? ''}
          className="w-full"
          aria-invalid={!!fieldErrors.outcome}
        >
          <NativeSelectOption value="">Tümü</NativeSelectOption>
          {Object.values(AUDIT_OUTCOME).map((outcome) => (
            <NativeSelectOption key={outcome} value={outcome}>
              {auditOutcomeLabel(outcome)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <FieldError>{fieldErrors.outcome}</FieldError>
      </Field>
      {INPUT_FILTERS.map(({ name, label, type }) => (
        <Field key={name} data-invalid={!!fieldErrors[name]}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            id={name}
            name={name}
            type={type}
            defaultValue={input[name]}
            aria-invalid={!!fieldErrors[name]}
          />
          <FieldError>{fieldErrors[name]}</FieldError>
        </Field>
      ))}
      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
        <Button type="submit">Filtrele</Button>
        <Link
          href={ROUTE.ADMIN_AUDIT_LOGS}
          className={buttonVariants({ variant: 'ghost' })}
        >
          Temizle
        </Link>
      </div>
    </Form>
  );
}
