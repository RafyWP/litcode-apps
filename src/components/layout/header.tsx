
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LogIn, LogOut } from "lucide-react";

export default function Header() {
  const { accessToken, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-8">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-3">
            <span className="font-bold sm:inline-block">
              LitCode Store
            </span>
            <span className="h-4 w-px bg-border" aria-hidden="true" />
            <span className="font-semibold text-muted-foreground sm:inline-block">
              TikTok
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {accessToken ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
