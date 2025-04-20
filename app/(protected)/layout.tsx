// app/(protected)/layout.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/account');
    } else if (status === 'authenticated') {
      setReady(true);
    }
  }, [status, router]);

  if (status === 'loading' || !ready) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
      );
  }

  return <>{children}</>;
}
