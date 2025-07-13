"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getAccessToken } from "@/app/actions";
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
  LogIn,
  Loader2,
  Code,
  CheckCircle2,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";

const formSchema = z.object({
  authCode: z.string().min(1, "Authorization Code is required"),
});

type TokenStepProps = {
  onTokenReceived: (token: string) => void;
};

export function TokenStep({ onTokenReceived }: TokenStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState("");

  useEffect(() => {
    const generateAuthUrl = () => {
      const baseUrl = "https://business-api.tiktok.com/portal/auth";
      const appId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID;
      const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;
      const scope = process.env.NEXT_PUBLIC_TIKTOK_SCOPE;
      const state = crypto.randomUUID();

      if (!appId || !redirectUri || !scope) {
        console.error("Missing TikTok environment variables");
        toast({
          title: "Configuration Error",
          description: "TikTok app credentials are not configured.",
          variant: "destructive",
        });
        return;
      }

      const params = new URLSearchParams({
        app_id: appId,
        state: state,
        redirect_uri: redirectUri,
        scope: scope,
      });
      setAuthUrl(`${baseUrl}?${params.toString()}`);
    };
    generateAuthUrl();
  }, [toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const result = await getAccessToken({
      authCode: values.authCode,
    });

    setIsLoading(false);

    if (result.success && result.data.access_token) {
      const accessToken = result.data.access_token;
      setToken(accessToken);
      onTokenReceived(accessToken);
      toast({
        title: "Success!",
        description: "Access token retrieved successfully.",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to get access token.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Code className="text-accent" />
          Step 1: Get Access Token
        </CardTitle>
        <CardDescription>
          First, click the button below to grant permissions. Then, paste
          the authorization code from the redirect URL to get your access token.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {authUrl ? (
          <Button asChild>
            <a href={authUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2" />
              Authorize with TikTok
            </a>
          </Button>
        ) : (
          <Button disabled>
            <ExternalLink className="mr-2" />
            Generating Authorization URL...
          </Button>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="authCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paste Authorization Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Paste your code here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {token && (
              <div className="flex items-center gap-3 rounded-md border border-green-500 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <div>
                  <p className="font-bold">Access Token Received!</p>
                  <p className="font-code text-xs opacity-80 break-all">
                    {token.substring(0, 30)}...
                  </p>
                </div>
              </div>
            )}
             <CardFooter className="p-0 pt-4">
              <Button type="submit" disabled={isLoading || !!token}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <LogIn className="mr-2" />
                Get Access Token
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
