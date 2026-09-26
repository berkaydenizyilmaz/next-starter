import { AUDIT_EVENT, AUDIT_OUTCOME } from '@/lib/constants/audit.constants';

type AuditLabels = Readonly<Partial<Record<string, string>>>;

const AUDIT_EVENT_LABELS: AuditLabels = {
  [AUDIT_EVENT.AUTHN_LOGIN]: 'Giriş',
  [AUDIT_EVENT.AUTHN_LOGOUT]: 'Çıkış',
  [AUDIT_EVENT.AUTHN_LOGIN_LOCK]: 'Hesap geçici olarak kilitlendi',
  [AUDIT_EVENT.AUTHN_PASSWORD_CHANGE]: 'Şifre değişikliği',
  [AUDIT_EVENT.AUTHN_PASSWORD_RESET_REQUEST]: 'Şifre sıfırlama isteği',
  [AUDIT_EVENT.AUTHN_PASSWORD_RESET]: 'Şifre sıfırlama',
  [AUDIT_EVENT.AUTHZ_FAIL]: 'Yetkisiz erişim denemesi',
  [AUDIT_EVENT.SESSION_REVOKED]: 'Oturum kapatıldı',
  [AUDIT_EVENT.SESSION_TOKEN_REUSE]: 'Şüpheli oturum kullanımı',
  [AUDIT_EVENT.USER_CREATED]: 'Hesap oluşturuldu',
  [AUDIT_EVENT.USER_REACTIVATED]: 'Hesap yeniden etkinleştirildi',
  [AUDIT_EVENT.USER_DELETED]: 'Hesap silindi',
  [AUDIT_EVENT.USER_ANONYMIZED]: 'Hesap anonimleştirildi',
};

const AUDIT_OUTCOME_LABELS: AuditLabels = {
  [AUDIT_OUTCOME.SUCCESS]: 'Başarılı',
  [AUDIT_OUTCOME.FAILURE]: 'Başarısız',
};

export function auditEventLabel(event: string): string {
  return AUDIT_EVENT_LABELS[event] ?? event;
}

export function auditOutcomeLabel(outcome: string): string {
  return AUDIT_OUTCOME_LABELS[outcome] ?? outcome;
}
