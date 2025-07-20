
"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-4">
      <div className="container text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://litcode.store"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          LitCode Store
        </a>
      </div>
    </footer>
  );
}
