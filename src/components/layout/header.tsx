
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LogOut } from "lucide-react";

export default function Header() {
  const { accessToken, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-3">
            <span className="font-bold sm:inline-block leading-none">
              LitCode Store
            </span>
            <span className="h-4 w-px self-center bg-border" aria-hidden="true" />
            <span className="font-semibold text-muted-foreground sm:inline-block leading-none">
              TikTok-integrated Web App Store
            </span>
          </Link>
        </div>
        <div className="flex items-center justify-end">
          {accessToken ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:text-foreground/70"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
