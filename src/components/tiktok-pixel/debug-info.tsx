"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bug } from "lucide-react";

export type DebugLog = {
  timestamp: Date;
  title: string;
  data: any;
};

type DebugInfoProps = {
  logs: DebugLog[];
};

export function DebugInfo({ logs }: DebugInfoProps) {
  if (logs.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible className="w-full bg-card rounded-lg border shadow-md">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="px-4 py-3 text-lg font-headline hover:no-underline">
          <div className="flex items-center gap-3">
            <Bug className="h-5 w-5 text-muted-foreground" />
            Debug Information
            <Badge variant="secondary">{logs.length}</Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ScrollArea className="h-72 w-full p-4 pt-0">
            <div className="space-y-4">
              {logs.slice().reverse().map((log, index) => (
                <div key={index} className="p-3 bg-secondary/50 rounded-md text-xs">
                  <p className="font-bold text-card-foreground">
                    [{log.timestamp.toLocaleTimeString()}] {log.title}
                  </p>
                  <pre className="mt-2 p-2 bg-background rounded-sm overflow-x-auto">
                    <code>{log.data}</code>
                  </pre>
                </div>
              ))}
            </div>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
