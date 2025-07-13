"use client";

import { useState } from "react";
import { OAuthStep, type OAuthData } from "@/components/tiktok-pixel/oauth-step";
import { TokenStep } from "@/components/tiktok-pixel/token-step";
import { PixelStep } from "@/components/tiktok-pixel/pixel-step";
import { BotMessageSquare } from "lucide-react";

export default function Home() {
  const [oauthData, setOAuthData] = useState<OAuthData | null>(null);
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
            Your one-stop tool to generate TikTok Pixels with ease. Follow the steps below to configure OAuth, get your access token, and create a new pixel.
          </p>
        </header>

        <div className="max-w-3xl mx-auto space-y-8">
          <OAuthStep onConfigured={setOAuthData} />
          <TokenStep
            oauthData={oauthData}
            onTokenReceived={setAccessToken}
            disabled={!oauthData}
          />
          <PixelStep
            accessToken={accessToken}
            disabled={!oauthData || !accessToken}
          />
        </div>
      </div>
    </div>
  );
}
