
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Sofia_Sans } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { get } from '@vercel/edge-config';
import React from 'react';

const sofiaSans = Sofia_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sofia-sans',
});

export const metadata: Metadata = {
  title: 'How to Sell on TikTok, LitCode Store',
  description: 'Our suite of tools is designed to help you maximize your reach, engagement, and conversions on TikTok, effortlessly.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let youtubeVideoUrl: string | undefined;
  const defaultYoutubeUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

  try {
    // This will work in Vercel environment
    youtubeVideoUrl = await get<string>('youtubeVideoUrl');
  } catch (error) {
    // This will catch the error in local development
    console.log("Could not fetch from Edge Config, using default. Error: ", (error as Error).message);
    // The default value will be used below
  }

  // We need to clone the children to pass the new prop down.
  const childrenWithProps = React.cloneElement(children as React.ReactElement, {
    youtubeVideoUrl: youtubeVideoUrl || defaultYoutubeUrl,
  });

  return (
    <html lang="en" className={`${sofiaSans.variable} dark`} suppressHydrationWarning>
      <head>
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <div className="flex-grow">
            {childrenWithProps}
          </div>
          <Footer />
        </AuthProvider>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
