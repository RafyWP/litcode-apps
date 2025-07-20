
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Sofia_Sans } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import Header from '@/components/layout/header';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const sofiaSans = Sofia_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sofia-sans',
});

export const metadata: Metadata = {
  title: 'TikTok Video Anchor',
  description: 'Create your TikTok pixel for GTM, no e-commerce required.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sofiaSans.variable} dark`} suppressHydrationWarning>
      <head>
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
