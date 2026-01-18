"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status")
  const isSuccess = status === "success"

  return (
    <div className="flex flex-col items-center gap-6">
      {isSuccess ? (
        <>
          <div className="rounded-full bg-green-600/20 p-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Submission Successful!
          </h1>
          <p className="max-w-md text-muted-foreground">
            Your application has been submitted successfully. Good luck with your research application!
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-blue-light"
            >
              <Link href="/submissions">View Submissions</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/directory">Browse More Opportunities</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-full bg-destructive/20 p-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Submission Failed
          </h1>
          <p className="max-w-md text-muted-foreground">
            There was an error submitting your application. Please try again or contact support if the problem persists.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-blue-light"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/submissions">View Submissions</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default function SubmissionConfirmationPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-12 text-center md:px-6">
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <ConfirmationContent />
      </Suspense>
    </div>
  )
}
