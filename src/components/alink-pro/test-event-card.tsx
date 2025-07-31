
"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestEventCardProps {
  step: number;
  isSendingEvent: boolean;
  eventSent: boolean;
  handleSendEvent: () => void;
}

export function TestEventCard({
  step,
  isSendingEvent,
  eventSent,
  handleSendEvent,
}: TestEventCardProps) {
  if (step < 3) {
    return null;
  }
  const isCompleted = step > 3;

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn(
            "flex items-center justify-between",
            isCompleted && "text-lg font-medium"
          )}
        >
          <span>Enviar Teste</span>
          {isCompleted && <CheckCircle className="h-6 w-6 text-green-500" />}
        </CardTitle>
        <CardDescription>
          {isCompleted
            ? "O evento de teste 'Purchase' foi enviado para o TikTok com sucesso."
            : "Envie uma compra teste para validar a instalação do pixel. Nada será cobrado."}
        </CardDescription>
      </CardHeader>
      {!isCompleted && (
        <CardFooter>
          <Button
            onClick={handleSendEvent}
            type="button"
            className="w-full font-bold"
            disabled={isSendingEvent || eventSent}
          >
            {isSendingEvent ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2" />
            )}
            Testar Pixel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
