
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createPixel, getAdvertisers, trackEvent } from "@/app/actions";
import { Anchor } from "lucide-react";

import { AuthCard } from "@/components/alink-pro/auth-card";
import { PixelCard } from "@/components/alink-pro/pixel-card";
import { TestEventCard } from "@/components/alink-pro/test-event-card";
import { HotmartCard } from "@/components/alink-pro/hotmart-card";
import { CompletionCard } from "@/components/alink-pro/completion-card";

export type Advertiser = {
  advertiser_id: string;
  advertiser_name: string;
};

const formSchema = z.object({
  advertiserId: z.string().min(1, "Por favor, selecione uma conta de anunciante."),
  pixelName: z.string().min(1, "O nome do pixel é obrigatório."),
  externalId: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

interface AlinkProClientProps {
  emailFromConfig?: string;
  phoneFromConfig?: string;
}

export default function AlinkProClient({ emailFromConfig, phoneFromConfig }: AlinkProClientProps) {
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
      pixelName: "",
      externalId: "",
      email: emailFromConfig || "",
      phone: phoneFromConfig || "",
    },
  });

  const generateUUID = () => {
    return crypto.randomUUID();
  }

  const generatePixelName = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'PX-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  useEffect(() => {
    form.setValue("externalId", generateUUID());
    form.setValue("pixelName", generatePixelName());
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
          title: "Erro de Autorização",
          description: err.message || "Não foi possível obter o token de acesso.",
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
            title: "Nenhuma Conta de Anunciante Encontrada",
            description: "Não encontramos nenhuma conta de anunciante vinculada ao seu perfil do TikTok.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erro ao buscar anunciantes",
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
      toast({ title: "E-mail Necessário", description: "Por favor, insira o e-mail do seu pedido ou código de acesso.", variant: "destructive" });
      return;
    }
    setIsCheckingEmail(true);
    const result = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVerify }),
    });
    setIsCheckingEmail(false);
    const data = await result.json();

    if (data.success) {
      setIsEmailVerified(true);
      toast({ title: "E-mail Verificado!", description: "Você já pode fazer login com o TikTok.", className: "bg-green-600 text-white" });
    } else {
      toast({ title: "Falha na Verificação", description: data.error, variant: "destructive" });
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
      setStep(3);
    } else {
      toast({
        title: "Erro ao Criar o Pixel",
        description: result.error || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }

  const copyToClipboard = (textToCopy: string | null) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      toast({ title: "Copiado!", description: "Copiado para a área de transferência.", className: "bg-green-600 text-white" });
    }
  };

  async function handleSendEvent() {
    if (!accessToken || !pixelCode) return;
    
    const formValues = form.getValues();

    setIsSendingEvent(true);

    const result = await trackEvent({
      accessToken,
      pixelCode,
      externalId: formValues.externalId || "",
      email: formValues.email || "",
      phone: formValues.phone || "",
      productName: "Produto de Teste",
      productDescription: "Este record é para teste do pixel.",
      productPrice: 0.01,
      currency: "BRL",
    });

    setIsSendingEvent(false);

    if (result.success) {
      toast({ title: "Evento de Teste Enviado!", description: "O evento 'Purchase' foi enviado com sucesso.", className: "bg-green-600 text-white" });
      setEventSent(true);
      setStep(4);
    } else {
      toast({ title: "Erro ao Enviar Evento", description: result.error || "Ocorreu um erro desconhecido.", variant: "destructive" });
    }
  }
  
  const selectedAdvertiserId = form.watch("advertiserId");
  const pixelName = form.watch("pixelName");

  const tiktokEventPanelUrl = `https://ads.tiktok.com/i18n/events_manager/datasource/pixel/detail/${pixelCode}?org_id=${selectedAdvertiserId}&open_from=bc_asset_pixel`;
  
  return (
    <div className="flex-grow bg-background text-foreground flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-full mb-4 shadow-lg shadow-primary/30">
            <Anchor className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <h1 className="font-headline text-3xl sm:text-5xl font-bold text-card-foreground">
            Âncora Link <span className="text-accent">PRO</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-sm mx-auto">
            Insira Links em seus Vídeos do TikTok <br />
            Converta visualizações em Vendas
          </p>
        </header>

        <div className="space-y-6">
          <AuthCard
            step={step}
            isEmailVerified={isEmailVerified}
            emailVerify={emailVerify}
            setEmailVerify={setEmailVerify}
            isCheckingEmail={isCheckingEmail}
            handleVerifyEmail={handleVerifyEmail}
            authUrl={authUrl}
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
                <PixelCard
                  form={form}
                  step={step}
                  isLoading={isLoading}
                  isFetchingAdvertisers={isFetchingAdvertisers}
                  advertisers={advertisers}
                  pixelName={pixelName}
                  pixelId={pixelId}
                  pixelCode={pixelCode}
                />
              
              
              {/* {step === 2 && (
                 <ProductDetailsCard form={form} />
              )} */}
              
              
                <TestEventCard
                  step={step}
                  isSendingEvent={isSendingEvent}
                  eventSent={eventSent}
                  handleSendEvent={handleSendEvent}
                />
              
            </form>
          </Form>

          
            <HotmartCard
              step={step}
              setStep={setStep}
              pixelCode={pixelCode}
              copyToClipboard={copyToClipboard}
            />
          
        
          
            <CompletionCard
              step={step}
              tiktokEventPanelUrl={tiktokEventPanelUrl}
            />
          
        </div>
      </div>
    </div>
  );
}

    