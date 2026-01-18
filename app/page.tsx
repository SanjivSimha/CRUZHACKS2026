"use client"

import React from "react"

import Link from "next/link"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

type PositionSummary = {
  _id?: string
  title?: string
  subject?: string
  shortDescription?: string
}

export default function HomePage() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [positions, setPositions] = useState<PositionSummary[]>([])
  const [isLoadingPositions, setIsLoadingPositions] = useState(true)
  const [positionsError, setPositionsError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setUploadedFile(files[0])
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setUploadedFile(files[0])
    }
  }

  const handleFindMatch = () => {
    if (uploadedFile) {
      router.push("/match")
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadPositions = async () => {
      try {
        setIsLoadingPositions(true)
        setPositionsError(null)
        const response = await fetch("/api/positions", { cache: "no-store" })
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }
        const data = await response.json()
        if (isMounted) {
          setPositions(Array.isArray(data.positions) ? data.positions : [])
        }
      } catch (error) {
        if (isMounted) {
          setPositionsError(
            error instanceof Error ? error.message : "Failed to load positions"
          )
        }
      } finally {
        if (isMounted) {
          setIsLoadingPositions(false)
        }
      }
    }

    loadPositions()

    return () => {
      isMounted = false
    }
  }, [])

  const featuredPositions = useMemo(() => positions.slice(0, 3), [positions])

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
          Apply to a research lab with a few clicks.
        </h1>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Upload Section */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            Upload your Resume/CV
          </h2>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex min-h-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : uploadedFile
                  ? "border-gold bg-gold/5"
                  : "border-border bg-muted/30"
            }`}
          >
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div
                className={`rounded-full p-4 ${uploadedFile ? "bg-gold/20 text-gold-foreground" : "bg-primary/10 text-primary"}`}
              >
                <Upload className="h-8 w-8" />
              </div>
              {uploadedFile ? (
                <>
                  <p className="font-medium text-foreground">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    File uploaded successfully
                  </p>
                </>
              ) : (
                <>
                  <label htmlFor="file-upload">
                    <Button
                      variant="outline"
                      className="cursor-pointer border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                      asChild
                    >
                      <span>Choose files to Upload</span>
                    </Button>
                  </label>
                  <p className="text-sm text-muted-foreground">
                    or drag and drop
                  </p>
                </>
              )}
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          </div>
          {uploadedFile && (
            <Button
              onClick={handleFindMatch}
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-blue-light"
              size="lg"
            >
              Find Matching Positions
            </Button>
          )}
        </div>

        {/* Featured Labs Section */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            Featured Labs
          </h2>
          {isLoadingPositions && (
            <div className="py-6 text-sm text-muted-foreground">
              Loading featured opportunities...
            </div>
          )}
          {positionsError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Failed to load opportunities: {positionsError}
            </div>
          )}
          {!isLoadingPositions && !positionsError && (
            <div className="space-y-4">
              {featuredPositions.map((position, index) => {
                const id = position._id
                const title = position.title ?? "Untitled role"
                const description =
                  position.shortDescription?.trim().length
                    ? position.shortDescription
                    : "Explore this research opportunity."

                const card = (
                  <Card className="border-border transition-all hover:border-primary hover:shadow-md">
                    <CardContent className="space-y-2 p-6">
                      <h3 className="text-lg font-semibold text-foreground">
                        {title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </CardContent>
                  </Card>
                )

                return id ? (
                  <Link key={id} href={`/directory/${id}`}>
                    {card}
                  </Link>
                ) : (
                  <div key={`featured-${index}`}>{card}</div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
