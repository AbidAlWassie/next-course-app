import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const courses = await prisma.course.findMany()
    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
