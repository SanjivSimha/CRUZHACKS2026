"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Trash2, Mail } from "lucide-react"

type Submission = {
  _id?: string
  opportunityName?: string
  professorOrEmployerName?: string
  recipientEmail?: string
  subject?: string
  body?: string
  date?: string
  status?: "drafted" | "sent" | "failed"
}

type FollowUpResponse = {
  subject?: string
  body?: string
}

export default function SubmissionDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [submission, setSubmission] = useState<Submission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [followUpOpen, setFollowUpOpen] = useState(false)
  const [followUpContent, setFollowUpContent] = useState<FollowUpResponse | null>(null)
  const [followUpLoading, setFollowUpLoading] = useState(false)
  const [followUpError, setFollowUpError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadSubmission = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/submissions/${id}`, { cache: "no-store" })
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`)
        }
        const data = await response.json()
        if (isMounted) {
          setSubmission(data.submission ?? data)
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error ? fetchError.message : "Failed to load submission"
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSubmission()

    return () => {
      isMounted = false
    }
  }, [id])

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`Delete failed with ${response.status}`)
      }
      router.push("/submissions")
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Failed to delete submission"
      )
      setIsDeleting(false)
    }
  }

  const handleFollowUp = async () => {
    try {
      setFollowUpLoading(true)
      setFollowUpError(null)
      const response = await fetch(`/api/submissions/${id}/follow-up`, {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error(`Follow-up request failed with ${response.status}`)
      }
      const data = await response.json()
      setFollowUpContent(data)
      setFollowUpOpen(true)
    } catch (followUpErr) {
      setFollowUpError(
        followUpErr instanceof Error ? followUpErr.message : "Failed to generate follow-up"
      )
    } finally {
      setFollowUpLoading(false)
    }
  }

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
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="py-12 text-center text-muted-foreground">
          Loading submission...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load submission: {error}
        </div>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/submissions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Link>
        </Button>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="py-12 text-center text-muted-foreground">
          Submission not found.
        </div>
        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/submissions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Submissions
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/submissions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {submission.opportunityName ?? "Untitled Submission"}
              </CardTitle>
              <CardDescription className="mt-2">
                Submitted to {submission.professorOrEmployerName ?? "Unknown"}
                {submission.recipientEmail && (
                  <span className="text-muted-foreground">
                    {" "}({submission.recipientEmail})
                  </span>
                )}
              </CardDescription>
            </div>
            {getStatusBadge(submission.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
            <p className="mt-1 text-foreground">{formatDate(submission.date)}</p>
          </div>

          {submission.subject && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
              <p className="mt-1 text-foreground">{submission.subject}</p>
            </div>
          )}

          {submission.body && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email Body</h3>
              <div className="mt-1 whitespace-pre-wrap rounded-md border bg-muted/50 p-4 text-sm text-foreground">
                {submission.body}
              </div>
            </div>
          )}

          {followUpError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {followUpError}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              onClick={handleFollowUp}
              disabled={followUpLoading}
              className="bg-primary text-primary-foreground hover:bg-blue-light"
            >
              <Mail className="mr-2 h-4 w-4" />
              {followUpLoading ? "Generating..." : "Follow-up"}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this submission? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button asChild variant="outline">
              <Link href="/directory">View more opportunities</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={followUpOpen} onOpenChange={setFollowUpOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Follow-up Email</DialogTitle>
            <DialogDescription>
              Generated follow-up email for your submission
            </DialogDescription>
          </DialogHeader>
          {followUpContent && (
            <div className="space-y-4">
              {followUpContent.subject && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Subject</h4>
                  <p className="mt-1 text-foreground">{followUpContent.subject}</p>
                </div>
              )}
              {followUpContent.body && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Body</h4>
                  <div className="mt-1 whitespace-pre-wrap rounded-md border bg-muted/50 p-4 text-sm text-foreground">
                    {followUpContent.body}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
