
"use client";

export default function Footer() {
  return (
    <footer className="w-full py-4 text-xs text-muted-foreground border-t border-border">
      <div className="container text-center">
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
