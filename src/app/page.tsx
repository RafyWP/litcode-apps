
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
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
      <div className="text-center">
        <p className="text-muted-foreground">
          You must be logged in to access the applications.
        </p>
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
