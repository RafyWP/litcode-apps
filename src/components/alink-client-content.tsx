
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutTemplate, Crown } from 'lucide-react';

export default function AlinkClientContent({ proLink, freeLink }: { proLink: string; freeLink: string }) {
  const calculateTimeLeft = () => {
    const difference = +new Date('2025-08-01T00:00:00-03:00') - +new Date();
    let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isCountdownActive = timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0;

  return (
    <div className="mt-8 w-full max-w-md mx-auto space-y-8">
      <div>
        <p className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
          Lançamento
        </p>
        <div className="flex flex-col gap-4">
          <a href={!isCountdownActive ? proLink : undefined} target="_blank" rel="noopener noreferrer" className={isCountdownActive ? "cursor-not-allowed" : ""}>
            <Button size="lg" className="w-full justify-between p-6 text-base shadow-lg hover:scale-105 transition-transform" disabled={isCountdownActive}>
              <span>Assinar o Âncora Link PRO</span>
              <Crown className="h-5 w-5" />
            </Button>
          </a>
          {isClient && isCountdownActive && (
            <div className="mt-2 text-sm text-muted-foreground flex items-center justify-center gap-2 font-mono">
              <span>
                {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">
          Material Gratuito
        </p>
        <div className="flex flex-col gap-4">
          <Button asChild size="lg" variant="outline" className="w-full justify-between p-6 text-base shadow-lg hover:scale-105 transition-transform">
            <a href={freeLink} target="_blank" rel="noopener noreferrer">
              <span>Vídeo 003: Usar o Layout no Canva</span>
              <LayoutTemplate className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
