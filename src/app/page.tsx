
"use client";

import { useEffect } from "react";
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
  BotMessageSquare,
  LogIn,
  BadgeCheck,
  Server,
  LifeBuoy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { toast } = useToast();
  const { accessToken, isLoading, login } = useAuth();

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
        <h2 className="text-2xl font-bold text-center mb-6 font-headline">Our Applications</h2>
        <Card className="hover:border-primary/80 transition-colors">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg border">
              <BotMessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="font-headline mb-1">TikTok Video Anchor</CardTitle>
              <CardDescription>
                Anchor every item in your videos with clickable links that convert views into sales.
              </CardDescription>
              <div className="mt-4 flex space-x-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  <span>1,200+ Pixels</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5" />
                  <span>98% Uptime</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LifeBuoy className="h-3.5 w-3.5" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You must be logged in to your TikTok Business account to use this application.
            </p>
            <Button className="w-full" disabled>
              <LogIn className="mr-2" />
              Please login via the header to continue
            </Button>
          </CardContent>
        </Card>
      </div>
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
