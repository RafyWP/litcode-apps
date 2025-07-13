"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link as LinkIcon, ExternalLink } from "lucide-react";

export function AuthStep() {
  const { toast } = useToast();
  const [authUrl, setAuthUrl] = useState("");

  useEffect(() => {
    const generateAuthUrl = () => {
      const baseUrl = "https://business-api.tiktok.com/portal/auth";
      const appId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID;
      const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;
      const scope = process.env.NEXT_PUBLIC_TIKTOK_SCOPE;
      const state = crypto.randomUUID();

      if (!appId || !redirectUri || !scope) {
        console.error("Missing TikTok environment variables");
        toast({
          title: "Configuration Error",
          description: "TikTok app credentials are not configured in .env.local",
          variant: "destructive",
        });
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
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <LinkIcon className="text-accent" />
          Step 1: Authorize Application
        </CardTitle>
        <CardDescription>
          Click the button below to authorize the application with TikTok. You
          will be redirected to TikTok to grant permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {authUrl ? (
          <Button asChild>
            <a href={authUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2" />
              Authorize with TikTok
            </a>
          </Button>
        ) : (
          <Button disabled>
            <ExternalLink className="mr-2" />
            Generating Authorization URL...
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
