"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type PositionSummary = {
  _id?: string
  title?: string
  shortDescription?: string
}

export default function MatchPage() {
  const [position, setPosition] = useState<PositionSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPosition = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/positions", { cache: "no-store" })
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }
        const data = await response.json()
        const first = Array.isArray(data.positions) ? data.positions[0] : null
        if (isMounted) {
          setPosition(first ?? null)
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load position"
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPosition()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl text-balance">
          Congratulations! This research position best matches the experiences
          and interests from your resume.
        </h1>
      </div>

      {isLoading && (
        <div className="py-12 text-center text-muted-foreground">
          Loading research opportunity...
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load opportunity: {error}
        </div>
      )}

      {!isLoading && !error && position && (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Matched Position Card */}
          <Card className="border-border shadow-md">
            <CardContent className="p-6">
              <h2 className="mt-2 text-xl font-semibold text-foreground">
                {position.title ?? "Untitled role"}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {position.shortDescription?.trim().length
                  ? position.shortDescription
                  : "No description available."}
              </p>
              {position._id && (
                <Button
                  asChild
                  variant="outline"
                  className="mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <Link href={`/directory/${position._id}`}>
                    View Details
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 lg:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-blue-light"
            >
              <Link href="/email">Craft Personalized Email</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              <Link href="/">Go Back</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
