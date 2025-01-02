import { Course } from "@/app/page"
import Link from "next/link"
import { SubjectList } from "./SubjectList"

interface CourseListProps {
  courses: Course[]
}

export function CourseList({ courses }: CourseListProps) {
  return (
    <ul className="space-y-4">
      {courses.map((course) => (
        <li key={course.id} className="bg-white shadow-md rounded-lg p-4">
          <Link
            href={`/userCourse/`}
            className="text-lg font-semibold text-blue-600 hover:underline"
          >
            {course.courseName}
          </Link>
          {course.subjects && (
            <SubjectList subjects={course.subjects} courseSlug={course.slug} />
          )}
        </li>
      ))}
    </ul>
  )
}
