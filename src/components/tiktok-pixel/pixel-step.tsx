"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createPixel, getAdvertisers } from "@/app/actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  WandSparkles,
  Loader2,
  CheckCircle2,
  Copy,
} from "lucide-react";

type Advertiser = {
  advertiser_id: string;
  advertiser_name: string;
};

const formSchema = z.object({
  advertiserId: z.string().min(1, "Please select an Advertiser account."),
  pixelName: z.string().min(1, "Pixel Name is required"),
});

type PixelStepProps = {
  accessToken: string;
  onPixelCreated: () => void;
  onReset: () => void;
  addDebugLog: (title: string, data: any) => void;
};

export function PixelStep({ accessToken, onPixelCreated, onReset, addDebugLog }: PixelStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAdvertisers, setIsFetchingAdvertisers] = useState(true);
  const [pixelId, setPixelId] = useState<string | null>(null);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      advertiserId: "",
      pixelName: "",
    },
  });

  useEffect(() => {
    async function fetchAdvertisers() {
      if (!accessToken) return;
      addDebugLog("Fetching Advertisers...", { tokenUsed: `${accessToken.substring(0,10)}...`});
      setIsFetchingAdvertisers(true);
      const result = await getAdvertisers({ accessToken });
      if (result.success) {
        addDebugLog("Fetch Advertisers Success", result);
        setAdvertisers(result.data || []);
        if (!result.data || result.data.length === 0) {
           toast({
             title: "No Advertiser Accounts Found",
             description: "We couldn't find any advertiser accounts linked to your TikTok profile.",
             variant: "destructive",
           });
        }
      } else {
        addDebugLog("Fetch Advertisers Error", result);
        toast({
          title: "Error fetching advertisers",
          description: result.error,
          variant: "destructive",
        });
      }
      setIsFetchingAdvertisers(false);
    }
    fetchAdvertisers();
  }, [accessToken, toast, addDebugLog]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    addDebugLog("Creating Pixel...", { values });

    const result = await createPixel({
      accessToken: accessToken,
      advertiserId: values.advertiserId,
      pixelName: values.pixelName,
    });

    setIsLoading(false);

    if (result.success && result.data.pixel_id) {
      addDebugLog("Create Pixel Success", result);
      setPixelId(result.data.pixel_id);
    } else {
      addDebugLog("Create Pixel Error", result);
      toast({
        title: "Error Creating Pixel",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  const copyToClipboard = () => {
    if (pixelId) {
      navigator.clipboard.writeText(pixelId);
      toast({
        title: "Copied!",
        description: "Pixel ID copied to clipboard.",
        className: "bg-green-600 text-white"
      });
      addDebugLog("Copied to Clipboard", { pixelId });
    }
  };

  if (pixelId) {
    return (
      <Card className="bg-card border-t-4 border-primary shadow-lg shadow-primary/20">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-card-foreground">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Pixel Created Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Your new Pixel is ready. Copy the ID below.</p>
          <div className="flex items-center gap-2 p-3 rounded-md bg-secondary">
            <span className="font-mono text-sm text-card-foreground truncate">{pixelId}</span>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} className="ml-auto flex-shrink-0">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={onPixelCreated} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Done
            </Button>
             <Button onClick={onReset} variant="outline" className="w-full">
                Create Another
            </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-t-4 border-accent shadow-lg shadow-accent/20">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-card-foreground">
          Step 2: Create Your Pixel
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={isLoading || isFetchingAdvertisers}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="advertiserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advertiser Account</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        {advertisers.length > 0 ? advertisers.map((ad) => (
                          <SelectItem key={ad.advertiser_id} value={ad.advertiser_id}>
                            {ad.advertiser_name} ({ad.advertiser_id})
                          </SelectItem>
                        )) : <SelectItem value="none" disabled>No accounts found.</SelectItem>}
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
                      <Input placeholder="e.g., My Awesome Pixel" {...field} />
                    </FormControl>
                    <FormDescription>
                      A name to help you identify this pixel later.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" disabled={isLoading || isFetchingAdvertisers}>
                {(isLoading || isFetchingAdvertisers) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <WandSparkles className="mr-2" />
                Generate Pixel
              </Button>
            </CardFooter>
          </fieldset>
        </form>
      </Form>
    </Card>
  );
}
