
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
import { Advertiser } from "@/lib/types";

interface AuthCardProps {
  isCompleted: boolean;
  isEmailVerified: boolean;
  emailVerify: string;
  setEmailVerify: (value: string) => void;
  isCheckingEmail: boolean;
  handleVerifyEmail: () => void;
  authUrl: string;
  advertisers: Advertiser[];
  verifiedEmail: string | null;
}

export function AuthCard({
  isCompleted,
  isEmailVerified,
  emailVerify,
  setEmailVerify,
  isCheckingEmail,
  handleVerifyEmail,
  authUrl,
  advertisers,
  verifiedEmail,
}: AuthCardProps) {
  const tiktokAccountName = advertisers[0]?.advertiser_name;
  const tiktokAccountId = advertisers[0]?.advertiser_id;

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
          {isCompleted ? (
            <div className="text-sm text-muted-foreground space-y-1 pt-2">
              <p>
                Você está logado em nosso sistema como:{" "}
                <span className="font-semibold text-foreground">{verifiedEmail}</span>
              </p>
              {tiktokAccountName && (
                 <p>
                    Você está logado no TT4B como:{" "}
                    <span className="font-semibold text-foreground">
                        {tiktokAccountName} ({tiktokAccountId})
                    </span>
                </p>
              )}
            </div>
          ) : (
            "Autorize o aplicativo para acessar sua conta do TikTok Ads."
          )}
        </CardDescription>
      </CardHeader>
      {!isCompleted && (
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
      )}
    </Card>
  );
}
