import { NextRequest, NextResponse } from "next/server"

// Dummy submissions data for reference
const dummySubmissions = [
  {
    _id: "sub_001",
    opportunityName: "Machine Learning Research Assistant",
    professorOrEmployerName: "Dr. Sarah Chen",
  },
  {
    _id: "sub_002",
    opportunityName: "Genomics Lab Assistant",
    professorOrEmployerName: "Dr. Michael Rodriguez",
  },
  {
    _id: "sub_003",
    opportunityName: "Climate Modeling Research",
    professorOrEmployerName: "Dr. Emily Watson",
  },
  {
    _id: "sub_004",
    opportunityName: "Quantum Computing Internship",
    professorOrEmployerName: "Dr. David Park",
  },
  {
    _id: "sub_005",
    opportunityName: "Psychology Research Study Coordinator",
    professorOrEmployerName: "Dr. Lisa Thompson",
  },
]

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const submission = dummySubmissions.find((s) => s._id === id)

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      )
    }

    // Generate a dummy follow-up email
    const followUpEmail = {
      subject: `Follow-up: ${submission.opportunityName}`,
      body: `Dear ${submission.professorOrEmployerName},

I hope this email finds you well. I wanted to follow up on my previous application for the ${submission.opportunityName} position that I submitted recently.

I remain very interested in this opportunity and would welcome the chance to discuss how my skills and experience could contribute to your research.

If you need any additional information or materials from me, please don't hesitate to let me know. I would be happy to provide references or any other documentation that might be helpful.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
[Your Name]`,
    }

    return NextResponse.json(followUpEmail)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
