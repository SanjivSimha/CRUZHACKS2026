"use client"

import { usePathname } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function Navbar() {
  const pathname = usePathname()
  const { user, isLoading } = useUser()
  
  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">SlugLabs</span>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            asChild
            className={cn(
              "text-foreground hover:bg-muted",
              isActive("/") && "bg-muted"
            )}
          >
            <Link href="/">Home</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className={cn(
              "text-foreground hover:bg-muted",
              isActive("/directory") && "bg-muted"
            )}
          >
            <Link href="/directory">Directory</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className={cn(
              "text-foreground hover:bg-muted",
              isActive("/submissions") && "bg-muted"
            )}
          >
            <Link href="/submissions">Submissions</Link>
          </Button>
          {!isLoading && user ? (
            <>
              <span className="hidden text-sm text-muted-foreground md:inline">
                {user.name ?? user.email ?? "Account"}
              </span>
              <Button
                variant="outline"
                asChild
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                <a href="/api/auth/logout">Log out</a>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                asChild
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                <a href="/api/auth/login">Login</a>
              </Button>
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-blue-light"
              >
                <a href="/api/auth/login?screen_hint=signup">Sign Up</a>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
