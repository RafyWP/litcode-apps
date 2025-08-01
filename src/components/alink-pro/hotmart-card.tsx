
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface HotmartCardProps {
  isCompleted: boolean;
  setStep: (step: number) => void;
  pixelCode: string | null;
  copyToClipboard: (text: string | null) => void;
}

export function HotmartCard({
  isCompleted,
  setStep,
  pixelCode,
  copyToClipboard,
}: HotmartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn(
            "flex items-center",
            isCompleted && "justify-between"
          )}
        >
          <span>3. Configurar Hotmart</span>
          {isCompleted && <CheckCircle className="ml-2 h-6 w-6 text-green-500" />}
        </CardTitle>
        <CardDescription>
          Siga os passos para usar o código do pixel na Hotmart.
        </CardDescription>
      </CardHeader>
      {!isCompleted && (
        <>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                Visite a página de{" "}
                <a
                  href="https://app.hotmart.com/tools/list/producer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Ferramentas do Hotmart
                </a>
                ;
              </li>
              <li>
                Digite 'pixel' no campo de busca e selecione 'Pixel de
                rastreamento';
              </li>
              <li>
                No campo 'Selecione o que você deseja rastrear' escolha 'Página
                de pagamento e de produto Hotmart', em seguida selecione o
                produto a que deseja associar o pixel gerado aqui;
              </li>
              <li>Escolha 'TikTok' entre a lista de integradores;</li>
              <li>
                Preencha o campo 'ID do TikTok' com o Código do Pixel abaixo:
              </li>
            </ol>
            <div className="pt-2 space-y-2">
              <Label>Código do Pixel Selecionado</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={pixelCode || ""}
                  className="font-mono text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(pixelCode)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setStep(4)} className="w-full font-bold">
              Já preenchi, prosseguir
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
