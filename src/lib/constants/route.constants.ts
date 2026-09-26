export const ROUTE = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SECURITY_LOG: '/account/security-log',
} as const;

export const REDIRECT_PARAM = 'next';

export const PUBLIC_ROUTES: ReadonlySet<string> = new Set([
  ROUTE.LOGIN,
  ROUTE.REGISTER,
]);
