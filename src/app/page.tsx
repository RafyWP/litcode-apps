"use client";

import { useState } from "react";
import { TokenStep } from "@/components/tiktok-pixel/token-step";
import { PixelStep } from "@/components/tiktok-pixel/pixel-step";
import { BotMessageSquare, CheckCircle } from "lucide-react";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [pixelCreated, setPixelCreated] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <BotMessageSquare className="h-10 w-10" />
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary-foreground">
            TikTok Pixel Generator
          </h1>
          <p className="text-muted-foreground mt-2 text-md max-w-xs mx-auto">
            Crie seu pixel do TikTok para GTM, sem precisar de um e-commerce.
          </p>
        </header>

        <main className="space-y-6">
          {!pixelCreated ? (
            <>
              <TokenStep onTokenReceived={setAccessToken} accessToken={accessToken} />
              {accessToken && (
                <PixelStep
                  accessToken={accessToken}
                  onPixelCreated={() => setPixelCreated(true)}
                />
              )}
            </>
          ) : (
            <div className="text-center p-8 bg-secondary rounded-lg flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-primary-foreground">Pixel Created!</h2>
              <p className="text-muted-foreground">Your TikTok Pixel is ready to use.</p>
              <button
                onClick={() => {
                  setAccessToken(null);
                  setPixelCreated(false);
                }}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
              >
                Create Another Pixel
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
