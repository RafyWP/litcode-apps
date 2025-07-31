
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface UserDataCardProps {
  form: UseFormReturn<any>;
  isCompleted: boolean;
}

export function UserDataCard({ form, isCompleted }: UserDataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn(
            "flex items-center",
            !isCompleted && "justify-between"
          )}
        >
          <span>3. Dados do Usuário</span>
          {isCompleted && <CheckCircle className="ml-2 h-6 w-6 text-green-500" />}
        </CardTitle>
        <CardDescription>
          Forneça dados de teste para melhorar a correspondência de eventos do
          pixel.
        </CardDescription>
      </CardHeader>
      {!isCompleted && (
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail de Teste</FormLabel>
                <FormControl>
                  <Input placeholder="user@test.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone de Teste</FormLabel>
                <FormControl>
                  <Input placeholder="+5511999998888" {...field} />
                </FormControl>
                 <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      )}
    </Card>
  );
}
