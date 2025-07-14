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
  KeyRound
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

type TokenStepProps = {
  onTokenReceived: (token: string) => void;
  accessToken: string | null;
  addDebugLog: (title: string, data: any) => void;
};

export function TokenStep({ onTokenReceived, accessToken, addDebugLog }: TokenStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState("");

  const handleGetAccessToken = useCallback(
    async (authCode: string) => {
      setIsLoading(true);
      setError(null);
      addDebugLog("Requesting Access Token...", { authCode });
      const result = await getAccessToken({ authCode });
      setIsLoading(false);

      if (result.success && result.data.access_token) {
        addDebugLog("Access Token Success", result);
        const { access_token, expires_in } = result.data;
        const expiresAt = new Date().getTime() + expires_in * 1000;
        
        try {
            localStorage.setItem("tiktok_token", JSON.stringify({ token: access_token, expiresAt }));
        } catch (e) {
            addDebugLog("localStorage Error", "Failed to save token to localStorage.");
        }

        onTokenReceived(access_token);
        toast({
          title: "Authorization Successful!",
          description: "You can now create your pixel.",
          className: "bg-green-600 text-white"
        });
        window.history.replaceState(null, "", window.location.pathname);
      } else {
        addDebugLog("Access Token Error", result);
        setError(result.error || "Failed to get access token.");
        toast({
          title: "Authorization Error",
          description: result.error || "Could not retrieve access token.",
          variant: "destructive",
        });
      }
    },
    [onTokenReceived, toast, addDebugLog]
  );

  useEffect(() => {
    const generateAuthUrl = () => {
      const baseUrl = "https://business-api.tiktok.com/portal/auth";
      const appId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID;
      const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;
      const state = crypto.randomUUID();

      if (!appId || !redirectUri) {
        const errorMsg = "TikTok app credentials are not configured in environment variables.";
        console.error(errorMsg);
        setError(errorMsg);
        addDebugLog("Configuration Error", { error: errorMsg, env: { NEXT_PUBLIC_TIKTOK_APP_ID: !!appId, NEXT_PUBLIC_TIKTOK_REDIRECT_URI: !!redirectUri } });
        return;
      }

      const params = new URLSearchParams({
        app_id: appId,
        state: state,
        redirect_uri: redirectUri,
        scope: "bc.read,cm.manage"
      });
      setAuthUrl(`${baseUrl}?${params.toString()}`);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const urlAuthCode = urlParams.get("auth_code");

    generateAuthUrl();

    if (urlAuthCode && !accessToken) {
        handleGetAccessToken(urlAuthCode);
    } else if (urlParams.get("error")) {
        const authError = "Authorization was cancelled or failed.";
        setError(authError);
        addDebugLog("Authorization Error from URL", { error: urlParams.get("error"), error_description: urlParams.get("error_description") });
    }

  }, [handleGetAccessToken, accessToken, addDebugLog]);
  
  const handleTryAgain = () => {
    setError(null);
    if (authUrl) {
      addDebugLog("Retrying Authorization...", { authUrl });
      window.location.href = authUrl;
    }
  };

  if (accessToken) {
    return (
      <Card className="bg-card border-t-4 border-green-500 shadow-lg">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <div>
            <CardTitle className="font-headline">Authorized</CardTitle>
            <CardDescription>
              Your application is connected to TikTok.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center gap-3 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div>
              <p className="font-bold font-headline text-card-foreground">Authorizing...</p>
              <p className="text-sm text-muted-foreground">Please wait, verifying with TikTok.</p>
            </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div>
            <CardTitle className="font-headline text-destructive">
              Authorization Failed
            </CardTitle>
            <CardDescription className="text-destructive/80">
                {error}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleTryAgain}
            disabled={!authUrl}
          >
            <ExternalLink className="mr-2" />
            Try Authorization Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-t-4 border-primary shadow-lg shadow-primary/20">
      <CardHeader>
         <CardTitle className="font-headline flex items-center gap-2">
            <KeyRound className="text-primary"/>
            Step 1: Authorize Application
        </CardTitle>
        <CardDescription>
          You need to connect your TikTok account to grant permissions for this app to create pixels on your behalf.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          asChild
          size="lg"
          disabled={!authUrl}
          className="w-full font-bold text-lg shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <a href={authUrl} rel="noopener noreferrer" onClick={() => addDebugLog("Redirecting to TikTok for Auth...", { authUrl })}>
            <ExternalLink className="mr-2" />
            Authorize with TikTok
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
