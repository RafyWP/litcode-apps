"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createPixel } from "@/app/actions";
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
import { useToast } from "@/hooks/use-toast";
import {
  WandSparkles,
  Loader2,
  CheckCircle2,
  Copy,
} from "lucide-react";

const formSchema = z.object({
  advertiserId: z.string().min(1, "Advertiser ID is required"),
  pixelName: z.string().min(1, "Pixel Name is required"),
});

type PixelStepProps = {
  accessToken: string;
  onPixelCreated: () => void;
};

export function PixelStep({ accessToken, onPixelCreated }: PixelStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pixelId, setPixelId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      advertiserId: "",
      pixelName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const result = await createPixel({
      accessToken: accessToken,
      advertiserId: values.advertiserId,
      pixelName: values.pixelName,
    });

    setIsLoading(false);

    if (result.success && result.data.pixel_id) {
      setPixelId(result.data.pixel_id);
      toast({
        title: "Pixel Created!",
        description: `Your new Pixel ID is ${result.data.pixel_id}.`,
        className: 'bg-green-600 text-white border-green-600'
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create pixel.",
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
      });
    }
  };

  if (pixelId) {
    return (
      <Card className="bg-secondary border-t-4 border-primary shadow-lg shadow-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-foreground">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            Pixel Created Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Your new Pixel is ready. Copy the ID below.</p>
          <div className="flex items-center gap-2 p-3 rounded-md bg-background">
            <span className="font-mono text-sm text-foreground truncate">{pixelId}</span>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} className="ml-auto">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={onPixelCreated} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Done
            </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-secondary border-t-4 border-accent shadow-lg shadow-accent/20">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-primary-foreground">
          Create Your Pixel
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={isLoading}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="advertiserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advertiser ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Advertiser ID" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your TikTok Ads Manager account ID.
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
