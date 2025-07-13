"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";
import {
  LogIn,
  Loader2,
  Code,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import type { OAuthData } from "./oauth-step";

const formSchema = z.object({
  authCode: z.string().min(1, "Authorization Code is required"),
});

type TokenStepProps = {
  oauthData: OAuthData | null;
  onTokenReceived: (token: string) => void;
  disabled: boolean;
};

export function TokenStep({
  oauthData,
  onTokenReceived,
  disabled,
}: TokenStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!oauthData) return;
    setIsLoading(true);

    const result = await getAccessToken({
      clientKey: oauthData.clientKey,
      clientSecret: oauthData.clientSecret,
      redirectUri: oauthData.redirectUri,
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
    <Card className={cn(disabled && "bg-muted/50")}>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Code className="text-accent" />
          Step 2: Get Access Token
        </CardTitle>
        <CardDescription>
          Paste the authorization code from the redirect URL to get your access
          token.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={disabled || isLoading}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="authCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authorization Code</FormLabel>
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
               {!disabled && !oauthData && (
                <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                  <AlertTriangle className="h-4 w-4" />
                  <p>Complete Step 1 to enable this section.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={disabled || isLoading || !!token}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <LogIn className="mr-2" />
                Get Access Token
              </Button>
            </CardFooter>
          </fieldset>
        </form>
      </Form>
    </Card>
  );
}
