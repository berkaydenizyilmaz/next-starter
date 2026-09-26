'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { securityLogQuery } from '@/features/user/user.queries';
import { ApiError } from '@/lib/api.error';
import { AUDIT_OUTCOME } from '@/lib/constants/audit.constants';
import { COMMON_ERROR } from '@/lib/constants/error.constants';
import {
  auditEventLabel,
  auditOutcomeLabel,
} from '@/lib/messages/audit.messages';
import { apiErrorMessage, errorMessage } from '@/lib/messages/error.messages';
import { formatDateTime } from '@/lib/utils/date.util';

export function SecurityLogList(): ReactNode {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(securityLogQuery);
  const entries = data.pages.flatMap((page) => page.data);

  if (entries.length === 0) {
    return <p className="text-muted-foreground">Henüz bir kayıt yok.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="divide-y rounded-lg border">
        {entries.map((entry) => (
          <li key={entry.id} className="flex flex-col gap-1 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">
                {auditEventLabel(entry.event)}
              </span>
              <span
                className={
                  entry.outcome === AUDIT_OUTCOME.FAILURE
                    ? 'text-sm text-destructive'
                    : 'text-sm text-muted-foreground'
                }
              >
                {auditOutcomeLabel(entry.outcome)}
              </span>
            </div>
            <time
              dateTime={entry.createdAt}
              className="text-sm text-muted-foreground"
            >
              {formatDateTime(entry.createdAt)}
            </time>
            {(entry.ip ?? entry.userAgent) && (
              <p
                className="truncate text-xs text-muted-foreground"
                title={entry.userAgent ?? undefined}
              >
                {[entry.ip, entry.userAgent].filter(Boolean).join(' · ')}
              </p>
            )}
          </li>
        ))}
      </ul>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof ApiError
              ? apiErrorMessage(error)
              : errorMessage(COMMON_ERROR.INTERNAL_ERROR)}
          </AlertDescription>
        </Alert>
      )}
      {hasNextPage && (
        <Button
          type="button"
          variant="outline"
          className="self-start"
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        >
          {isFetchingNextPage && <Spinner />}
          Daha fazla yükle
        </Button>
      )}
    </div>
  );
}
