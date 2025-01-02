import {
  fetchCourses,
  fetchSubjectsForCourse,
  getUserCourses,
} from "@/actions/actions"
import { authOptions } from "@/auth/authOptions"
import { CourseList } from "@/components/elements/CourseList"
import RemoveCourseButton from "@/components/elements/RemoveCourseButton"
import { BottomNav } from "@/components/layouts/BottomNav"
import { getServerSession } from "next-auth/next"
import Link from "next/link"

export default async function UserCoursePage() {
  // Fetch the user's session
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return <p>Please log in to view your courses.</p>
  }

  const userEmail = session.user.email

  if (!userEmail) {
    return <p>Error: User email not found in session.</p>
  }

  // Fetch user courses and all available courses
  let user, allCourses

  try {
    user = await getUserCourses(userEmail)
    allCourses = await fetchCourses()
  } catch (error) {
    console.error("Error fetching user or course data:", error)
    return <p>Error loading courses. Please try again later.</p>
  }

  // Fetch subjects for all courses concurrently
  const coursesWithSubjects = await Promise.all(
    allCourses.map(async (course) => {
      if (course.subjectCodes) {
        const subsArray = Array.isArray(course.subjectCodes)
          ? course.subjectCodes
          : typeof course.subjectCodes === "string"
          ? (course.subjectCodes as string)
              .split(",")
              .map((id: string) => id.trim())
          : []

        try {
          const subjects = await fetchSubjectsForCourse(subsArray)
          return { ...course, subjects }
        } catch (error) {
          console.error(
            `Error fetching subjects for course ${course.id}:`,
            error
          )
          return { ...course, subjects: [] } // Return course without subjects in case of error
        }
      }
      return course
    })
  )

  // Type definitions
  interface Subject {
    id: string
    subCode: string
    subName: string
    slug: string
  }

  interface Course {
    id: string
    courseName: string
    slug: string
    subjectCodes: string | string[]
    subjects?: Subject[]
  }

  interface CourseLink {
    course: Course
  }

  return (
    <div className="container mx-auto p-4 min-h-[86vh]">
      <h1 className="text-2xl font-bold mb-4">Your Courses</h1>

      {user && user.courseLinks.length > 0 ? (
        <ul className="list-disc mb-8">
          {user.courseLinks.map((link: CourseLink) => {
            const course = coursesWithSubjects.find(
              (course) => course.id === link.course.id
            )

            return (
              <li key={link.course.id} className="mb-1 list-none">
                <div className="flex flex-col">
                  <div className="bg-blue-500 base-200 p-3 rounded-md mb-2">
                    <Link href={`/courses/${link.course.slug}`}>
                      {link.course.courseName}
                    </Link>
                    <RemoveCourseButton
                      courseId={link.course.id}
                      userEmail={userEmail}
                    />
                  </div>

                  <div className="subjectContainer">
                    {course &&
                    "subjects" in course &&
                    course.subjects.length > 0 ? (
                      course.subjects.map((subject: Subject) => (
                        <div key={subject.id} className="subjectDiv">
                          <Link
                            className="subjectLink"
                            href={`/courses/${course.slug}/${subject.slug}`}
                          >
                            <div className="subject">
                              {/* Add any icon or text inside the circle if needed */}
                            </div>
                            <div>
                              <h1 className="subjectName">{subject.subName}</h1>
                              <p className="subjectCode">{subject.subCode}</p>
                            </div>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-full text-center">
                        No subjects available for this course.
                      </p>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p>You are not enrolled in any courses.</p>
      )}

      <h1 className="text-2xl font-bold mb-4">All Available Courses</h1>
      {/* Pass only courses to the CourseList component */}
      <CourseList courses={coursesWithSubjects} />
      <BottomNav />
    </div>
  )
}
