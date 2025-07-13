"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createPixel } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
} from "lucide-react";

const formSchema = z.object({
  advertiserId: z.string().min(1, "Advertiser ID is required"),
  pixelName: z.string().min(1, "Pixel Name is required"),
});

type PixelStepProps = {
  accessToken: string | null;
};

export function PixelStep({ accessToken }: PixelStepProps) {
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
    if (!accessToken) return;
    setIsLoading(true);

    const result = await createPixel({
      accessToken: accessToken,
      advertiserId: values.advertiserId,
      pixelName: values.pixelName,
    });

    setIsLoading(false);

    if (result.success) {
      setPixelId(result.data.pixel_id);
      toast({
        title: "Pixel Created!",
        description: `Your new Pixel ID is ${result.data.pixel_id}.`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create pixel.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          Create Pixel
        </CardTitle>
        <CardDescription>
          Finally, provide your Advertiser ID and a name for your new pixel.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={isLoading}>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="advertiserId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advertiser ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Advertiser ID" {...field} />
                      </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {pixelId && (
                <div className="flex items-center gap-3 rounded-md border border-green-500 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <div>
                    <p className="font-bold">Pixel Created Successfully!</p>
                    <p className="font-code text-xs opacity-80 break-all">
                      Pixel ID: {pixelId}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || !!pixelId}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <WandSparkles className="mr-2" />
                Create Pixel
              </Button>
            </CardFooter>
          </fieldset>
        </form>
      </Form>
    </Card>
  );
}
