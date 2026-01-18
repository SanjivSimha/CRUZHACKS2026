import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary">SlugLabs</span>
        </Link>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} SlugLabs. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
