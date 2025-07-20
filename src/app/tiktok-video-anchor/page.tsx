
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createPixel, getAdvertisers, trackEvent } from "@/app/actions";
import {
  Anchor,
  CheckCircle,
  Copy,
  Loader2,
  Send,
  WandSparkles,
} from "lucide-react";

type Advertiser = {
  advertiser_id: string;
  advertiser_name: string;
};

const formSchema = z.object({
  advertiserId: z.string().min(1, "Please select an Advertiser account."),
  pixelName: z.string().min(1, "Pixel Name is required"),
});

export default function TikTokVideoAnchorPage() {
  const { accessToken, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [pixelId, setPixelId] = useState<string | null>(null);
  const [pixelCode, setPixelCode] = useState<string | null>(null);
  const [eventSent, setEventSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEvent, setIsSendingEvent] = useState(false);

  const [isFetchingAdvertisers, setIsFetchingAdvertisers] = useState(true);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      advertiserId: "",
      pixelName: "LitCode TikTok",
    },
  });

  useEffect(() => {
    if (!isAuthLoading && !accessToken) {
      router.replace("/");
    }
  }, [isAuthLoading, accessToken, router]);

  useEffect(() => {
    async function fetchAdvertisers() {
      if (!accessToken) return;
      setIsFetchingAdvertisers(true);
      const result = await getAdvertisers({ accessToken });
      if (result.success) {
        setAdvertisers(result.data || []);
        if (!result.data || result.data.length === 0) {
          toast({
            title: "No Advertiser Accounts Found",
            description:
              "We couldn't find any advertiser accounts linked to your TikTok profile.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error fetching advertisers",
          description: result.error,
          variant: "destructive",
        });
      }
      setIsFetchingAdvertisers(false);
    }
    if (accessToken) {
      fetchAdvertisers();
    }
  }, [accessToken, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!accessToken) return;
    setIsLoading(true);

    const result = await createPixel({
      accessToken: accessToken,
      advertiserId: values.advertiserId,
      pixelName: values.pixelName,
    });

    setIsLoading(false);

    if (result.success && result.data.pixel_id && result.data.pixel_code) {
      setPixelId(result.data.pixel_id);
      setPixelCode(result.data.pixel_code);
    } else {
      toast({
        title: "Error Creating Pixel",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  const copyToClipboard = (textToCopy: string | null) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied!",
        description: "Copied to clipboard.",
        className: "bg-green-600 text-white",
      });
    }
  };

  async function handleSendEvent() {
    if (!accessToken || !pixelCode) return;

    setIsSendingEvent(true);
    const result = await trackEvent({
      accessToken,
      pixelCode,
    });

    setIsSendingEvent(false);

    if (result.success) {
      toast({
        title: "Test Event Sent!",
        description: "The 'Purchase' event was sent successfully.",
        className: "bg-green-600 text-white",
      });
      setEventSent(true);
    } else {
      toast({
        title: "Error Sending Event",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  if (isAuthLoading || !accessToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-lg space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background text-foreground flex flex-col items-center justify-center p-4 font-body">
      <div className="w-full max-w-lg mx-auto flex-grow flex flex-col justify-center">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-full mb-4 shadow-lg shadow-primary/30">
            <Anchor className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <h1 className="font-headline text-3xl sm:text-5xl font-bold text-card-foreground">
            TikTok Video Anchor
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-sm mx-auto">
            Anchor every item in your videos with clickable links that convert views into sales.
          </p>
        </header>

        <main className="space-y-6 bg-card border rounded-lg p-4 sm:p-6 shadow-sm">
          {!pixelId && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <fieldset disabled={isLoading || isFetchingAdvertisers}>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="advertiserId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Advertiser Account</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger disabled={isFetchingAdvertisers}>
                                {isFetchingAdvertisers ? (
                                  <span className="flex items-center text-muted-foreground">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading Accounts...
                                  </span>
                                ) : (
                                  <SelectValue placeholder="Select an advertiser account" />
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {advertisers.length > 0 ? (
                                advertisers.map((ad) => (
                                  <SelectItem
                                    key={ad.advertiser_id}
                                    value={ad.advertiser_id}
                                  >
                                    {ad.advertiser_name} ({ad.advertiser_id})
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="none" disabled>
                                  No accounts found.
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the TikTok Ads account for this pixel.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pixelName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pixel Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., My Awesome Pixel"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A name to identify this pixel later.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full font-bold mt-4"
                    disabled={isLoading || isFetchingAdvertisers}
                  >
                    {(isLoading || isFetchingAdvertisers) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <WandSparkles className="mr-2" />
                    Generate Pixel
                  </Button>
                </fieldset>
              </form>
            </Form>
          )}

          {pixelId && pixelCode && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Pixel ID
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={pixelId}
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(pixelId)}
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Pixel Code
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={pixelCode}
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(pixelCode)}
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button
                  onClick={handleSendEvent}
                  className="w-full font-bold"
                  disabled={isSendingEvent || eventSent}
                >
                  {isSendingEvent ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : eventSent ? (
                    <CheckCircle className="mr-2" />
                  ) : (
                    <Send className="mr-2" />
                  )}
                  {eventSent ? "Test Event Sent" : "Send Test Event"}
                </Button>
                {!eventSent && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Click to send a test 'Purchase' event.
                  </p>
                )}
              </div>
            </div>
          )}

          {eventSent && (
            <div className="text-center p-4 bg-secondary rounded-lg flex flex-col items-center gap-2 text-sm">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <p className="font-semibold text-card-foreground">
                Process Complete!
              </p>
              <p className="text-muted-foreground">
                You can now log out via the header.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
