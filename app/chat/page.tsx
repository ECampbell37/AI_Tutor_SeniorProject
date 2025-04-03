import { Suspense } from 'react';
import ChatClient from './ChatClient';

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
      }
    >
      <ChatClient />
    </Suspense>
  );
}