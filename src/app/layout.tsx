
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Sofia_Sans } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { get } from '@vercel/edge-config';

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
  // Fetch the YouTube video URL from Edge Config on the server.
  // Use a default value if not found.
  const youtubeVideoUrl = await get<string>('youtubeVideoUrl') || 'https://www.youtube.com/embed/dQw4w9WgXcQ';

  // We need to clone the children to pass the new prop down.
  const childrenWithProps = React.cloneElement(children as React.ReactElement, {
    youtubeVideoUrl: youtubeVideoUrl,
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
