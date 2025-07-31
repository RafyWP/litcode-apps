
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createPixel, getAdvertisers, trackEvent, verifyEmail } from "@/app/actions";
import {
  Anchor,
  CheckCircle,
  Copy,
  DollarSign,
  Info,
  Loader2,
  LockKeyhole,
  LogIn,
  Package,
  ScanLine,
  Send,
  WandSparkles,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Advertiser = {
  advertiser_id: string;
  advertiser_name: string;
};

const formSchema = z.object({
  advertiserId: z.string().min(1, "Por favor, selecione uma conta de anunciante."),
  pixelName: z.string().min(1, "O nome do pixel é obrigatório."),
  externalId: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  productName: z.string().min(1, "O nome do produto é obrigatório."),
  productDescription: z.string().max(255, "A descrição não pode ter mais de 255 caracteres.").optional(),
  productImageUrl: z.string().url("Por favor, insira uma URL válida.").optional().or(z.literal('')),
  productPrice: z.coerce.number().min(0.01, "O preço deve ser maior que zero."),
  currency: z.string().min(2, "A moeda é obrigatória."),
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
      productName: "Produto de Teste",
      productDescription: "",
      productImageUrl: "",
      productPrice: 0.01,
      currency: "BRL",
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
    const result = await verifyEmail({ email: emailVerify });
    setIsCheckingEmail(false);

    if (result.success) {
      setIsEmailVerified(true);
      toast({ title: "E-mail Verificado!", description: "Você já pode fazer login com o TikTok.", className: "bg-green-600 text-white" });
    } else {
      toast({ title: "Falha na Verificação", description: result.error, variant: "destructive" });
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
    
    // Trigger validation manually for all fields
    const validationResult = await form.trigger();
    if (!validationResult) {
        toast({ title: "Erro de Validação", description: "Por favor, preencha todos os campos obrigatórios corretamente.", variant: "destructive" });
        return;
    }
    const formValues = form.getValues();

    setIsSendingEvent(true);

    const result = await trackEvent({
      accessToken,
      pixelCode,
      externalId: formValues.externalId || "",
      email: formValues.email || "",
      phone: formValues.phone || "",
      productName: formValues.productName,
      productDescription: formValues.productDescription,
      productPrice: formValues.productPrice,
      currency: formValues.currency,
    });

    console.log("--- DEBUG: Track Event Client Result ---", result);

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
  const tiktokEventPanelUrl = `https://ads.tiktok.com/i18n/events_manager/datasource/pixel/detail/${pixelCode}?org_id=${selectedAdvertiserId}&open_from=bc_asset_pixel`;
  
  const productImageUrl = form.watch("productImageUrl");
  const isProductImageUrlValid = z.string().url().safeParse(productImageUrl).success;


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
            
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Autorizar Acesso</span>
                  {step > 1 && <CheckCircle className="h-6 w-6 text-green-500" />}
                </CardTitle>
                <CardDescription>Autorize o aplicativo para acessar sua conta do TikTok Ads.</CardDescription>
            </CardHeader>
            <CardContent>
                {!isEmailVerified ? (
                <div className="w-full space-y-2">
                    <Label htmlFor="email-verify">E-mail de Membro</Label>
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
                        <Button variant="outline" onClick={handleVerifyEmail} disabled={isCheckingEmail} aria-label="Verificar E-mail">
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
                    Login com TikTok Business
                </Button>
                )}
            </CardContent>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Gerar Pixel</span>
                      {step > 2 && <CheckCircle className="h-6 w-6 text-green-500" />}
                    </CardTitle>
                    <CardDescription>Selecione sua conta de anúncios para criar um novo pixel.</CardDescription>
                </CardHeader>
                <CardContent>
                      <fieldset disabled={isLoading || isFetchingAdvertisers}>
                          <div className="space-y-4">
                              <FormField
                                  control={form.control}
                                  name="advertiserId"
                                  render={({ field }) => (
                                      <FormItem>
                                      <FormLabel>Conta de Anunciante</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                              <SelectTrigger disabled={isFetchingAdvertisers}>
                                                  {isFetchingAdvertisers ? (
                                                  <span className="flex items-center text-muted-foreground">
                                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                      Carregando Contas...
                                                  </span>
                                                  ) : (
                                                  <SelectValue placeholder="Selecione uma conta de anunciante" />
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
                                              <SelectItem value="none" disabled>Nenhuma conta encontrada</SelectItem>
                                          )}
                                          </SelectContent>
                                      </Select>
                                      <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              {/* Hidden Fields */}
                              <input type="hidden" {...form.register("pixelName")} />
                              <input type="hidden" {...form.register("externalId")} />
                              <input type="hidden" {...form.register("email")} />
                              <input type="hidden" {...form.register("phone")} />
                          </div>
                          <Button type="submit" className="w-full font-bold mt-4" disabled={isLoading || isFetchingAdvertisers}>
                              {(isLoading || isFetchingAdvertisers) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              <WandSparkles className="mr-2" />
                              Gerar Pixel
                          </Button>
                      </fieldset>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Detalhes do Produto</span>
                  </CardTitle>
                  <CardDescription>
                    Preencha as informações do produto para o evento de teste.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {isProductImageUrlValid && (
                    <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg border">
                      <Image
                        src={productImageUrl}
                        alt="Imagem do Produto"
                        width={600}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                   <FormField
                      control={form.control}
                      name="productName"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Nome do Produto</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: E-book de Receitas" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="productDescription"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descreva brevemente seu produto..." {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="productImageUrl"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>URL da Imagem do Produto</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <FormField
                          control={form.control}
                          name="productPrice"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Preço</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="29.90" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Moeda</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="BRL">BRL</SelectItem>
                                      <SelectItem value="USD">USD</SelectItem>
                                      <SelectItem value="EUR">EUR</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Enviar Teste</span>
                        {step > 3 && <CheckCircle className="h-6 w-6 text-green-500" />}
                    </CardTitle>
                    <CardDescription>Envie uma compra teste para validar a instalação do pixel. Nada será cobrado.</CardDescription>
                </CardHeader>
                <CardFooter>
                      <Button onClick={handleSendEvent} type="button" className="w-full font-bold" disabled={isSendingEvent || eventSent}>
                        {isSendingEvent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2" />}
                        Testar Pixel
                    </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Configurar Hotmart</span>
                  {step > 4 && <CheckCircle className="h-6 w-6 text-green-500" />}
                </CardTitle>
                <CardDescription>Siga os passos para usar o código do pixel na Hotmart.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Visite a página de <a href="https://app.hotmart.com/tools/list/producer" target="_blank" rel="noopener noreferrer" className="text-primary underline">Ferramentas do Hotmart</a>;</li>
                    <li>Digite 'pixel' no campo de busca e selecione 'Pixel de rastreamento';</li>
                    <li>No campo 'Selecione o que você deseja rastrear' escolha 'Página de pagamento e de produto Hotmart', em seguida selecione o produto a que deseja associar o pixel gerado aqui;</li>
                    <li>Escolha 'TikTok' entre a lista de integradores;</li>
                    <li>Preencha o campo 'ID do TikTok' com o Código do Pixel abaixo:</li>
                </ol>
                <div className="pt-2 space-y-2">
                    <Label>Código do Pixel</Label>
                    <div className="flex items-center gap-2">
                        <Input readOnly value={pixelCode || ""} className="font-mono text-sm" />
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(pixelCode)}><Copy className="h-4 w-4" /></Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => setStep(5)} className="w-full font-bold">
                    Já preenchi, prosseguir
                </Button>
            </CardFooter>
          </Card>
        
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-500">
            <CardHeader className="text-center items-center gap-2">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <CardTitle>Concluído</CardTitle>
                <CardDescription>
                    O processo de geração e configuração do pixel do TikTok foi concluído.
                    Aguarde até 24 horas para que o evento seja registrado em seu <br />
                    <a href={tiktokEventPanelUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">painel do TikTok Business</a>.
                </CardDescription>
            </CardHeader>
          </Card>

        </div>
      </div>
    </div>
  );
}
