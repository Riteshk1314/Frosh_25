import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/navigation';
import { AuthProvider } from '@/components/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FROSH 2025 - The Ultimate Freshers Experience',
  description: 'Join FROSH 2025 - The biggest and most exciting freshers event! Free entry for all students with amazing activities and networking opportunities.',
  keywords: 'FROSH, freshers, event, registration, 2025, university, students, networking',
    generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <AuthProvider>
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
