
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
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
import { createPixel, getAdvertisers, trackEvent, verifyEmail } from "@/app/actions";
import {
  Anchor,
  CheckCircle,
  Copy,
  Loader2,
  LockKeyhole,
  LogIn,
  Send,
  WandSparkles,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Advertiser = {
  advertiser_id: string;
  advertiser_name: string;
};

const formSchema = z.object({
  advertiserId: z.string().min(1, "Please select an Advertiser account."),
  pixelName: z.string().min(1, "Pixel Name is required"),
  externalId: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

interface TikTokVideoAnchorClientProps {
  emailFromConfig?: string;
  phoneFromConfig?: string;
}

export default function TikTokVideoAnchorClient({ emailFromConfig, phoneFromConfig }: TikTokVideoAnchorClientProps) {
  const { accessToken, isLoading: isAuthLoading, login } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [pixelId, setPixelId] = useState<string | null>(null);
  const [pixelCode, setPixelCode] = useState<string | null>(null);
  const [eventSent, setEventSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEvent, setIsSendingEvent] = useState(false);
  const [authUrl, setAuthUrl] = useState("");

  const [isFetchingAdvertisers, setIsFetchingAdvertisers] = useState(true);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);

  const [emailVerify, setEmailVerify] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      advertiserId: "",
      pixelName: "My Pixel 01",
      externalId: "",
      email: emailFromConfig || "",
      phone: phoneFromConfig || "",
    },
  });

  const generateUUID = () => {
    return crypto.randomUUID();
  }

  useEffect(() => {
    form.setValue("externalId", generateUUID());
  }, [form]);

  useEffect(() => {
    if (accessToken) {
        setStep(2);
    }
  }, [accessToken]);


  useEffect(() => {
    const generateAuthUrl = () => {
      const baseUrl = "https://business-api.tiktok.com/portal/auth";
      const appId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID;
      const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;
      const state = crypto.randomUUID();

      if (!appId || !redirectUri) return;

      const params = new URLSearchParams({
        app_id: appId, state, redirect_uri: redirectUri, scope: "bc.read,cm.manage"
      });
      setAuthUrl(`${baseUrl}?${params.toString()}`);
    };

    generateAuthUrl();
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlAuthCode = urlParams.get("auth_code");

    if (urlAuthCode && !accessToken) {
      login(urlAuthCode).catch((err: Error) => {
        toast({
          title: "Authorization Error",
          description: err.message || "Could not retrieve access token.",
          variant: "destructive",
        });
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("auth_code");
      url.searchParams.delete("error");
      window.history.replaceState(null, "", url.toString());
    }
  }, [login, toast, accessToken]);


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
            description: "We couldn't find any advertiser accounts linked to your TikTok profile.",
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

  const handleVerifyEmail = async () => {
    if (!emailVerify) {
      toast({ title: "Email Required", description: "Please enter your order email.", variant: "destructive" });
      return;
    }
    setIsCheckingEmail(true);
    const result = await verifyEmail({ email: emailVerify });
    setIsCheckingEmail(false);

    if (result.success) {
      setIsEmailVerified(true);
      toast({ title: "Email Verified!", description: "You can now log in with TikTok.", className: "bg-green-600 text-white" });
    } else {
      toast({ title: "Verification Failed", description: result.error, variant: "destructive" });
    }
  };

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
      setStep(3); // Move to next step
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
      toast({ title: "Copied!", description: "Copied to clipboard.", className: "bg-green-600 text-white" });
    }
  };

  async function handleSendEvent() {
    if (!accessToken || !pixelCode) return;

    setIsSendingEvent(true);
    const formValues = form.getValues();
    const result = await trackEvent({
      accessToken,
      pixelCode,
      externalId: formValues.externalId || "",
      email: formValues.email || "",
      phone: formValues.phone || "",
    });

    setIsSendingEvent(false);

    if (result.success) {
      toast({ title: "Test Event Sent!", description: "The 'Purchase' event was sent successfully.", className: "bg-green-600 text-white" });
      setEventSent(true);
      setStep(4);
    } else {
      toast({ title: "Error Sending Event", description: result.error || "An unknown error occurred.", variant: "destructive" });
    }
  }
  
  const getStepTitle = (currentStep: number) => {
    switch(currentStep) {
        case 1: return "Step 1: Authorize Access";
        case 2: return "Step 2: Generate Pixel";
        case 3: return "Step 3: Send Test Event";
        case 4: return "Complete";
    }
  }

  if (isAuthLoading) {
    return (
      <div className="flex-grow bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-grow bg-background text-foreground flex flex-col items-center justify-center p-4 font-body">
      <div className="w-full max-w-lg mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-full mb-4 shadow-lg shadow-primary/30">
            <Anchor className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <h1 className="font-headline text-3xl sm:text-5xl font-bold text-card-foreground">
            Âncora Link App
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-sm mx-auto">
            Anchor every item in your videos with clickable links that convert views into sales.
          </p>
        </header>

        <div className="space-y-6">
            
            {/* Step 1: Authorization */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                       <span>{getStepTitle(1)}</span>
                       {step > 1 && <CheckCircle className="h-6 w-6 text-green-500" />}
                    </CardTitle>
                    <CardDescription>Authorize the application to access your TikTok Ads account.</CardDescription>
                </CardHeader>
                <CardContent>
                    {!isEmailVerified ? (
                    <div className="w-full space-y-2">
                        <Label htmlFor="email-verify" className="text-left block text-xs text-muted-foreground">Order Email / E-mail do Pedido</Label>
                        <div className="flex items-center gap-2">
                            <Input
                            id="email-verify"
                            type="text"
                            placeholder="email..."
                            value={emailVerify}
                            onChange={(e) => setEmailVerify(e.target.value)}
                            disabled={isCheckingEmail}
                            onKeyDown={(e) => e.key === 'Enter' && handleVerifyEmail()}
                            />
                            <Button variant="outline" onClick={handleVerifyEmail} disabled={isCheckingEmail} aria-label="Verify Email">
                            {isCheckingEmail ? <Loader2 className="animate-spin" /> : <LockKeyhole />}
                            </Button>
                        </div>
                        </div>
                    ) : (
                    <Button
                        className="w-full animate-in fade-in"
                        onClick={() => { if (authUrl) window.location.href = authUrl; }}
                    >
                        <LogIn className="mr-2" />
                        Login with TikTok Business
                    </Button>
                    )}
                </CardContent>
            </Card>

            {/* Step 2: Generate Pixel */}
            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                       <span>{getStepTitle(2)}</span>
                       {step > 2 && <CheckCircle className="h-6 w-6 text-green-500" />}
                    </CardTitle>
                    <CardDescription>Select your ad account and create a new pixel.</CardDescription>
                </CardHeader>
                <CardContent>
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
                                                {advertisers.length > 0 ? (
                                                    advertisers.map((ad) => (
                                                    <SelectItem key={ad.advertiser_id} value={ad.advertiser_id}>
                                                        {ad.advertiser_name} ({ad.advertiser_id})
                                                    </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="none" disabled>No accounts found</SelectItem>
                                                )}
                                                </SelectContent>
                                            </Select>
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
                                                <FormControl><Input placeholder="e.g., My Awesome Pixel" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                      {/* Hidden Fields */}
                                    <input type="hidden" {...form.register("externalId")} />
                                    <input type="hidden" {...form.register("email")} />
                                    <input type="hidden" {...form.register("phone")} />
                                </div>
                                <Button type="submit" className="w-full font-bold mt-4" disabled={isLoading || isFetchingAdvertisers}>
                                    {(isLoading || isFetchingAdvertisers) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <WandSparkles className="mr-2" />
                                    Generate Pixel
                                </Button>
                            </fieldset>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Step 3: Send Test Event */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{getStepTitle(3)}</span>
                        {step > 3 && <CheckCircle className="h-6 w-6 text-green-500" />}
                    </CardTitle>
                    <CardDescription>Copy your new pixel details and send a test event.</CardDescription>
                </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                        <Label className="text-xs text-muted-foreground">Pixel ID</Label>
                        <div className="flex items-center gap-2">
                            <Input readOnly value={pixelId || ""} className="font-mono text-sm" />
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(pixelId)}><Copy className="h-4 w-4" /></Button>
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Pixel Code</Label>
                        <div className="flex items-center gap-2">
                            <Input readOnly value={pixelCode || ""} className="font-mono text-sm" />
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(pixelCode)}><Copy className="h-4 w-4" /></Button>
                        </div>
                    </div>
                    <Separator />
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        Use o Código do Pixel gerado para configurar o campo 'ID do TikTok' na integração com o Hotmart.
                      </p>
                </CardContent>
                <CardFooter>
                      <Button onClick={handleSendEvent} className="w-full font-bold" disabled={isSendingEvent || eventSent}>
                        {isSendingEvent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2" />}
                        Send Test Event
                    </Button>
                </CardFooter>
            </Card>
            
            {/* Step 4: Complete */}
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-500">
                <CardHeader className="text-center items-center">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <CardTitle>{getStepTitle(4)}</CardTitle>
                    <CardDescription>
                        Please wait a few minutes for the event to be recorded in your TikTok Business/Ads dashboard.
                    </CardDescription>
                </CardHeader>
            </Card>

        </div>
      </div>
    </div>
  );
}
