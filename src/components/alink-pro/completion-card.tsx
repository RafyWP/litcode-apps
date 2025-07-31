
"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface CompletionCardProps {
  step: number;
  tiktokEventPanelUrl: string;
}

export function CompletionCard({
  step,
  tiktokEventPanelUrl,
}: CompletionCardProps) {
  if (step < 5) {
    return null;
  }

  return (
    <Card className="bg-green-50 dark:bg-green-900/20 border-green-500">
      <CardHeader className="text-center items-center gap-2">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <CardTitle>Concluído</CardTitle>
        <CardDescription>
          O processo de geração e configuração do pixel do TikTok foi
          concluído. Aguarde até 24 horas para que o evento seja registrado em
          seu{" "}
          <a
            href={tiktokEventPanelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            painel do TikTok Business
          </a>
          .
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
