// path: app/courses/page.tsx
import prisma from "@/lib/db"
import Link from "next/link"
// import { FilterSelect } from "@/components/ui/FilterSelect";

export default async function CoursePages() {
  const courses = await prisma.course.findMany()

  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Select Course ({courses.length})
      </h1>

      <div className="course">
        <Link href={`/`} className="py-4">
          <button className="bg-blue-500 py-2 px-3 rounded-md mr-2">
            Back
          </button>
        </Link>

        <div className="course-list flex flex-wrap justify-center mt-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/5"
            >
              <Link href={`/courses/${course.slug}`}>
                <div className="course w-full h-[14rem] bg-blue-800 flex flex-col justify-center items-center my-4 rounded-md">
                  <h1 className="text-3xl font-semibold">
                    {course.courseName}
                  </h1>
                  {/* <p className="text-2xl font-semibold">{course.id}</p> */}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
