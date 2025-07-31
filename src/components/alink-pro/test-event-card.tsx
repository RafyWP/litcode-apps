
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
  isCompleted: boolean;
  isSendingEvent: boolean;
  eventSent: boolean;
  handleSendEvent: () => void;
  onContinue: () => void;
}

export function TestEventCard({
  isCompleted,
  isSendingEvent,
  eventSent,
  handleSendEvent,
  onContinue,
}: TestEventCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn(
            "flex items-center",
            !isCompleted && "justify-between"
          )}
        >
          <span>4. Enviar Teste</span>
          {isCompleted && <CheckCircle className="ml-2 h-6 w-6 text-green-500" />}
        </CardTitle>
        <CardDescription>
          {eventSent
            ? "Evento de teste enviado com sucesso! Você pode prosseguir."
            : "Envie uma compra teste para validar a instalação do pixel. Nada será cobrado."}
        </CardDescription>
      </CardHeader>
      {!isCompleted && (
        <CardFooter>
          {eventSent ? (
            <Button
              onClick={onContinue}
              type="button"
              className="w-full font-bold"
            >
              Prosseguir
            </Button>
          ) : (
            <Button
              onClick={handleSendEvent}
              type="button"
              className="w-full font-bold"
              disabled={isSendingEvent}
            >
              {isSendingEvent ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2" />
              )}
              Testar Pixel
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
