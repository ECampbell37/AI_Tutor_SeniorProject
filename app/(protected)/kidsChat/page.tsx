// app/chat/page.tsx

import { Suspense } from 'react';
import KidsChatClient from './KidsChatClient';

export default function KidsChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
      }
    >
      <KidsChatClient />
    </Suspense>
  );
}