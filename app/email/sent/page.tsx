import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmailSentPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-12 text-center md:px-6">
      <div className="flex flex-col items-center gap-6">
        <div className="rounded-full bg-gold/20 p-4">
          <CheckCircle className="h-12 w-12 text-gold-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Your email has been sent.
        </h1>
        <p className="max-w-md text-muted-foreground">
          Good luck with your research application! We hope you hear back soon.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-4 bg-primary text-primary-foreground hover:bg-blue-light"
        >
          <Link href="/submissions">View Submissions</Link>
        </Button>
      </div>
    </div>
  )
}
