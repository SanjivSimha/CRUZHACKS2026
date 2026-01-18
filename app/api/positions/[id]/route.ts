import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
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

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value
    }
  }
  return ""
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 })
    }

    const client = await clientPromise
    const position = await client
      .db("test")
      .collection("real_opportunities")
      .findOne(
        { _id: new ObjectId(id) },
        {
          projection: {
            title: 1,
            subject: 1,
            description: 1,
            full_description: 1,
            labName: 1,
            labname: 1,
            lab_name: 1,
            contactEmail: 1,
            contact_email: 1,
            email: 1,
            link: 1,
            url: 1,
            website: 1,
          },
        }
      )

    if (!position) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const title =
      typeof position.title === "string" ? position.title : "Untitled role"
    const description =
      typeof position.full_description === "string"
        ? position.full_description
        : typeof position.description === "string"
          ? position.description
          : ""
    const subject =
      typeof position.subject === "string" && position.subject.trim().length
        ? position.subject
        : inferSubject(`${title} ${description}`)

    return NextResponse.json({
      position: {
        _id: position._id?.toString(),
        title,
        subject,
        description,
        labName: pickString(position.labName, position.labname, position.lab_name),
        contactEmail: pickString(
          position.contactEmail,
          position.contact_email,
          position.email
        ),
        link: pickString(position.link, position.url, position.website),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
