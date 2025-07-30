import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Anchor, BotMessageSquare, Link as LinkIcon, BellRing, TrendingUp, Users, LogIn } from "lucide-react";
import Link from "next/link";

export default function AppsPage() {
  return (
    <div className="flex-grow bg-background text-foreground flex flex-col items-center justify-center p-4">
        <main className="flex items-center justify-center w-full py-12 px-4">
            <div className="w-full max-w-4xl">
              <div className="text-center mb-10">
                <h1 className="font-headline text-3xl sm:text-5xl font-bold text-card-foreground">
                    Our Applications
                </h1>
                <p className="text-muted-foreground mt-3 text-lg max-w-prose mx-auto">
                    A suite of tools designed to help you maximize your reach, engagement, and conversions on TikTok.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TikTok Video Anchor Card */}
                <Card className="hover:border-primary/80 transition-colors aspect-square flex flex-col p-4">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-lg border shrink-0">
                        <Anchor className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <CardTitle className="font-headline text-base md:text-xl font-bold tracking-tight text-left">
                          Âncora Link PRO
                        </CardTitle>
                        <CardDescription className="md:mt-1 text-left md:overflow-visible md:whitespace-normal">
                          Anchor every item in your videos with clickable links that convert views into sales.
                        </CardDescription>
                        <div className="flex items-start gap-4 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1.5">
                            <BellRing className="h-3.5 w-3.5" />
                            <span>Conversion</span>
                          </div>
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <LinkIcon className="h-3.5 w-3.5" />
                            <span>1,200+ Links Gen.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardFooter className="mt-auto p-0 pt-4">
                      <Button className="w-full" asChild>
                        <Link href="/alink-pro">
                          <LogIn className="mr-2" />
                          Login to Use
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
                
                {/* CopyTok Card */}
                <Card className="hover:border-accent/80 transition-colors aspect-square flex flex-col p-4">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-4">
                      <div className="bg-accent/10 p-2 rounded-lg border shrink-0">
                        <BotMessageSquare className="h-6 w-6 md:h-8 md:w-8 text-accent" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <CardTitle className="font-headline text-base md:text-xl font-bold tracking-tight text-left">
                          CopyTok
                        </CardTitle>
                        <CardDescription className="md:mt-1 text-left md:overflow-visible md:whitespace-normal">
                          TikTok viral captions with psychological triggers that demand engagement.
                        </CardDescription>
                        <div className="flex items-start gap-4 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>Organic Growth</span>
                          </div>
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <Users className="h-3.5 w-3.5" />
                            <span>15k+ Captions Gen.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardFooter className="mt-auto p-0 pt-4">
                      <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild>
                        <Link href="/copytok">
                          Generate TikTok Captions
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </div>
            </div>
        </main>
    </div>
  );
}
