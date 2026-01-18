import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-foreground md:text-3xl">
            Welcome to SlugLabs
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in or create an account with Auth0 to continue.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            asChild
            className="w-full bg-primary text-primary-foreground hover:bg-blue-light"
          >
            <a href="/auth/login">Log in with Auth0</a>
          </Button>
          <Button
            variant="outline"
            asChild
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            <a href="/auth/login?screen_hint=signup">
              Create an account
            </a>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            You will be redirected to Auth0 to complete authentication.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
