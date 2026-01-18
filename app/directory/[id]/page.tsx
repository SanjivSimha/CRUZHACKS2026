"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type PositionDetail = {
  title?: string
  subject?: string
  description?: string
  labName?: string
  contactEmail?: string
  link?: string
}

export default function PositionDetailPage() {
  const params = useParams()
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : ""

  const [position, setPosition] = useState<PositionDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("Missing position id.")
      setIsLoading(false)
      return
    }

    let isMounted = true

    const loadPosition = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/positions/${id}`, {
          cache: "no-store",
        })
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }
        const data = await response.json()
        if (isMounted) {
          setPosition(data.position ?? null)
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
  }, [id])

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-8 flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Research Opportunity
        </h1>
        <Button
          asChild
          variant="outline"
          className="w-fit border-border text-foreground hover:bg-muted"
        >
          <Link href="/directory">Back to Directory</Link>
        </Button>
      </div>

      {isLoading && (
        <div className="py-12 text-center text-muted-foreground">
          Loading opportunity...
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load opportunity: {error}
        </div>
      )}

      {!isLoading && !error && position && (
        <Card className="border-border shadow-md">
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                {position.title ?? "Untitled role"}
              </h2>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Full Description
              </h3>
              <p className="text-muted-foreground">
                {position.description?.trim().length
                  ? position.description
                  : "No description available."}
              </p>
            </div>

            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="space-y-1">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Lab Name
                </dt>
                <dd className="text-foreground">
                  {position.labName?.trim().length
                    ? position.labName
                    : "N/A"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Contact Email
                </dt>
                <dd className="text-foreground">
                  {position.contactEmail?.trim().length ? (
                    <a
                      className="text-primary underline-offset-4 hover:underline"
                      href={`mailto:${position.contactEmail}`}
                    >
                      {position.contactEmail}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </dd>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Link
                </dt>
                <dd className="text-foreground">
                  {position.link?.trim().length ? (
                    <a
                      className="text-primary underline-offset-4 hover:underline"
                      href={position.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {position.link}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
