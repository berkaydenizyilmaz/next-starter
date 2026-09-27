export const ROUTE = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ACCOUNT: '/account',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
  SECURITY_LOG: '/account/security-log',
  SESSIONS: '/account/sessions',
  CHANGE_PASSWORD: '/account/password',
} as const;

export const REDIRECT_PARAM = 'next';

export const PUBLIC_ROUTES: ReadonlySet<string> = new Set([
  ROUTE.LOGIN,
  ROUTE.REGISTER,
  ROUTE.FORGOT_PASSWORD,
  ROUTE.RESET_PASSWORD,
]);
