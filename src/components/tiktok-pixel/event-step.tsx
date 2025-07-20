
"use client";

import { useState } from "react";
import { trackEvent } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

type EventStepProps = {
  accessToken: string;
  pixelCode: string;
  onEventSent: () => void;
  eventSent: boolean;
};

export function EventStep({
  accessToken,
  pixelCode,
  onEventSent,
  eventSent,
}: EventStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendEvent() {
    setIsLoading(true);
    const result = await trackEvent({
      accessToken,
      pixelCode,
    });

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Test Event Sent!",
        description: "The 'Purchase' event was sent successfully.",
        className: "bg-green-600 text-white",
      });
      onEventSent();
    } else {
      toast({
        title: "Error Sending Event",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  if (eventSent) {
    return (
      <Card className="bg-card border-t-4 border-green-500 shadow-lg shadow-green-500/20">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <div>
            <CardTitle className="font-headline text-card-foreground">
              Step 3: Test Event Sent
            </CardTitle>
            <CardDescription>
              The test event was successfully sent to your pixel.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-t-4 border-green-500 shadow-lg shadow-green-500/20">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-card-foreground">
          Step 3: Send Test Event
        </CardTitle>
        <CardDescription>
          Click the button below to send a test 'Purchase' event to
          verify that your pixel is receiving data correctly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground p-4 bg-secondary/50 rounded-md text-center">
          This action will send an event with the minimum required data for
          validation.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSendEvent}
          className="w-full bg-green-600 hover:bg-green-600/90 text-white font-bold"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Send className="mr-2" />
          Send Test Event
        </Button>
      </CardFooter>
    </Card>
  );
}
