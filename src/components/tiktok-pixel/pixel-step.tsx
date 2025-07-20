
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createPixel, getAdvertisers } from "@/app/actions";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  WandSparkles,
  Loader2,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Label } from "../ui/label";

type Advertiser = {
  advertiser_id: string;
  advertiser_name: string;
};

const formSchema = z.object({
  advertiserId: z.string().min(1, "Please select an Advertiser account."),
  pixelName: z.string().min(1, "Pixel Name is required"),
});

type PixelStepProps = {
  accessToken: string;
  onPixelCreated: (pixelId: string, advertiserId: string, pixelCode: string) => void;
  onReset: () => void;
};

export function PixelStep({
  accessToken,
  onPixelCreated,
  onReset,
}: PixelStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAdvertisers, setIsFetchingAdvertisers] = useState(true);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [createdPixelId, setCreatedPixelId] = useState<string | null>(null);
  const [createdPixelCode, setCreatedPixelCode] = useState<string | null>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      advertiserId: "",
      pixelName: "",
    },
  });

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
            description:
              "We couldn't find any advertiser accounts linked to your TikTok profile.",
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
    fetchAdvertisers();
  }, [accessToken, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const result = await createPixel({
      accessToken: accessToken,
      advertiserId: values.advertiserId,
      pixelName: values.pixelName,
    });

    setIsLoading(false);

    if (result.success && result.data.pixel_id && result.data.pixel_code) {
      setCreatedPixelId(result.data.pixel_id);
      setCreatedPixelCode(result.data.pixel_code);
      onPixelCreated(result.data.pixel_id, values.advertiserId, result.data.pixel_code);
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
      toast({
        title: "Copiado!",
        description: "Informação copiada para a área de transferência.",
        className: "bg-green-600 text-white",
      });
    }
  };

  if (createdPixelId) {
    return (
      <Card className="bg-card border-t-4 border-primary shadow-lg shadow-primary/20">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-card-foreground">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Pixel Criado com Sucesso!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Seu novo Pixel está pronto. Copie o ID e o Código abaixo.
          </p>
          <div>
            <Label className="text-xs text-muted-foreground">Pixel ID</Label>
            <div className="flex items-center gap-2 p-3 rounded-md bg-secondary">
              <span className="font-mono text-sm text-card-foreground truncate">
                {createdPixelId}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(createdPixelId)}
                className="ml-auto flex-shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Pixel Code</Label>
            <div className="flex items-center gap-2 p-3 rounded-md bg-secondary">
              <span className="font-mono text-sm text-card-foreground truncate">
                {createdPixelCode}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(createdPixelCode)}
                className="ml-auto flex-shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Avançando para o envio de evento de teste...
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-t-4 border-accent shadow-lg shadow-accent/20">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-card-foreground">
          Step 2: Crie Seu Pixel
        </CardTitle>
        <CardDescription>
          Selecione uma conta de anunciante e dê um nome ao seu novo pixel.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={isLoading || isFetchingAdvertisers}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="advertiserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta de Anunciante</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                            <SelectItem
                              key={ad.advertiser_id}
                              value={ad.advertiser_id}
                            >
                              {ad.advertiser_name} ({ad.advertiser_id})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            Nenhuma conta encontrada.
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Escolha a conta do TikTok Ads para este pixel.
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
                    <FormLabel>Nome do Pixel</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Meu Pixel Incrível"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Um nome para te ajudar a identificar este pixel depois.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                disabled={isLoading || isFetchingAdvertisers}
              >
                {(isLoading || isFetchingAdvertisers) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <WandSparkles className="mr-2" />
                Gerar Pixel
              </Button>
            </CardFooter>
          </fieldset>
        </form>
      </Form>
    </Card>
  );
}
