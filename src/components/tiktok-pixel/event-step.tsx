
"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

type EventStepProps = {
  accessToken: string;
  pixelCode: string;
  onEventSent: () => void;
  eventSent: boolean;
};

export function EventStep({
  accessToken,
  pixelCode,
  onEventSent,
  eventSent,
}: EventStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendEvent() {
    setIsLoading(true);
    const result = await trackEvent({
      accessToken,
      pixelCode,
    });

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Evento de Teste Enviado!",
        description: "O evento 'Purchase' foi enviado com sucesso.",
        className: "bg-green-600 text-white",
      });
      onEventSent();
    } else {
      toast({
        title: "Erro ao Enviar Evento",
        description: result.error || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }

  if (eventSent) {
    return (
      <Card className="bg-card border-t-4 border-green-500 shadow-lg shadow-green-500/20">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <div>
            <CardTitle className="font-headline text-card-foreground">
              Step 3: Evento de Teste Enviado
            </CardTitle>
            <CardDescription>
              O evento de teste foi enviado com sucesso para o seu pixel.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-t-4 border-green-500 shadow-lg shadow-green-500/20">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-card-foreground">
          Step 3: Enviar Evento de Teste
        </CardTitle>
        <CardDescription>
          Clique no botão abaixo para enviar um evento de teste 'Purchase' e
          verificar se o seu pixel está recebendo dados corretamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground p-4 bg-secondary/50 rounded-md text-center">
          Esta ação enviará um evento com os dados mínimos necessários para
          validação.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSendEvent}
          className="w-full bg-green-600 hover:bg-green-600/90 text-white font-bold"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Send className="mr-2" />
          Enviar Evento de Teste
        </Button>
      </CardFooter>
    </Card>
  );
}
