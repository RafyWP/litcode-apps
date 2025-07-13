
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  environment: z.enum(["production", "sandbox"]),
  clientKey: z.string().min(1, "Client Key is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  redirectUri: z.string().url("Please enter a valid URL"),
  scope: z.string().min(1, "Scope is required"),
  state: z.string().min(1, "State is required"),
});

export type OAuthData = {
  clientKey: string;
  clientSecret: string;
  redirectUri: string;
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
      environment: "sandbox",
      clientKey: "",
      clientSecret: "",
      redirectUri: "",
      scope: "user.info.basic,pixel.read,pixel.manage",
      state: "",
    },
  });

  useEffect(() => {
    // Moved from useLayoutEffect to useEffect to run on client only after mount
    // to prevent hydration errors.
    if (typeof window !== "undefined") {
      form.setValue("state", crypto.randomUUID());
    }
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const baseUrl =
      values.environment === "sandbox"
        ? "https://www.tiktok.com/v2/sandbox/auth/authorize"
        : "https://www.tiktok.com/v2/auth/authorize";

    const params = new URLSearchParams({
      client_key: values.clientKey,
      scope: values.scope,
      response_type: "code",
      redirect_uri: values.redirectUri,
      state: values.state,
    });
    const url = `${baseUrl}?${params.toString()}`;
    setAuthUrl(url);
    onConfigured({
      clientKey: values.clientKey,
      clientSecret: values.clientSecret,
      redirectUri: values.redirectUri,
      authUrl: url,
    });
    toast({
      title: "Authorization URL Generated",
      description: `Proceed to the URL to authorize the application in ${values.environment} mode.`,
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
            <FormField
              control={form.control}
              name="environment"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Environment</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sandbox" />
                        </FormControl>
                        <FormLabel className="font-normal">Sandbox</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="production" />
                        </FormControl>
                        <FormLabel className="font-normal">Production</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Client Key" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Secret</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your Client Secret"
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
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scope</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
