
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
        <h1 className="text-4xl font-bold">Âncora Link PRO</h1>
        <p className="text-muted-foreground mt-2">Página de checkout</p>
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
