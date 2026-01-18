import { NextResponse } from "next/server"

// Dummy submissions data
const dummySubmissions = [
  {
    _id: "sub_001",
    opportunityName: "Machine Learning Research Assistant",
    professorOrEmployerName: "Dr. Sarah Chen",
    recipientEmail: "schen@ucsc.edu",
    subject: "Application for ML Research Assistant Position",
    body: "Dear Dr. Chen,\n\nI am writing to express my interest in the Machine Learning Research Assistant position in your lab. I am a third-year Computer Science student with experience in Python, TensorFlow, and PyTorch.\n\nI have completed coursework in machine learning and have worked on several projects involving neural networks and natural language processing. I am particularly interested in your research on reinforcement learning applications.\n\nI would welcome the opportunity to discuss how I can contribute to your research team.\n\nBest regards,\nAlex Johnson",
    date: "2026-01-15T10:30:00Z",
    status: "sent",
  },
  {
    _id: "sub_002",
    opportunityName: "Genomics Lab Assistant",
    professorOrEmployerName: "Dr. Michael Rodriguez",
    recipientEmail: "mrodriguez@ucsc.edu",
    subject: "Interest in Genomics Research Position",
    body: "Dear Dr. Rodriguez,\n\nI am interested in joining your genomics research lab as a research assistant. As a Biology major with a minor in Bioinformatics, I have experience with DNA sequencing analysis and computational biology tools.\n\nI am fascinated by your work on genetic markers and would love to contribute to ongoing projects.\n\nThank you for considering my application.\n\nSincerely,\nJordan Smith",
    date: "2026-01-12T14:45:00Z",
    status: "sent",
  },
  {
    _id: "sub_003",
    opportunityName: "Climate Modeling Research",
    professorOrEmployerName: "Dr. Emily Watson",
    recipientEmail: "ewatson@ucsc.edu",
    subject: "Application for Climate Research Position",
    body: "Dear Dr. Watson,\n\nI am reaching out regarding the climate modeling research position in your lab...",
    date: "2026-01-17T09:15:00Z",
    status: "drafted",
  },
  {
    _id: "sub_004",
    opportunityName: "Quantum Computing Internship",
    professorOrEmployerName: "Dr. David Park",
    recipientEmail: "dpark@ucsc.edu",
    subject: "Quantum Computing Research Interest",
    body: "Dear Dr. Park,\n\nI am writing to inquire about research opportunities in quantum computing...",
    date: "2026-01-10T16:20:00Z",
    status: "failed",
  },
  {
    _id: "sub_005",
    opportunityName: "Psychology Research Study Coordinator",
    professorOrEmployerName: "Dr. Lisa Thompson",
    recipientEmail: "lthompson@ucsc.edu",
    subject: "Application for Research Coordinator Position",
    body: "Dear Dr. Thompson,\n\nI am interested in the Research Study Coordinator position in your cognitive psychology lab. With my background in Psychology and experience coordinating student organizations, I believe I would be a great fit for this role.\n\nI am detail-oriented and have experience with IRB protocols and participant recruitment.\n\nBest,\nTaylor Williams",
    date: "2026-01-14T11:00:00Z",
    status: "sent",
  },
]

export async function GET() {
  try {
    return NextResponse.json({ submissions: dummySubmissions })
  } catch (error) {
    return NextResponse.json(
      {
        submissions: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
