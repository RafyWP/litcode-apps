"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  KeyRound,
  Link as LinkIcon,
  ClipboardCopy,
  Check,
} from "lucide-react";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  appId: z.string().min(1, "App ID is required"),
  secret: z.string().min(1, "Secret is required"),
  redirectUri: z.string().url("Please enter a valid URL"),
  state: z.string().min(1, "State is required"),
});

export type OAuthData = {
  appId: string;
  secret: string;
  authUrl: string;
};

type OAuthStepProps = {
  onConfigured: (data: OAuthData) => void;
};

export function OAuthStep({ onConfigured }: OAuthStepProps) {
  const { toast } = useToast();
  const [authUrl, setAuthUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appId: "",
      secret: "",
      redirectUri: "https://www.tiktok.com",
      state: "",
    },
  });

  useEffect(() => {
    // Generate state only on the client-side to prevent hydration mismatch
    if (typeof window !== "undefined") {
      form.setValue("state", crypto.randomUUID());
    }
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const baseUrl = "https://business-api.tiktok.com/portal/auth";

    const params = new URLSearchParams({
      app_id: values.appId,
      state: values.state,
      redirect_uri: values.redirectUri,
    });
    const url = `${baseUrl}?${params.toString()}`;
    setAuthUrl(url);
    onConfigured({
      appId: values.appId,
      secret: values.secret,
      authUrl: url,
    });
    toast({
      title: "Authorization URL Generated",
      description: `Proceed to the URL to authorize the application.`,
    });
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(authUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <KeyRound className="text-accent" />
          Step 1: Configure OAuth
        </CardTitle>
        <CardDescription>
          Enter your TikTok App details to generate the authorization URL.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="appId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Your App ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your App Secret"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="redirectUri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Redirect URI</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://your-redirect-uri.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State (auto-generated)</FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            {authUrl && (
              <div className="space-y-2">
                <Label>Generated Authorization URL</Label>
                <div className="flex gap-2">
                  <Input readOnly value={authUrl} className="font-code" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <ClipboardCopy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <LinkIcon className="mr-2" />
              Generate Authorization URL
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
