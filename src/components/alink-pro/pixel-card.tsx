
"use client";

import {
  Card,
  CardContent,
  CardDescription,
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
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, WandSparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Advertiser } from "@/app/alink-pro/alink-pro-client";
import { cn } from "@/lib/utils";

interface PixelCardProps {
  form: UseFormReturn<any>;
  step: number;
  isLoading: boolean;
  isFetchingAdvertisers: boolean;
  advertisers: Advertiser[];
  pixelName?: string;
  pixelId?: string | null;
  pixelCode?: string | null;
}

export function PixelCard({
  form,
  step,
  isLoading,
  isFetchingAdvertisers,
  advertisers,
  pixelName,
  pixelId,
  pixelCode,
}: PixelCardProps) {
  if (step < 2) {
    return null;
  }
  const isCompleted = step > 2;

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn(
            "flex items-center justify-between",
            isCompleted && "text-lg font-medium"
          )}
        >
          <span>Gerar Pixel</span>
          {isCompleted && <CheckCircle className="h-6 w-6 text-green-500" />}
        </CardTitle>
        {!isCompleted ? (
          <CardDescription>
            Selecione sua conta de anúncios para criar um novo pixel.
          </CardDescription>
        ) : (
          <div className="grid grid-cols-3 gap-x-4 gap-y-1 pt-2 text-sm">
            <div className="font-semibold text-muted-foreground">Nome</div>
            <div className="font-semibold text-muted-foreground">ID</div>
            <div className="font-semibold text-muted-foreground">Código</div>
            
            <div className="text-foreground truncate" title={pixelName}>{pixelName}</div>
            <div className="text-foreground font-mono text-xs" title={pixelId || ""}>{pixelId}</div>
            <div className="text-foreground font-mono text-xs" title={pixelCode || ""}>{pixelCode}</div>
          </div>
        )}
      </CardHeader>
      {!isCompleted && (
        <CardContent>
          <fieldset disabled={isLoading || isFetchingAdvertisers}>
            <div className="space-y-4">
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
                            Nenhuma conta encontrada
                          </SelectItem>
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
            <Button
              type="submit"
              className="w-full font-bold mt-4"
              disabled={isLoading || isFetchingAdvertisers}
            >
              {(isLoading || isFetchingAdvertisers) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <WandSparkles className="mr-2" />
              Gerar Pixel
            </Button>
          </fieldset>
        </CardContent>
      )}
    </Card>
  );
}

    