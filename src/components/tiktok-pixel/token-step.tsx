
"use client";

import { useState, useEffect, useCallback } from "react";
import { getAccessToken } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

type TokenStepProps = {
  onTokenReceived: (token: string) => void;
  accessToken: string | null;
};

export function TokenStep({ onTokenReceived, accessToken }: TokenStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState("");
  const [hasCheckedUrl, setHasCheckedUrl] = useState(false);

  const handleGetAccessToken = useCallback(
    async (authCode: string) => {
      setIsLoading(true);
      setError(null);
      const result = await getAccessToken({ authCode });
      setIsLoading(false);

      if (result.success && result.data.access_token) {
        const token = result.data.access_token;
        onTokenReceived(token);
        toast({
          title: "Authorization Successful!",
          description: "You can now create your pixel.",
        });
        window.history.replaceState(null, "", window.location.pathname);
      } else {
        setError(result.error || "Failed to get access token.");
        toast({
          title: "Authorization Error",
          description: result.error || "Could not retrieve access token.",
          variant: "destructive",
        });
      }
    },
    [onTokenReceived, toast]
  );

  useEffect(() => {
    const generateAuthUrl = () => {
      const baseUrl = "https://business-api.tiktok.com/portal/auth";
      const appId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID;
      const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;
      const scope = "bc.read,cm.manage";
      const state = crypto.randomUUID();

      if (!appId || !redirectUri) {
        const errorMsg = "TikTok app credentials are not configured.";
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }

      const params = new URLSearchParams({
        app_id: appId,
        state: state,
        redirect_uri: redirectUri,
        scope: scope,
      });
      setAuthUrl(`${baseUrl}?${params.toString()}`);
    };

    if (typeof window !== "undefined") {
      generateAuthUrl();
    }
  }, []);

  useEffect(() => {
    // This part should only run on the client after mount
    if (typeof window !== "undefined" && !hasCheckedUrl) {
      const staticAuthCode = process.env.NEXT_PUBLIC_TIKTOK_AUTH_CODE;
      const urlParams = new URLSearchParams(window.location.search);
      const urlAuthCode = urlParams.get("auth_code");

      if (accessToken || isLoading) return;

      if (staticAuthCode) {
        handleGetAccessToken(staticAuthCode);
      } else if (urlAuthCode) {
        handleGetAccessToken(urlAuthCode);
      } else if (urlParams.get("error")) {
        setError("Authorization was cancelled or failed.");
      }
      setHasCheckedUrl(true);
    }
  }, [handleGetAccessToken, accessToken, isLoading, hasCheckedUrl]);
  
  const handleTryAgain = () => {
    setError(null);
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  if (accessToken) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-center">
        <CheckCircle2 className="h-6 w-6 text-green-500" />
        <div>
          <p className="font-bold text-primary-foreground">Authorized</p>
          <p className="text-sm text-muted-foreground">
            Ready to create pixel.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-lg bg-secondary p-4 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <div>
          <p className="font-bold text-primary-foreground">Authorizing...</p>
          <p className="text-sm text-muted-foreground">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg bg-destructive/20 border border-destructive p-4 text-center">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <div>
          <p className="font-bold text-primary-foreground">
            Authorization Failed
          </p>
          <p className="text-sm text-destructive">{error}</p>
        </div>
        <Button
          variant="secondary"
          className="mt-2"
          onClick={handleTryAgain}
          disabled={!authUrl}
        >
          <ExternalLink className="mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center p-6 bg-secondary rounded-xl">
       <div className="mb-4">
        <h2 className="text-xl font-bold text-primary-foreground">Authorize to Start</h2>
        <p className="text-muted-foreground text-sm">You need to connect your TikTok account to proceed.</p>
      </div>
      <Button
        asChild
        size="lg"
        disabled={!authUrl}
        className="w-full font-bold text-lg shadow-lg shadow-primary/30 bg-pink-500 hover:bg-pink-600 text-white"
      >
        <a href={authUrl} rel="noopener noreferrer">
          <ExternalLink className="mr-2" />
          Authorize with TikTok
        </a>
      </Button>
    </div>
  );
}
