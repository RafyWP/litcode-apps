"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  ArrowRight,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { toast } = useToast();
  const { accessToken, isLoading, login } = useAuth();
  const [authUrl, setAuthUrl] = useState("");

  useEffect(() => {
    const generateAuthUrl = () => {
      const baseUrl = "https://business-api.tiktok.com/portal/auth";
      const appId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID;
      const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;
      const state = crypto.randomUUID();

      if (!appId || !redirectUri) {
        console.error("Client-side TikTok credentials are not configured.");
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
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlAuthCode = urlParams.get("auth_code");

    if (urlAuthCode) {
      login(urlAuthCode).catch((err: Error) => {
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
    }
  }, [login, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center -mt-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-bold font-headline text-card-foreground">
          Checking authorization...
        </p>
      </div>
    );
  }

  if (accessToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 -mt-16">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>You are already logged in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="w-full">
              <Link href="/tiktok-video-anchor">
                Go to TikTok Video Anchor
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 -mt-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Our Applications</h2>
          <CardDescription className="text-center">
            Select an application to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Link href={authUrl} passHref>
              <div className="flex items-center space-x-4 rounded-md border p-4 transition-all hover:shadow-md cursor-pointer">
                <div className="flex-shrink-0">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-bold">TikTok Business</h3>
                  <p className="text-sm text-muted-foreground">
                    Create your TikTok pixel for GTM, no e-commerce required.
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}