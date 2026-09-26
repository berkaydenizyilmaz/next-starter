export const AUDIT_EVENT = {
  AUTHN_LOGIN: 'authn_login',
  AUTHN_LOGOUT: 'authn_logout',
  AUTHN_LOGIN_LOCK: 'authn_login_lock',
  AUTHN_PASSWORD_CHANGE: 'authn_password_change',
  AUTHN_PASSWORD_RESET_REQUEST: 'authn_password_reset_request',
  AUTHN_PASSWORD_RESET: 'authn_password_reset',
  AUTHZ_FAIL: 'authz_fail',
  SESSION_REVOKED: 'session_revoked',
  SESSION_TOKEN_REUSE: 'session_token_reuse',
  USER_CREATED: 'user_created',
  USER_REACTIVATED: 'user_reactivated',
  USER_DELETED: 'user_deleted',
  USER_ANONYMIZED: 'user_anonymized',
} as const;

export const AUDIT_OUTCOME = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
} as const;
