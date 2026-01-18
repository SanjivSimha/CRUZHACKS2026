"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search } from "lucide-react"

type Submission = {
  _id?: string
  opportunityName?: string
  professorOrEmployerName?: string
  date?: string
  status?: "drafted" | "sent" | "failed"
}

export default function SubmissionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadSubmissions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/submissions", { cache: "no-store" })
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }
        const data = await response.json()
        if (isMounted) {
          setSubmissions(Array.isArray(data.submissions) ? data.submissions : [])
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error ? fetchError.message : "Failed to load submissions"
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSubmissions()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredSubmissions = useMemo(() => {
    let filtered = submissions

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((submission) => submission.status === statusFilter)
    }

    // Apply search filter
    const query = searchQuery.trim().toLowerCase()
    if (query) {
      filtered = filtered.filter((submission) => {
        const opportunityName = submission.opportunityName?.toLowerCase() ?? ""
        const professorOrEmployerName = submission.professorOrEmployerName?.toLowerCase() ?? ""
        return (
          opportunityName.includes(query) ||
          professorOrEmployerName.includes(query)
        )
      })
    }

    return filtered
  }, [submissions, statusFilter, searchQuery])

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-600">Sent</Badge>
      case "drafted":
        return <Badge variant="secondary">Drafted</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Submissions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track and manage all your research position applications.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-input focus:border-primary focus:ring-primary"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="drafted">Drafted</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="py-12 text-center text-muted-foreground">
          Loading submissions...
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load submissions: {error}
        </div>
      )}

      {!isLoading && !error && filteredSubmissions.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity</TableHead>
                <TableHead>Professor/Employer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission, index) => {
                const id = submission._id
                return (
                  <TableRow
                    key={id ?? `submission-${index}`}
                    className="cursor-pointer"
                    onClick={() => id && router.push(`/submissions/${id}`)}
                  >
                    <TableCell className="font-medium">
                      {submission.opportunityName ?? "Untitled"}
                    </TableCell>
                    <TableCell>
                      {submission.professorOrEmployerName ?? "Unknown"}
                    </TableCell>
                    <TableCell>{formatDate(submission.date)}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && !error && filteredSubmissions.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            {submissions.length === 0
              ? "No submissions yet. Start applying to research positions!"
              : "No submissions found matching your filters."}
          </p>
          {submissions.length === 0 && (
            <Link
              href="/directory"
              className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Browse opportunities
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
