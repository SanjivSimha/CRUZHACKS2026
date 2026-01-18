import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

const inferSubject = (text: string) => {
  const normalized = text.toLowerCase()
  const matches = [
    { label: "Computer Science", terms: ["computer", "software", "machine learning", "ml", "ai", "data", "robot", "cyber", "security", "algorithm"] },
    { label: "Biology", terms: ["biology", "biological", "genomics", "bioinformatics", "molecular", "neuroscience", "biomedical", "biotech"] },
    { label: "Chemistry", terms: ["chemistry", "chemical", "organic", "inorganic", "spectroscopy"] },
    { label: "Physics", terms: ["physics", "quantum", "astroph", "optics", "particle"] },
    { label: "Environmental Science", terms: ["environment", "climate", "ecology", "sustainability", "geology", "ocean", "marine"] },
    { label: "Mathematics", terms: ["mathematics", "math", "statistics", "probability", "algebra"] },
    { label: "Psychology", terms: ["psychology", "cognitive", "behavioral", "neuropsychology"] },
    { label: "Economics", terms: ["economics", "finance", "market", "econometric"] },
    { label: "Engineering", terms: ["engineering", "mechanical", "electrical", "civil", "materials", "industrial"] },
    { label: "Astronomy", terms: ["astronomy", "telescope", "cosmology"] },
    { label: "Health", terms: ["medicine", "medical", "public health", "clinical", "epidemiology"] },
    { label: "Linguistics", terms: ["linguistics", "language", "speech"] },
    { label: "Design", terms: ["design", "ux", "ui", "visual"] },
    { label: "Political Science", terms: ["political", "policy", "governance"] },
  ]

  for (const match of matches) {
    if (match.terms.some((term) => normalized.includes(term))) {
      return match.label
    }
  }
  return "Research"
}

export async function GET() {
  try {
    const client = await clientPromise
    const positions = await client
      .db("test")
      .collection("real_opportunities")
      .find(
        {},
        {
          projection: {
            title: 1,
            subject: 1,
            shortDescription: 1,
            description: 1,
            full_description: 1,
          },
        }
      )
      .toArray()

    const serialized = positions.map((position) => {
      const title =
        typeof position.title === "string" ? position.title : "Untitled role"
      const fullDescription =
        typeof position.full_description === "string"
          ? position.full_description
          : typeof position.description === "string"
            ? position.description
            : typeof position.shortDescription === "string"
              ? position.shortDescription
              : ""
      const subject =
        typeof position.subject === "string" && position.subject.trim().length
          ? position.subject
          : inferSubject(`${title} ${fullDescription}`)
      const shortDescription =
        fullDescription.length > 120
          ? `${fullDescription.slice(0, 117)}...`
          : fullDescription

      return {
        _id: position._id?.toString(),
        title,
        subject,
        shortDescription,
      }
    })

    return NextResponse.json({ positions: serialized })
  } catch (error) {
    return NextResponse.json(
      {
        positions: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
