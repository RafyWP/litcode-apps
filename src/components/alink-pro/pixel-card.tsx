
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Send, WandSparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Advertiser, Pixel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PixelCardProps {
  form: UseFormReturn<any>;
  isCompleted: boolean;
  isCreatingPixel: boolean;
  isSendingEvent: boolean;
  isFetchingAdvertisers: boolean;
  advertisers: Advertiser[];
  pixels: Pixel[];
  isFetchingPixels: boolean;
  onCreatePixel: () => void;
  onSendEvent: () => void;
}

export function PixelCard({
  form,
  isCompleted,
  isCreatingPixel,
  isSendingEvent,
  isFetchingAdvertisers,
  advertisers,
  pixels,
  isFetchingPixels,
  onCreatePixel,
  onSendEvent,
}: PixelCardProps) {
  const selectedAdvertiserId = form.watch("advertiserId");
  const pixelSelection = form.watch("pixelSelection");
  const pixelCode = form.watch("pixelCode");
  const isLoading = isCreatingPixel || isSendingEvent || isFetchingAdvertisers || isFetchingPixels;

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn(
            "flex items-center",
            isCompleted && "justify-between"
          )}
        >
          <span>2. Pixel e Teste</span>
          {isCompleted && <CheckCircle className="ml-2 h-6 w-6 text-green-500" />}
        </CardTitle>
        <CardDescription>
          Crie um novo pixel ou selecione um existente para testar.
        </CardDescription>
      </CardHeader>
      {!isCompleted && (
        <>
          <CardContent>
            <fieldset disabled={isLoading} className="space-y-4">
              <FormField
                control={form.control}
                name="advertiserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta de Anunciante</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("pixelSelection", "create_new");
                        form.setValue("pixelCode", "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger disabled={isFetchingAdvertisers}>
                          {isFetchingAdvertisers ? (
                            <span className="flex items-center text-muted-foreground">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Carregando...
                            </span>
                          ) : (
                            <SelectValue placeholder="Selecione uma conta" />
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
                            Nenhuma conta encontrada
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedAdvertiserId && (
                <>
                  <FormField
                    control={form.control}
                    name="pixelSelection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pixel</FormLabel>
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
                              <SelectItem value="create_new">
                                  ✨ Criar um novo pixel
                              </SelectItem>
                              {pixels.length > 0 && (
                                  pixels.map((p) => (
                                  <SelectItem key={p.pixel_code} value={p.pixel_code}>
                                      {p.pixel_name} ({p.pixel_code})
                                  </SelectItem>
                                  ))
                              )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {pixelSelection === "create_new" && (
                    <FormField
                      control={form.control}
                      name="pixelName"
                      render={({ field }) => (
                        <FormItem className="animate-in fade-in">
                          <FormLabel>Nome do Produto / Pixel</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: MeuPixel_2024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="pageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link de Afiliado</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  {/* Hidden Fields */}
                  <input type="hidden" {...form.register("externalId")} />
                </>
              )}
            </fieldset>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2 pt-4">
              {pixelSelection === 'create_new' && (
                  <Button
                      type="button"
                      onClick={onCreatePixel}
                      className="w-full font-bold"
                      disabled={isLoading || !selectedAdvertiserId}
                  >
                      {isCreatingPixel ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                      <WandSparkles className="mr-2" />
                      )}
                      Gerar Pixel
                  </Button>
              )}
              {pixelSelection !== 'create_new' && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onSendEvent}
                  className="w-full font-bold"
                  disabled={isLoading || !pixelCode}
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
