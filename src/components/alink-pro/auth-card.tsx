
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, LockKeyhole, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  isCompleted: boolean;
  isEmailVerified: boolean;
  emailVerify: string;
  setEmailVerify: (value: string) => void;
  isCheckingEmail: boolean;
  handleVerifyEmail: () => void;
  authUrl: string;
}

export function AuthCard({
  isCompleted,
  isEmailVerified,
  emailVerify,
  setEmailVerify,
  isCheckingEmail,
  handleVerifyEmail,
  authUrl,
}: AuthCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn(
            "flex items-center",
            isCompleted && "justify-between"
          )}
        >
          <span>1. Autorizar Acesso</span>
          {isCompleted && <CheckCircle className="ml-2 h-6 w-6 text-green-500" />}
        </CardTitle>
        <CardDescription>
          Autorize o aplicativo para acessar sua conta do TikTok Ads.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isEmailVerified ? (
          <div className="w-full space-y-2">
            <Label htmlFor="email-verify">E-mail de Membro</Label>
            <div className="flex items-center gap-2">
              <Input
                id="email-verify"
                type="text"
                placeholder="email..."
                value={emailVerify}
                onChange={(e) => setEmailVerify(e.target.value)}
                disabled={isCheckingEmail}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyEmail()}
              />
              <Button
                variant="outline"
                onClick={handleVerifyEmail}
                disabled={isCheckingEmail}
                aria-label="Verificar E-mail"
              >
                {isCheckingEmail ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <LockKeyhole />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full animate-in fade-in"
            onClick={() => {
              if (authUrl) window.location.href = authUrl;
            }}
          >
            <LogIn className="mr-2" />
            Login com TikTok Business
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
