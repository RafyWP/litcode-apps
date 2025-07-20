
"use client";

export default function Footer() {
  return (
    <footer className="container py-4 text-center text-xs text-muted-foreground border-t border-border">
      © {new Date().getFullYear()}{" "}
      <a
        href="https://litcode.store"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        LitCode Store
      </a>
    </footer>
  );
}
