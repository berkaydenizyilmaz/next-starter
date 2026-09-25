export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      await import('@/server/env');
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
