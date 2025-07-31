
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import {
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
import { Pixel } from "@/lib/types";

interface TestEventCardProps {
  form: UseFormReturn<any>;
  isCompleted: boolean;
  isSendingEvent: boolean;
  eventSent: boolean;
  handleSendEvent: () => void;
  onContinue: () => void;
  pixels: Pixel[];
  isFetchingPixels: boolean;
}

export function TestEventCard({
  form,
  isCompleted,
  isSendingEvent,
  eventSent,
  handleSendEvent,
  onContinue,
  pixels,
  isFetchingPixels,
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
            : "Selecione um pixel e envie uma compra teste para validar a instalação. Nada será cobrado."}
        </CardDescription>
      </CardHeader>
      {!isCompleted && (
        <>
          <CardContent>
            <FormField
              control={form.control}
              name="pixelCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pixel a ser Testado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isFetchingPixels}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {isFetchingPixels ? (
                          <span className="flex items-center text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Carregando Pixels...
                          </span>
                        ) : (
                          <SelectValue placeholder="Selecione um pixel" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pixels.length > 0 ? (
                        pixels.map((p) => (
                          <SelectItem key={p.pixel_code} value={p.pixel_code}>
                            {p.pixel_name} ({p.pixel_code})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          Nenhum pixel encontrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
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
                disabled={isSendingEvent || isFetchingPixels}
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
        </>
      )}
    </Card>
  );
}
