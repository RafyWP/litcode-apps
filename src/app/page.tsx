
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  ArrowRight,
  Anchor,
  LogIn,
  Briefcase,
  Leaf,
  Link as LinkIcon,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

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

    return (
      <div className="w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6 font-headline">Our Applications</h2>
        <Card className="hover:border-primary/80 transition-colors">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="bg-primary/10 p-4 rounded-lg border">
              <Anchor className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-headline text-xl font-bold mb-2 tracking-tight">TikTok Video Anchor</h3>
              <CardDescription>
                Anchor every item in your videos with clickable links that convert views into sales.
              </CardDescription>
              <div className="mt-4 flex space-x-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>TikTok Business</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Leaf className="h-3.5 w-3.5" />
                  <span>Organic Growth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>1,200+ Links Gen.</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <a href={authUrl}>
                <LogIn className="mr-2" />
                Login with TikTok Business
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground -mt-16">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 text-center md:px-6">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm font-semibold tracking-wider uppercase text-primary">
              Welcome to LitCode Store
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Unlock Your TikTok Potential
            </h1>
            <p className="max-w-prose text-lg text-muted-foreground">
              Our suite of tools is designed to help you maximize your reach,
              engagement, and conversions on TikTok, effortlessly. Start using our applications for free!
            </p>
            <div className="flex items-center justify-center pt-4 -space-x-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Image
                  key={index}
                  src={`https://placehold.co/48x48.png`}
                  data-ai-hint="avatar"
                  alt={`User ${index + 1}`}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full border-2 border-background"
                />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      <main className="flex items-center justify-center w-full max-w-lg pb-24">
        {renderContent()}
      </main>
    </div>
  );
}
