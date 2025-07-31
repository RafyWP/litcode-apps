
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

interface PixelCardProps {
  form: UseFormReturn<any>;
  step: number;
  isLoading: boolean;
  isFetchingAdvertisers: boolean;
  advertisers: Advertiser[];
}

export function PixelCard({
  form,
  step,
  isLoading,
  isFetchingAdvertisers,
  advertisers,
}: PixelCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gerar Pixel</span>
          {step > 2 && <CheckCircle className="h-6 w-6 text-green-500" />}
        </CardTitle>
        <CardDescription>
          Selecione sua conta de anúncios para criar um novo pixel.
        </CardDescription>
      </CardHeader>
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
    </Card>
  );
}
