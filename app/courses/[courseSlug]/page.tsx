// path: app/courses/%5BcourseSlug%5D/page.tsx
import prisma from "@/lib/db"
import Link from "next/link"

export default async function CoursePage({
  params = { courseId: "", courseSlug: "" },
}) {
  // Fetch the course using slug
  const course = await prisma.course.findUnique({
    where: {
      slug: params.courseSlug,
    },
  })

  // Fetch all subjects
  const subjects = await prisma.subject.findMany({
    select: {
      id: true,
      subCode: true,
      subName: true,
      slug: true,
    },
  })

  // Check if course is found and subs are available
  const subsArray = course?.subjectCodes
    ? typeof course.subjectCodes === "string"
      ? (course.subjectCodes as string)
          .split(",")
          .map((id: string) => id.trim())
      : course.subjectCodes
    : []

  // Filter subjects based on subsArray
  const filteredSubjects = subjects.filter((subject) =>
    subsArray.includes(subject.id)
  )

  return (
    <main className="flex min-h-screen flex-col p-6">
      <Link href={`/`} className="py-4">
        <button className="bg-blue-500 py-2 px-3 rounded-md mr-2">Back</button>
      </Link>

      <div className="bg-blue-500 base-200 p-3 rounded-md">
        {course?.courseName}
      </div>

      <div className="subjectDiv flex flex-wrap justify-center border-[#1b3358] border-2 rounded-lg my-6 bg-[#0f2235] py-4">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject) => (
            <div
              key={subject.id}
              className="subjectContainer w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/5"
            >
              <Link href={`/courses/${course?.slug}/${subject.slug}`}>
                <div
                  key={subject.id}
                  className="subject mx-auto w-full h-full bg-blue-800 flex flex-col my-4 rounded-[1rem]"
                ></div>
                <div className="flex flex-col justify-center items-center">
                  <h1 className="subjectName font-semibold">
                    {subject.subName}
                  </h1>
                  <p className="subjectCode font-semibold">{subject.subCode}</p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No subjects available for this course.</p>
        )}
      </div>
    </main>
  )
}
