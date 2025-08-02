
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getAdvertisers, createPixel, getPixels } from "@/app/actions";
import { Anchor } from "lucide-react";

import { AuthCard } from "@/components/alink-pro/auth-card";
import { PixelCard } from "@/components/alink-pro/pixel-card";
import { HotmartCard } from "@/components/alink-pro/hotmart-card";
import { CompletionCard } from "@/components/alink-pro/completion-card";
import { Advertiser, Pixel } from "@/lib/types";
import { cn } from "@/lib/utils";


const formSchema = z.object({
  advertiserId: z.string().min(1, "Por favor, selecione uma conta de anunciante."),
  pixelSelection: z.string(), // "create_new" or a pixel_code
  pixelName: z.string().optional(),
  pixelCode: z.string().optional(), // The code of the selected or newly created pixel
  pageUrl: z.string().url({ message: "Por favor, insira uma URL válida." }).optional().or(z.literal('')),
  externalId: z.string().optional(),
}).refine(data => {
  if (data.pixelSelection === 'create_new') {
    return !!data.pixelName && data.pixelName.length > 0;
  }
  return true;
}, {
  message: "O nome do pixel é obrigatório.",
  path: ["pixelName"],
});


export default function AlinkProClient() {
  const { accessToken, isLoading: isAuthLoading, login, verifiedEmail } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [isCreatingPixel, setIsCreatingPixel] = useState(false);
  const [isSendingEvent, setIsSendingEvent] = useState(false);
  const [authUrl, setAuthUrl] = useState("");
  const [ttclid, setTtclid] = useState<string | null>(null);

  const [isFetchingAdvertisers, setIsFetchingAdvertisers] = useState(true);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);

  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [isFetchingPixels, setIsFetchingPixels] = useState(false);

  const [emailInput, setEmailInput] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(!!verifiedEmail);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      advertiserId: "",
      pixelSelection: "create_new",
      pixelName: "",
      pixelCode: "",
      pageUrl: "",
      externalId: "",
    },
  });
  
  const { watch, setValue } = form;
  const selectedAdvertiserId = watch("advertiserId");
  const pixelSelection = watch("pixelSelection");

  const generateUUID = () => {
    return crypto.randomUUID();
  }

  useEffect(() => {
    setValue("externalId", generateUUID());
  }, [setValue]);


  useEffect(() => {
    if (accessToken) {
        setStep(2);
    }
    if (verifiedEmail) {
        setIsEmailVerified(true);
    }
  }, [accessToken, verifiedEmail]);


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
    const urlTtclid = urlParams.get("ttclid");

    if (urlTtclid) {
      setTtclid(urlTtclid);
      toast({
        title: "TikTok Click ID Capturado!",
        description: "O ttclid foi encontrado na URL e será usado no evento de teste.",
        className: "bg-green-600 text-white",
      });
    }

    const urlAuthCode = urlParams.get("auth_code");
    if (urlAuthCode && !accessToken && isEmailVerified) {
      const emailToUse = verifiedEmail || emailInput;
      if (emailToUse) {
        login(urlAuthCode, emailToUse).catch((err: Error) => {
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
    }
  }, [login, toast, accessToken, isEmailVerified, verifiedEmail, emailInput]);


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

  useEffect(() => {
    async function fetchPixels() {
      if (!accessToken || !selectedAdvertiserId) return;
      setIsFetchingPixels(true);
      
      const result = await getPixels({ accessToken, advertiserId: selectedAdvertiserId });
      
      if (result.success && result.data) {
        setPixels(result.data);
      } else {
        toast({
          title: "Erro ao buscar pixels",
          description: result.error,
          variant: "destructive",
        });
        setPixels([]);
      }
      setIsFetchingPixels(false);
    }
    if (selectedAdvertiserId) {
      fetchPixels();
    }
  }, [accessToken, selectedAdvertiserId, toast]);

   useEffect(() => {
    if (pixelSelection === 'create_new') {
        setValue('pixelCode', '');
    } else {
        setValue('pixelCode', pixelSelection);
    }
   }, [pixelSelection, setValue]);


  const handleVerifyEmail = async () => {
    if (!emailInput) {
      toast({ title: "E-mail Necessário", description: "Por favor, insira o e-mail do seu pedido ou código de acesso.", variant: "destructive" });
      return;
    }
    setIsCheckingEmail(true);
    const result = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput }),
    });
    setIsCheckingEmail(false);
    const data = await result.json();

    if (data.success) {
      setIsEmailVerified(true);
      toast({ title: "E-mail Verificado!", description: "Você já pode fazer login com o TikTok.", className: "bg-green-600 text-white" });
      const urlParams = new URLSearchParams(window.location.search);
      const urlAuthCode = urlParams.get("auth_code");
      if (urlAuthCode && !accessToken) {
        login(urlAuthCode, emailInput).catch((err: Error) => {
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
    } else {
      toast({ title: "Falha na Verificação", description: data.error, variant: "destructive" });
    }
  };


  async function handleCreatePixel() {
    const { advertiserId, pixelName } = form.getValues();
    if (!accessToken || !advertiserId || !pixelName) {
      toast({ title: "Erro", description: "Conta de anunciante e nome do pixel são obrigatórios.", variant: "destructive" });
      return;
    };
    setIsCreatingPixel(true);

    const result = await createPixel({ accessToken, advertiserId, pixelName });

    setIsCreatingPixel(false);

    if (result.success && result.data.pixel_code) {
      toast({
        title: "Pixel Criado!",
        description: `Pixel '${pixelName}' criado com sucesso.`,
        className: "bg-green-600 text-white",
      });
      const pixelsResult = await getPixels({ accessToken, advertiserId });
      if (pixelsResult.success && pixelsResult.data) {
        setPixels(pixelsResult.data);
        setValue("pixelSelection", result.data.pixel_code);
        setValue("pixelCode", result.data.pixel_code);
      }
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
    const formValues = form.getValues();
    if (!accessToken || !formValues.pixelCode) {
        toast({ title: "Pixel não selecionado", description: "Por favor, selecione ou crie um pixel antes de testar.", variant: "destructive" });
        return;
    };
    
    setIsSendingEvent(true);
    
    try {
      const response = await fetch("/api/track-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            accessToken,
            pixelCode: formValues.pixelCode,
            externalId: formValues.externalId || "",
            email: verifiedEmail || emailInput,
            ttclid: ttclid || "",
            pageUrl: formValues.pageUrl,
            productName: "Produto de Teste",
            productDescription: "Este record é para teste do pixel.",
            productPrice: 0.01,
            currency: "BRL",
        })
      });

      const result = await response.json();

      setIsSendingEvent(false);

      if (result.success) {
        toast({ title: "Evento de Teste Enviado!", description: "O evento 'Purchase' foi enviado com sucesso.", className: "bg-green-600 text-white" });
        setStep(3);
      } else {
        toast({ title: "Erro ao Enviar Evento", description: result.error || "Ocorreu um erro desconhecido.", variant: "destructive" });
      }
    } catch(err) {
        setIsSendingEvent(false);
        toast({ title: "Erro de Rede", description: "Não foi possível conectar ao servidor para enviar o evento.", variant: "destructive" });
    }
  }
  
  const selectedPixelCode = form.watch("pixelCode");
  const tiktokEventPanelUrl = `https://ads.tiktok.com/i18n/events_manager/datasource/pixel/detail/${selectedPixelCode}?org_id=${selectedAdvertiserId}&open_from=bc_asset_pixel`;
  
  return (
    <div className="flex-grow bg-background text-foreground flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
          <svg
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 sm:h-24 sm:w-24"
            >
              <defs>
                <linearGradient id="anchor-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.2)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path
                d="M12 22V8"
                stroke="url(#anchor-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12H2a10 10 0 0 0 20 0h-3"
                stroke="url(#anchor-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                stroke="url(#anchor-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-headline text-3xl sm:text-5xl font-bold text-card-foreground">
            Âncora Link <span className="text-accent">PRO</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-sm mx-auto">
            Insira Links em seus Vídeos do TikTok <br />
            Converta visualizações em Vendas
          </p>
        </header>

        <div className="space-y-4">
          <AuthCard
            isCompleted={step > 1}
            isEmailVerified={isEmailVerified}
            emailVerify={emailInput}
            setEmailVerify={setEmailInput}
            isCheckingEmail={isCheckingEmail}
            handleVerifyEmail={handleVerifyEmail}
            authUrl={authUrl}
            advertisers={advertisers}
            verifiedEmail={verifiedEmail}
          />
          
          {step >= 2 && (
            <Form {...form}>
              <form>
                <PixelCard
                  form={form}
                  isCompleted={step > 2}
                  isCreatingPixel={isCreatingPixel}
                  isSendingEvent={isSendingEvent}
                  isFetchingAdvertisers={isFetchingAdvertisers}
                  advertisers={advertisers}
                  pixels={pixels}
                  isFetchingPixels={isFetchingPixels}
                  onCreatePixel={handleCreatePixel}
                  onSendEvent={handleSendEvent}
                />
              </form>
            </Form>
          )}

          {step >= 3 && (
            <HotmartCard
              isCompleted={step > 3}
              setStep={setStep}
              pixelCode={selectedPixelCode || null}
              copyToClipboard={copyToClipboard}
            />
          )}

          {step >= 4 && (
            <CompletionCard
              tiktokEventPanelUrl={tiktokEventPanelUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}
