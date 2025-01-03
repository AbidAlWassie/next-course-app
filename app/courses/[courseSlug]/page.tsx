// path: app/courses/%5BcourseSlug%5D/page.tsx
import prisma from "@/lib/db"
import Link from "next/link"
import { notFound } from "next/navigation"

interface CoursePageProps {
  params: { courseSlug: string }
}

export default async function CoursePage({ params }: CoursePageProps) {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: params.courseSlug },
      select: {
        subjectCodes: true,
        courseName: true,
        slug: true,
      },
    })

    if (!course) {
      notFound()
    }

    const subjects = await prisma.subject.findMany({
      where: {
        id: {
          in: Array.isArray(course.subjectCodes)
            ? course.subjectCodes
            : typeof course.subjectCodes === "string" && course.subjectCodes
            ? (course.subjectCodes as string)
                .split(",")
                .map((id: string) => id.trim())
            : [],
        },
      },
      select: {
        id: true,
        subCode: true,
        subName: true,
        slug: true,
      },
    })

    return (
      <main className="flex min-h-screen flex-col p-6">
        <Link href="/courses" className="py-4">
          <button className="bg-blue-500 py-2 px-3 rounded-md mr-2 text-white">
            Back to Courses
          </button>
        </Link>

        <h1 className="text-2xl font-semibold mb-4 bg-blue-500 text-white p-3 rounded-md">
          {course.courseName}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/courses/${course.slug}/${subject.slug}`}
              className="block"
            >
              <div className="bg-blue-800 p-4 rounded-lg hover:bg-blue-700 transition-colors">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {subject.subName}
                </h2>
                <p className="text-blue-200 font-semibold">{subject.subCode}</p>
              </div>
            </Link>
          ))}
        </div>
        {subjects.length === 0 && (
          <p className="text-center mt-6">
            No subjects available for this course.
          </p>
        )}
      </main>
    )
  } catch (error) {
    console.error("Error fetching course data:", error)
    return (
      <main className="flex min-h-screen flex-col p-6">
        <h1 className="text-2xl font-semibold mb-4">Error loading course.</h1>
      </main>
    )
  }
}
