export const ROUTE = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export const PUBLIC_ROUTES: ReadonlySet<string> = new Set([
  ROUTE.LOGIN,
  ROUTE.REGISTER,
]);
