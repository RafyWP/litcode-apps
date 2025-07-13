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
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

  const handleGetAccessToken = useCallback(async (authCode: string) => {
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
        className: 'bg-green-600 text-white border-green-600'
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
  }, [onTokenReceived, toast]);

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

    generateAuthUrl();

    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("auth_code");

    if (authCode && !accessToken && !isLoading) {
      setHasAttemptedAuth(true);
      handleGetAccessToken(authCode);
    } else if (urlParams.get("error")) {
        setError("Authorization was cancelled or failed.");
        setHasAttemptedAuth(true);
    }
  }, [handleGetAccessToken, accessToken, isLoading]);


  if (accessToken) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-lg bg-secondary p-4 text-center">
        <CheckCircle2 className="h-6 w-6 text-green-500" />
        <div>
          <p className="font-bold text-primary-foreground">Authorized</p>
          <p className="text-sm text-muted-foreground">Ready to create pixel.</p>
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
     )
  }
  
  if (error) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-lg bg-destructive/20 border border-destructive p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
                <p className="font-bold text-primary-foreground">Authorization Failed</p>
                <p className="text-sm text-destructive">{error}</p>
            </div>
            <Button asChild variant="secondary" className="mt-2" onClick={() => setError(null)}>
                 <a href={authUrl} rel="noopener noreferrer">
                    <ExternalLink className="mr-2" />
                    Try Again
                </a>
            </Button>
        </div>
    )
  }

  return (
    <div className="text-center">
       <Button asChild size="lg" disabled={!authUrl} className="w-full font-bold text-lg shadow-lg shadow-primary/30">
        <a href={authUrl} rel="noopener noreferrer">
            <ExternalLink className="mr-2" />
            Authorize with TikTok
        </a>
      </Button>
    </div>
  );
}
