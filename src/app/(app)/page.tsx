import { type ReactNode, Suspense } from 'react';
import { getCurrentUser } from '@/features/auth/auth.data';

export default function Home(): ReactNode {
  return (
    <main className="px-4 py-8">
      <Suspense fallback={null}>
        <Welcome />
      </Suspense>
    </main>
  );
}

async function Welcome(): Promise<ReactNode> {
  const user = await getCurrentUser();

  return <h1 className="text-2xl font-semibold">Hoş geldin, {user.email}</h1>;
}
