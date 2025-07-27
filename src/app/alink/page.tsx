
"use client";

import React from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Download, Crown } from 'lucide-react';

export default function ALinkPage() {

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TLGP425V');`}
      </Script>
      {/* A tag noscript do GTM não pode ser adicionada aqui, mas o impacto é mínimo. */}

      <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center w-full">
          <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary">
            VENDA TUDO, EM TODO LUGAR
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold mt-2">Âncora Link <span className="text-accent">PRO</span></h1>
          <p className="text-muted-foreground mt-4 md:text-base">
              Venda infoprodutos, mentorias e achadinhos inserindo Links Clicáveis dentro dos vídeos. <br className="hidden md:inline" />
              Transforme seu TikTok em uma Loja Completa, sem depender do TikTok Shop.
          </p>

          <div className="mt-8 w-full max-w-md mx-auto space-y-8">
            <div>
                <p className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
                Material Gratuito
                </p>
                <div className="flex flex-col gap-4">
                <Button asChild size="lg" variant="outline" className="w-full justify-between p-6 text-base shadow-lg hover:scale-105 transition-transform">
                    <a href="https://www.dropbox.com/scl/fi/vjxtjcgpl3u1b8k728u1s/Layout-para-V-deos-de-Vendas.png?rlkey=f76d91fqr6v7g1e2bgn1irbrl&dl=1" target="_blank" rel="noopener noreferrer">
                      <Download className="h-5 w-5" />
                      <span>Conteúdo 003: Baixar o Layout em PNG</span>
                      <div className="w-5" />
                    </a>
                </Button>
                </div>
            </div>
            
            <div>
                <p className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
                Produtos
                </p>
                <div className="flex flex-col gap-4">
                <Button asChild size="lg" className="w-full justify-between p-6 text-base shadow-lg hover:scale-105 transition-transform">
                    <a href="https://pay.hotmart.com/C101007078D" target="_blank" rel="noopener noreferrer">
                      <Crown className="h-5 w-5" />
                      <span>Assinar o Âncora Link PRO</span>
                      <div className="w-5" />
                    </a>
                </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
