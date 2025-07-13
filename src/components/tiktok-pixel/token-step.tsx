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

  const handleGetAccessToken = useCallback(async (authCode: string) => {
    setIsLoading(true);
    setError(null);
    const result = await getAccessToken({ authCode });
    setIsLoading(false);

    if (result.success && result.data.access_token) {
      const token = result.data.access_token;
      onTokenReceived(token);
      toast({
        title: "Success!",
        description: "Access token retrieved successfully.",
      });
      // Clean the URL
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      setError(result.error || "Failed to get access token.");
      toast({
        title: "Error",
        description: result.error || "Failed to get access token.",
        variant: "destructive",
      });
    }
  }, [onTokenReceived, toast]);

  useEffect(() => {
    const generateAuthUrl = () => {
      const baseUrl = "https://business-api.tiktok.com/portal/auth";
      const appId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID;
      const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;
      const scope = process.env.NEXT_PUBLIC_TIKTOK_SCOPE;
      const state = crypto.randomUUID();

      if (!appId || !redirectUri || !scope) {
        const errorMsg = "TikTok app credentials are not configured.";
        console.error(errorMsg);
        setError(errorMsg)
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

    generateAuthUrl();

    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("auth_code");

    if (authCode && !accessToken) {
      handleGetAccessToken(authCode);
    }
  }, [handleGetAccessToken, accessToken]);

  const hasToken = !!accessToken;

  return (
    <div className="flex flex-col items-center space-y-4">
        <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
          <span className="flex items-center justify-center text-sm w-8 h-8 rounded-full bg-primary text-primary-foreground">1</span>
          Authorize Application
        </h2>
      <div className="space-y-4 text-center">
        {!hasToken && (
           <Button asChild disabled={!authUrl || isLoading}>
            <a href={authUrl} rel="noopener noreferrer">
              {isLoading ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <ExternalLink className="mr-2" />
              )}
              {isLoading ? "Retrieving Token..." : "Authorize with TikTok"}
            </a>
          </Button>
        )}
       
        {hasToken && (
          <div className="flex items-center gap-3 rounded-md border border-green-500 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <p className="font-bold">Authorization Successful!</p>
              <p>Access token has been received.</p>
            </div>
          </div>
        )}

        {error && !isLoading && (
           <div className="flex items-center gap-2 text-sm text-destructive dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
