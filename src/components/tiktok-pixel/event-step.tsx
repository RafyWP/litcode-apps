
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { trackEvent } from "@/app/actions";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

const formSchema = z.object({
  event: z.string().default("Purchase"),
  value: z.coerce.number().min(0, "Value must be a positive number."),
  currency: z.string().min(3, "Currency code is required.").max(3),
  contentId: z.string().min(1, "Content ID is required."),
  contentName: z.string().min(1, "Content Name is required."),
  externalId: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

type EventStepProps = {
  accessToken: string;
  pixelId: string;
  advertiserId: string;
  onEventSent: () => void;
  addDebugLog: (title: string, data: any) => void;
};

export function EventStep({
  accessToken,
  pixelId,
  advertiserId,
  onEventSent,
  addDebugLog,
}: EventStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userAgent, setUserAgent] = useState("");

  useEffect(() => {
    // This code runs only on the client, so `navigator` is available.
    if (typeof window !== "undefined") {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event: "Purchase",
      value: 200.0,
      currency: "USD",
      contentId: "12345",
      contentName: "Fancy-AirMax2.0 Black",
      externalId: "user_12345678",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const payload = {
      accessToken: accessToken,
      pixelId: pixelId,
      advertiserId: advertiserId,
      userAgent: userAgent,
      ...values,
    };
    addDebugLog("Tracking Event...", payload);

    const result = await trackEvent(payload);

    setIsLoading(false);

    if (result.success) {
      addDebugLog("Track Event Success", result);
      toast({
        title: "Evento de Teste Enviado!",
        description:
          "O evento 'Purchase' foi enviado com sucesso para o seu pixel.",
        className: "bg-green-600 text-white",
      });
      onEventSent();
    } else {
      addDebugLog("Track Event Error", result);
      toast({
        title: "Erro ao Enviar Evento",
        description: result.error || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="bg-card border-t-4 border-green-500 shadow-lg shadow-green-500/20">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-card-foreground">
          Step 3: Enviar Evento de Teste
        </CardTitle>
        <CardDescription>
          Envie um evento de teste 'Purchase' para verificar se o seu pixel está
          recebendo dados corretamente.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={isLoading}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="event"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Evento</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormDescription>
                      Atualmente, apenas o evento 'Purchase' é suportado para
                      teste.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                      <FormControl>
                        <Input {...field} placeholder="USD" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="contentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Conteúdo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do Produto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID do Conteúdo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="SKU do Produto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="externalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ID do usuário no seu sistema" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail (Opcional, SHA-256)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E-mail do usuário (hash SHA-256)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone (Opcional, SHA-256)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Telefone do usuário (hash SHA-256)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-600/90 text-white font-bold"
                disabled={isLoading || !userAgent}
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Send className="mr-2" />
                Enviar Evento de Teste
              </Button>
            </CardFooter>
          </fieldset>
        </form>
      </Form>
    </Card>
  );
}
