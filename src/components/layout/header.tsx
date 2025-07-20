
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LogOut, Sparkles } from "lucide-react";

export default function Header() {
  const { accessToken, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container flex h-14 items-center justify-center px-4 md:px-8 sm:justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-3 pt-[3px] sm:mr-6"
          >
            <Sparkles className="h-5 w-5 text-yellow-500 mt-[-3px]" />
            <span className="font-bold leading-none">
              LitCode Store
            </span>
            <span
              className="h-4 w-px self-center bg-border hidden sm:inline-block"
              aria-hidden="true"
            />
            <span className="font-semibold text-muted-foreground hidden sm:inline-block leading-none">
              TikTok-integrated Web App Store
            </span>
          </Link>
        </div>
        <div className="hidden sm:flex items-center justify-end">
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
