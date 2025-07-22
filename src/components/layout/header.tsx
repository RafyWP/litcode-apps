
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

  const navLinks = [
    { href: "https://www.litcode.store/tiktok", label: "TikTok Courses" },
    { href: "https://www.litcode.store/litcode-community", label: "Community" },
    { href: "https://www.litcode.store/blog", label: "Blog" },
  ];

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="flex h-14 items-center justify-center px-4 sm:justify-between md:px-8">
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
        <div className="hidden sm:flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground hover:text-foreground/70"
              >
                {link.label}
              </a>
            ))}
          </nav>
          {accessToken && (
             <div className="flex items-center">
              <span className="h-4 w-px self-center bg-border" aria-hidden="true" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-md pl-4 py-2 text-sm font-medium text-foreground hover:text-foreground/70"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
