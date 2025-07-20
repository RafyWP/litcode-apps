
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { toast } = useToast();
  const { accessToken, isLoading, login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState("");

  useEffect(() => {
    const generateAuthUrl = () => {
      const baseUrl = "https://business-api.tiktok.com/portal/auth";
      const appId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID;
      const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;
      const state = crypto.randomUUID();

      if (!appId || !redirectUri) {
        const errorMsg = "Client-side TikTok credentials are not configured.";
        setError(errorMsg);
        return;
      }

      const params = new URLSearchParams({
        app_id: appId,
        state: state,
        redirect_uri: redirectUri,
        scope: "bc.read,cm.manage",
      });
      setAuthUrl(`${baseUrl}?${params.toString()}`);
    };

    generateAuthUrl();

    const urlParams = new URLSearchParams(window.location.search);
    const urlAuthCode = urlParams.get("auth_code");

    if (urlAuthCode) {
      login(urlAuthCode).catch((err: Error) => {
        setError(err.message || "Failed to get access token.");
        toast({
          title: "Authorization Error",
          description: err.message || "Could not retrieve access token.",
          variant: "destructive",
        });
      });
      // Clean the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("auth_code");
      url.searchParams.delete("error");
      window.history.replaceState(null, "", url.toString());
    } else {
      if (urlParams.get("error")) {
        const authError = "Authorization was cancelled or failed.";
        setError(authError);
      }
    }
  }, [login, toast]);

  const handleTryAgain = () => {
    setError(null);
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center gap-3 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="font-bold font-headline text-card-foreground">
            Checking authorization...
          </p>
        </div>
      );
    }

    if (accessToken) {
      return (
        <Button asChild size="lg" className="w-full max-w-sm">
          <Link href="/tiktok-video-anchor">
            Go to TikTok Video Anchor
            <ArrowRight className="ml-2" />
          </Link>
        </Button>
      );
    }

    if (error) {
      return (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-destructive mb-4">
            <AlertTriangle className="h-6 w-6" />
            <p className="font-bold font-headline">{error}</p>
          </div>
          <Button
            onClick={handleTryAgain}
            disabled={!authUrl}
            variant="destructive"
          >
            <ExternalLink className="mr-2" />
            Try Authorization Again
          </Button>
        </div>
      );
    }

    return (
      <a
        href={authUrl}
        rel="noopener noreferrer"
        className="text-lg text-primary hover:underline font-semibold flex items-center gap-2"
      >
        <ExternalLink />
        Login with TikTok
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 -mt-16">
      <main className="w-full max-w-lg flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
}
