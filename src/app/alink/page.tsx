
"use client";

import React from 'react';
import Image from 'next/image';
import Script from 'next/script';

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
        <div className="text-center">
          <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary">
            VENDA TUDO, EM TODO LUGAR
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold mt-2">Âncora Link <span className="text-accent">PRO</span></h1>
          <p className="text-muted-foreground mt-4 md:text-base">
              Venda infoprodutos, mentorias e achadinhos inserindo Links Clicáveis dentro dos vídeos. <br className="hidden md:block" />
              Transforme seu TikTok em uma Loja Completa, sem depender do TikTok Shop.
          </p>

          <div className="mt-8">
              <Image
                  src="/images/alink/em-breve-optmz.png"
                  alt="Demonstração do Âncora Link"
                  width={400}
                  height={500}
                  className="rounded-lg shadow-lg mx-auto border"
              />
          </div>
        </div>
      </div>
    </>
  );
}
