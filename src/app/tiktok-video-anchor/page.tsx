
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PixelStep } from "@/components/tiktok-pixel/pixel-step";
import { EventStep } from "@/components/tiktok-pixel/event-step";
import { BotMessageSquare, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function TikTokVideoAnchorPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [pixelId, setPixelId] = useState<string | null>(null);
  const [pixelCode, setPixelCode] = useState<string | null>(null);
  const [advertiserId, setAdvertiserId] = useState<string | null>(null);
  const [eventSent, setEventSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("tiktok_access_token");
    if (storedToken) {
      try {
        const { token, expiresAt } = JSON.parse(storedToken);
        if (new Date().getTime() < expiresAt) {
          setAccessToken(token);
        } else {
          localStorage.removeItem("tiktok_access_token");
          router.replace("/");
        }
      } catch (e) {
        localStorage.removeItem("tiktok_access_token");
        router.replace("/");
      }
    } else {
      router.replace("/");
    }
    setIsLoading(false);
  }, [router]);

  const handleReset = () => {
    localStorage.removeItem("tiktok_access_token");
    setAccessToken(null);
    setPixelId(null);
    setPixelCode(null);
    setAdvertiserId(null);
    setEventSent(false);
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-lg space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-body">
      <div className="w-full max-w-lg mx-auto flex-grow flex flex-col justify-center">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-full mb-4 shadow-lg shadow-primary/30">
            <BotMessageSquare className="h-10 w-10" />
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-card-foreground">
            TikTok Video Anchor
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-sm mx-auto">
            Create your pixel, test events, and integrate with GTM without an
            e-commerce platform.
          </p>
        </header>

        <main className="space-y-6">
          {accessToken && (
            <PixelStep
              accessToken={accessToken}
              onPixelCreated={(newPixelId, newAdvertiserId, newPixelCode) => {
                setPixelId(newPixelId);
                setAdvertiserId(newAdvertiserId);
                setPixelCode(newPixelCode);
              }}
              pixelId={pixelId}
              pixelCode={pixelCode}
            />
          )}
          {accessToken && pixelId && advertiserId && pixelCode && (
            <EventStep
              accessToken={accessToken}
              pixelCode={pixelCode}
              onEventSent={() => setEventSent(true)}
              eventSent={eventSent}
            />
          )}

          {eventSent && (
            <div className="text-center p-8 bg-card rounded-xl shadow-lg border-2 border-dashed border-green-500 flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold font-headline text-card-foreground">
                Process Complete!
              </h2>
              <p className="text-muted-foreground">
                The pixel was created and a test event was sent successfully.
              </p>
              <Button
                onClick={handleReset}
                className="mt-4 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors shadow-md"
              >
                <RefreshCw className="mr-2" />
                Start Over
              </Button>
            </div>
          )}
        </main>
      </div>

      <footer className="w-full text-center p-4 mt-auto space-y-2 shrink-0">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://b2bear.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            B2Bear Marketing
          </a>
        </p>
      </footer>
    </div>
  );
}
