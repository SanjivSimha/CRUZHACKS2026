"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const sampleEmail = `Dear Professor Smith,

I hope this email finds you well. My name is Alex Chen, and I am a third-year Computer Science student at UC Santa Cruz. I am writing to express my strong interest in the Machine Learning Research Assistant position in your lab.

Through my coursework in machine learning and data structures, I have developed a solid foundation in neural network architectures and deep learning frameworks. Last quarter, I completed a project on sentiment analysis using transformer models, which sparked my passion for natural language processing research.

I am particularly drawn to your lab's work on large language models and their applications in scientific discovery. Your recent paper on efficient fine-tuning methods was especially inspiring, and I would be honored to contribute to similar research.

I have attached my resume for your review. I am available to discuss the position at your convenience and would welcome the opportunity to learn more about your current research projects.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
Alex Chen
Computer Science, Class of 2027
achen@ucsc.edu`

export default function EmailPage() {
  const router = useRouter()
  const [emailContent, setEmailContent] = useState(sampleEmail)
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    setIsSending(true)
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSending(false)
    router.push("/email/sent")
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Sample Email
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review and edit your personalized email before sending.
        </p>
      </div>

      <Card className="border-border shadow-md">
        <CardContent className="p-6">
          <Textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="min-h-[400px] resize-none border-input font-mono text-sm leading-relaxed focus:border-primary focus:ring-primary"
          />
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-4">
        <Button
          onClick={handleSend}
          disabled={isSending}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-blue-light"
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
        <Button
          onClick={() => router.push("/match")}
          variant="outline"
          size="lg"
          className="border-border text-foreground hover:bg-muted"
        >
          Go Back
        </Button>
      </div>
    </div>
  )
}
