
"use client";

import React, { useEffect } from 'react';

export default function ALinkPage() {
  useEffect(() => {
    // Prevent script from running on server or multiple times
    if (typeof window !== 'undefined') {
      // Check if script is already added
      if (!document.querySelector('script[src="https://static.hotmart.com/checkout/widget.min.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://static.hotmart.com/checkout/widget.min.js';
        script.async = true;
        document.head.appendChild(script);
      }

      // Check if stylesheet is already added
      if (!document.querySelector('link[href="https://static.hotmart.com/css/hotmart-fb.min.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
        document.head.appendChild(link);
      }
    }
  }, []);

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary">
          VENDA TUDO, EM TODO LUGAR
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold mt-2">Âncora Link <span className="text-accent">PRO</span></h1>
        <p className="text-muted-foreground mt-4 max-w-prose">
            Venda infoprodutos, mentorias e achadinhos inserindo Links Clicáveis dentro dos vídeos.
            <br />
            Transforme seu TikTok em uma Loja Completa, sem depender do TikTok Shop.
        </p>
        <div className="mt-8">
            <a 
                href="https://pay.hotmart.com/C101007078D?checkoutMode=2" 
                className="hotmart-fb hotmart__button-checkout"
                onClick={(e) => e.preventDefault()}
            >
                Comprar Agora
            </a>
        </div>
      </div>
    </div>
  );
}
