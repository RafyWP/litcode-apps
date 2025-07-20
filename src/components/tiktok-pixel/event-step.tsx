
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
import { Loader2, Send } from "lucide-react";

type EventStepProps = {
  accessToken: string;
  pixelCode: string;
  onEventSent: () => void;
  addDebugLog: (title: string, data: any) => void;
};

export function EventStep({
  accessToken,
  pixelCode,
  onEventSent,
  addDebugLog,
}: EventStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendEvent() {
    setIsLoading(true);
    const payload = {
      accessToken,
      pixelCode,
    };
    addDebugLog("Calling trackEvent with params:", payload);

    const result = await trackEvent(payload);
    
    // @ts-ignore
    if(result.requestPayload) {
        // @ts-ignore
        addDebugLog("Sent Payload to TikTok API:", result.requestPayload);
    }

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
          Clique no botão abaixo para enviar um evento de teste 'Purchase' e verificar se o seu pixel está recebendo dados corretamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground p-4 bg-secondary/50 rounded-md text-center">
            Esta ação enviará um evento com os dados mínimos necessários para validação.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSendEvent}
          className="w-full bg-green-600 hover:bg-green-600/90 text-white font-bold"
          disabled={isLoading}
        >
          {isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          <Send className="mr-2" />
          Enviar Evento de Teste
        </Button>
      </CardFooter>
    </Card>
  );
}
