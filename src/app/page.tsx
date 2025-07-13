"use client";

import { useState, useEffect } from "react";
import { TokenStep } from "@/components/tiktok-pixel/token-step";
import { PixelStep } from "@/components/tiktok-pixel/pixel-step";
import { BotMessageSquare } from "lucide-react";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-accent/10 text-accent p-3 rounded-lg mb-4">
            <BotMessageSquare className="h-8 w-8" />
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-accent">
            New TikTok Pixel
          </h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl mx-auto">
            Your one-stop tool to generate TikTok Pixels with ease. Follow the steps below to authorize the app and create a new pixel.
          </p>
        </header>

        <div className="max-w-3xl mx-auto space-y-8">
          <TokenStep onTokenReceived={setAccessToken} />
          <PixelStep accessToken={accessToken} disabled={!accessToken} />
        </div>
      </div>
    </div>
  );
}
