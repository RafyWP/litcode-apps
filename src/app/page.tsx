
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-headline text-6xl font-bold text-card-foreground mb-4">
          LitCode Store
        </h1>
        <p className="text-muted-foreground text-xl mb-8">
          Your one-stop shop for powerful application tools.
        </p>
        <Button asChild size="lg">
          <Link href="/apps/tiktok-video-anchor">
            Go to TikTok Video Anchor
            <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
