// app/layout.tsx
import './globals.css';
import NavBar from './components/NavBar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Tutor',
  description: 'Your personalized AI-powered tutoring experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
