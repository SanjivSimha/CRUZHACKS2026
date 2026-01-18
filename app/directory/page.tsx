"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type PositionSummary = {
  _id?: string
  title?: string
  subject?: string
  shortDescription?: string
}

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [positions, setPositions] = useState<PositionSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPositions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/positions", { cache: "no-store" })
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }
        const data = await response.json()
        if (isMounted) {
          setPositions(Array.isArray(data.positions) ? data.positions : [])
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error ? fetchError.message : "Failed to load positions"
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPositions()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredPositions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return positions
    return positions.filter((position) => {
      const title = position.title?.toLowerCase() ?? ""
      const subject = position.subject?.toLowerCase() ?? ""
      const shortDescription = position.shortDescription?.toLowerCase() ?? ""
      return (
        title.includes(query) ||
        subject.includes(query) ||
        shortDescription.includes(query)
      )
    })
  }, [positions, searchQuery])

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Directory
        </h1>
        <p className="mt-2 text-muted-foreground">
          A comprehensive directory of all research labs and positions at UCSC.
        </p>
      </div>

      <div className="relative mb-8 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search positions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-input focus:border-primary focus:ring-primary"
        />
      </div>

      {isLoading && (
        <div className="py-12 text-center text-muted-foreground">
          Loading positions...
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load positions: {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPositions.map((position, index) => {
            const id = position._id
            const title = position.title ?? "Untitled role"
            const shortDescription =
              position.shortDescription?.trim().length
                ? position.shortDescription
                : "No description available."

            const card = (
              <Card
                className="flex h-full flex-col border-border transition-all hover:border-primary hover:shadow-md"
              >
                <CardContent className="flex flex-1 flex-col p-6">
                  <h3 className="mt-2 text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">
                    {shortDescription}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-primary">
                    Learn more
                  </p>
                </CardContent>
              </Card>
            )

            return id ? (
              <Link
                key={id}
                href={`/directory/${id}`}
                className="block h-full"
              >
                {card}
              </Link>
            ) : (
              <div key={`position-${index}`} className="h-full">
                {card}
              </div>
            )
          })}
        </div>
      )}

      {!isLoading && !error && filteredPositions.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No positions found matching your search.
          </p>
        </div>
      )}
    </div>
  )
}
