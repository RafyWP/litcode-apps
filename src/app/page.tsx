
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
  LogIn,
  PlayCircle,
  ShieldCheck,
  Briefcase,
  ChevronRight,
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
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 pt-16 sm:pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Unlock Your Video's Potential
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-card-foreground">
              Turn TikTok Views into Sales Instantly
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Anchor every item in your videos with clickable links that
              convert. No complex setups, just direct results.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <a href={authUrl}>
                  <LogIn className="mr-2" />
                  Get Started Now
                </a>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required.
            </p>

            <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <span>Satisfaction guaranteed</span>
            </div>
          </div>

          <div className="relative group flex items-center justify-center">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Video Placeholder"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl w-full"
              data-ai-hint="video marketing"
            />
            <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <PlayCircle className="h-20 w-20 text-white/80" />
            </div>
          </div>
        </div>
      </main>

      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <h2 className="text-3xl font-bold text-center">
                Our Applications
              </h2>
              <CardDescription className="text-center">
                Select an application to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href={authUrl} passHref>
                  <div className="flex items-center space-x-4 rounded-md border p-4 transition-all hover:shadow-md cursor-pointer bg-card">
                    <div className="flex-shrink-0">
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg font-bold">TikTok Business</h3>
                      <p className="text-sm text-muted-foreground">
                        Create your TikTok pixel for GTM, no e-commerce
                        required.
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
