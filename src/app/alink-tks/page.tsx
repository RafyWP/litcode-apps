
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ALinkTksPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center w-full max-w-md mx-auto">
        <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary">
          VENDA TUDO, EM TODO LUGAR
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold mt-2">Âncora Link <span className="text-accent">PRO</span></h1>
        <p className="text-muted-foreground mt-4 md:text-base">
          Venda infoprodutos, mentorias e achadinhos inserindo Links Clicáveis dentro dos vídeos. <br className="hidden md:inline" />
          Transforme seu TikTok em uma Loja Completa, sem depender do TikTok Shop.
        </p>

        <div className="mt-12">
            <Card className="shadow-lg">
                <CardHeader className="items-center text-center">
                    <div className="text-6xl animate-bounce">🎉</div>
                    <CardTitle className="text-2xl font-bold mt-4">Obrigado por se inscrever!</CardTitle>
                    <CardDescription>
                        Seu acesso foi enviado para o seu e-mail.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
      </div>
    </div>
  );
}
