import { NextResponse } from "next/server"
import { Storage } from "@google-cloud/storage"

export const dynamic = "force-dynamic"


// Initialize GCS storage client using Application Default Credentials
const storage = new Storage()
const BUCKET_NAME = "conerstonepartlib"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const partId = searchParams.get("partId")

    if (!partId) {
      return NextResponse.json({ error: "Missing partId parameter" }, { status: 400 })
    }

    // Match the partId to the corresponding PDF file in the bucket
    // e.g., "SID-ACC-002.pdf" or "WIN-ACC-102.pdf"
    const fileName = `${partId}.pdf`
    const bucket = storage.bucket(BUCKET_NAME)
    const file = bucket.file(fileName)

    // Check if the PDF file exists in the bucket
    const [exists] = await file.exists()
    if (!exists) {
      return NextResponse.json(
        { error: `Datasheet file ${fileName} not found in bucket ${BUCKET_NAME}` },
        { status: 404 }
      )
    }

    // Generate a temporary Signed URL valid for 1 hour
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    })

    return NextResponse.json({ url: signedUrl })
  } catch (error: any) {
    console.error("Error retrieving datasheet from GCS:", error)
    return NextResponse.json(
      { error: error.message || "Failed to retrieve datasheet from Cloud Storage" },
      { status: 500 }
    )
  }
}
