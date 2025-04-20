// lib/withAuth.tsx

'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ComponentType } from 'react';

export function withAuth<TProps extends Record<string, unknown>>(Component: ComponentType<TProps>) {
  const AuthWrapper = (props: TProps) => {
    const { status } = useSession();
    const router = useRouter();
    const [checkedAuth, setCheckedAuth] = useState(false);

    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push('/account');
      } else if (status === 'authenticated') {
        setCheckedAuth(true);
      }
    }, [status, router]);

    // Don't render anything until auth is verified
    if (status === 'loading' || (!checkedAuth && status !== 'unauthenticated')) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };

  return AuthWrapper;
}
