// app/freeChat/page.tsx

import { Suspense } from 'react';
import FreeChatClient from './FreeChatClient';

export default function FreeChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
        </div>
      }
    >
      <FreeChatClient />
    </Suspense>
  );
}
