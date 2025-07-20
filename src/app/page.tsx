
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  ArrowRight,
  Anchor,
  LogIn,
  Leaf,
  Link as LinkIcon,
  ShieldCheck,
  PlayCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { VideoPopup } from "@/components/video-popup";

export default function HomePage() {
  const { toast } = useToast();
  const { accessToken, isLoading, login } = useAuth();
  const [authUrl, setAuthUrl] = useState("");
  const [isVideoOpen, setIsVideoOpen] = useState(false);

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
        <Card className="hover:border-primary/80 transition-colors aspect-square flex flex-col p-4 md:p-6 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-[0.05]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <style>
                  {`
                    @keyframes click-animation {
                      0%, 25% {
                        transform: translate(25px, 90px);
                        opacity: 1;
                      }
                      35% {
                        transform: translate(90px, 35px);
                        opacity: 1;
                      }
                      40% {
                        transform: translate(90px, 35px);
                        opacity: 1;
                      }
                      45% {
                        transform: translate(90px, 35px);
                        opacity: 1;
                      }
                      50%, 100% {
                        transform: translate(90px, 35px);
                        opacity: 1;
                      }
                    }
                    @keyframes click-effect {
                      0%, 40% {
                        opacity: 0;
                        transform: scale(0.5);
                      }
                      45% {
                        opacity: 1;
                        transform: scale(1);
                      }
                      50%, 100% {
                        opacity: 0;
                        transform: scale(1.2);
                      }
                    }
                    .cursor {
                      animation: click-animation 5s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
                      fill: currentColor;
                    }
                    .click-circle {
                      animation: click-effect 5s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
                      fill: currentColor;
                      transform-origin: center;
                    }
                    .link-icon {
                      stroke: currentColor;
                    }
                  `}
                </style>
              </defs>
              <g className="text-foreground">
                <path className="link-icon" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(80, 25) scale(1.2)"/>
                <path className="link-icon" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(80, 25) scale(1.2)"/>
                
                <circle className="click-circle" cx="98" cy="33" r="10" />

                <path className="cursor" d="M15.33 16.25l-4.1-1.32.79-3.44 3.31 4.76z" />
                <path className="cursor" d="M11.23 14.93l-3.23-3.23 4.54-1.2 2.15 4.59-3.46-.16z"/>
              </g>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg border shrink-0">
                <Anchor className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <CardTitle className="font-headline text-base md:text-xl font-bold tracking-tight text-left">
                  TikTok Video Anchor
                </CardTitle>
                <CardDescription className="md:mt-1 text-left truncate md:overflow-visible md:whitespace-normal">
                  Anchor every item in your videos with clickable links that convert views into sales.
                </CardDescription>
                <div className="hidden md:flex items-start gap-4 text-xs text-muted-foreground mt-2">
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
            </div>
            <CardFooter className="mt-auto p-0 pt-4 md:pt-6">
              <Button className="w-full" asChild>
                <a href={authUrl}>
                  <LogIn className="mr-2" />
                  Login with TikTok Business
                </a>
              </Button>
            </CardFooter>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <>
      <VideoPopup open={isVideoOpen} onOpenChange={setIsVideoOpen} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground -mt-16">
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary">
                Stop struggling and master it now
              </p>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight lg:text-7xl">
                How to Sell on TikTok
              </h1>
              <p className="max-w-prose text-sm text-muted-foreground md:text-lg">
                Our suite of tools is designed to help you maximize your reach,
                engagement, and conversions on TikTok, effortlessly. Start using our applications for free!
              </p>
              <div className="flex items-center justify-center pt-4 -space-x-4">
                {Array.from({ length: 9 }).map((_, index) => (
                  <Image
                    key={index}
                    src={`https://placehold.co/48x48.png`}
                    data-ai-hint="avatar"
                    alt={`User ${index + 1}`}
                    width={48}
                    height={48}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-background"
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

        <section className="container mx-auto px-4 md:px-6 pb-12 md:pb-24">
           <div className="flex items-center justify-center">
            <button
              onClick={() => setIsVideoOpen(true)}
              className="group relative"
              aria-label="Play First Lesson Free Video"
            >
              <svg
                className="w-40 h-40 md:w-48 md:h-48"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <style>
                  {`
                    @keyframes rotate {
                      from {
                        transform: rotate(0deg);
                      }
                      to {
                        transform: rotate(360deg);
                      }
                    }
                    .rotating-text {
                      animation: rotate 20s linear infinite;
                      transform-origin: center;
                    }
                  `}
                </style>
                <defs>
                  <path
                    id="circlePath"
                    d="
                      M 100, 100
                      m -71, 0
                      a 71,71 0 1,1 142,0
                      a 71,71 0 1,1 -142,0
                    "
                    fill="none"
                  />
                </defs>
                
                <g className="rotating-text">
                  <text fill="hsl(var(--muted-foreground))" className="text-[16px] font-semibold uppercase">
                    <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                      First lesson free • First lesson free • First lesson free • 
                    </textPath>
                  </text>
                </g>
                
                <foreignObject x="56.5" y="56.5" width="87" height="87">
                  <PlayCircle className="h-full w-full text-primary group-hover:text-primary/80 transition-colors animate-pulse-icon" />
                </foreignObject>
              </svg>
            </button>
          </div>
        </section>

        <main className="flex items-center justify-center w-full max-w-lg pb-24 px-4">
          {renderContent()}
        </main>
      </div>
    </>
  );
}
