"use client";

import { useState, useEffect } from "react";
import { TokenStep } from "@/components/tiktok-pixel/token-step";
import { PixelStep } from "@/components/tiktok-pixel/pixel-step";
import { BotMessageSquare, CheckCircle } from "lucide-react";
import { DebugInfo, type DebugLog } from "@/components/tiktok-pixel/debug-info";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [pixelCreated, setPixelCreated] = useState(false);
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);

  const addDebugLog = (title: string, data: any) => {
    setDebugLogs(prev => [...prev, { title, data: JSON.stringify(data, null, 2), timestamp: new Date() }]);
  };

  const handleReset = () => {
    localStorage.removeItem("tiktok_token");
    setAccessToken(null);
    setPixelCreated(false);
    setDebugLogs([]);
    addDebugLog("System Reset", "Application state and local storage cleared.");
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("tiktok_token");
    if (storedToken) {
      try {
        const { token, expiresAt } = JSON.parse(storedToken);
        if (new Date().getTime() < expiresAt) {
          setAccessToken(token);
          addDebugLog("Token Loaded from localStorage", { token: `${token.substring(0, 10)}...`, expiresAt: new Date(expiresAt).toLocaleString() });
        } else {
          localStorage.removeItem("tiktok_token");
          addDebugLog("Expired Token Removed", "Token found in localStorage has expired and was removed.");
        }
      } catch (e) {
        localStorage.removeItem("tiktok_token");
        addDebugLog("Invalid Token Format", "Could not parse token from localStorage, it was removed.");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-body">
      <div className="w-full max-w-lg mx-auto flex-grow flex flex-col justify-center">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-full mb-4 shadow-lg shadow-primary/30">
            <BotMessageSquare className="h-10 w-10" />
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-card-foreground">
            TikTok Pixel Generator
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-sm mx-auto">
            Create your TikTok pixel for GTM, <br /> no e-commerce required.
          </p>
        </header>

        <main className="space-y-6">
          {!pixelCreated ? (
            <>
              <TokenStep 
                onTokenReceived={setAccessToken} 
                accessToken={accessToken}
                addDebugLog={addDebugLog}
              />
              {accessToken && (
                <PixelStep
                  accessToken={accessToken}
                  onPixelCreated={() => setPixelCreated(true)}
                  onReset={handleReset}
                  addDebugLog={addDebugLog}
                />
              )}
            </>
          ) : (
            <div className="text-center p-8 bg-card rounded-xl shadow-lg border flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold font-headline text-card-foreground">Pixel Created!</h2>
              <p className="text-muted-foreground">Your new TikTok Pixel is ready to use.</p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors shadow-md"
              >
                Create Another Pixel
              </button>
            </div>
          )}
        </main>
      </div>
      <div className="w-full max-w-lg mx-auto mt-8">
        <DebugInfo logs={debugLogs} />
      </div>
       <footer className="w-full text-center p-4 mt-auto space-y-2">
        <a href="https://app.netlify.com/projects/new-tiktok-pixel/deploys" target="_blank" rel="noopener noreferrer">
          <img src="https://api.netlify.com/api/v1/badges/4bd762fb-404f-4d5e-b4fe-365ac159f28c/deploy-status" alt="Netlify Status" className="mx-auto" />
        </a>
        <p className="text-xs text-muted-foreground">
          © 2025 <a href="https://b2bear.com" target="_blank" rel="noopener noreferrer" className="hover:underline">B2Bear Marketing</a>
        </p>
      </footer>
    </div>
  );
}
