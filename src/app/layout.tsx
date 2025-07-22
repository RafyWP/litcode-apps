
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Sofia_Sans } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { SpeedInsights } from "@vercel/speed-insights/next";

const sofiaSans = Sofia_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sofia-sans',
});

export const metadata: Metadata = {
  title: 'How to Sell on TikTok, LitCode Store',
  description: 'Our suite of tools is designed to help you maximize your reach, engagement, and conversions on TikTok, effortlessly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sofiaSans.variable} dark`} suppressHydrationWarning>
      <head>
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </AuthProvider>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
