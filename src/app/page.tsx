
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
        <Card>
          <CardContent className="p-6 flex items-center justify-center gap-3 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div>
              <p className="font-bold font-headline text-card-foreground">
                Checking authorization...
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (accessToken) {
      return (
        <Card className="bg-card border-t-4 border-green-500 shadow-lg shadow-green-500/20">
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <CardTitle className="font-headline">Authorized</CardTitle>
              <CardDescription>
                Your application is connected to TikTok.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You have successfully authenticated your account. You can now proceed to the TikTok Video Anchor tool.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full">
              <Link href="/tiktok-video-anchor">
                Go to TikTok Video Anchor
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardFooter>
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
            <KeyRound className="text-primary" />
            Authorize Application
          </CardTitle>
          <CardDescription>
            Connect your TikTok account to grant permissions for this app to
            create pixels on your behalf.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            asChild
            size="lg"
            disabled={!authUrl}
            className="w-full font-bold text-lg shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <a href={authUrl} rel="noopener noreferrer">
              <ExternalLink className="mr-2" />
              Authorize with TikTok
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <header className="text-center mb-10">
        <h1 className="font-headline text-6xl font-bold text-card-foreground mb-4">
          LitCode Store
        </h1>
        <p className="text-muted-foreground text-xl mb-8">
          Your one-stop shop for powerful application tools.
        </p>
      </header>
      <main className="w-full max-w-lg">{renderContent()}</main>
    </div>
  );
}
