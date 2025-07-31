
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Enviar Teste</span>
          {step > 3 && <CheckCircle className="h-6 w-6 text-green-500" />}
        </CardTitle>
        <CardDescription>
          Envie uma compra teste para validar a instalação do pixel. Nada será
          cobrado.
        </CardDescription>
      </CardHeader>
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
    </Card>
  );
}
