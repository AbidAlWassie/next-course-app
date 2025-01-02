"use client"

import { BottomNav } from "@/components/layouts/BottomNav"
import Footer from "@/components/layouts/Footer"
import { Navbar } from "@/components/layouts/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Subject {
  id: string
  subCode: number
  subName: string
  slug: string
}

interface Course {
  id: string
  courseName: string
  slug: string
  subs: string[]
  subjects?: Subject[]
}

interface CourseLink {
  course: Course
}

interface User {
  courseLinks: CourseLink[]
}

export default function HomeUI() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [allCourses, setAllCourses] = useState<Course[]>([])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchUserCourses(session.user.email)
      fetchAllCourses()
    }
  }, [status, session])

  const fetchUserCourses = async (email: string) => {
    try {
      const response = await fetch(`/api/user-courses?email=${email}`)
      const data = await response.json()
      setUser(data)
    } catch (error) {
      console.error("Error fetching user courses:", error)
    }
  }

  const fetchAllCourses = async () => {
    try {
      const response = await fetch("/api/courses")
      const data = await response.json()
      const coursesWithSubjects = await Promise.all(
        data.map(async (course: Course) => {
          if (course.subs) {
            const subsArray = Array.isArray(course.subs)
              ? course.subs
              : (course.subs as string).split(",").map((id) => id.trim())
            const subjectsResponse = await fetch(
              `/api/subjects?ids=${subsArray.join(",")}`
            )
            const subjects = await subjectsResponse.json()
            return { ...course, subjects }
          }
          return course
        })
      )
      setAllCourses(coursesWithSubjects)
    } catch (error) {
      console.error("Error fetching all courses:", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto py-8 px-4">
        {status === "loading" && <p className="text-center">Loading...</p>}

        {status === "unauthenticated" && (
          <div className="text-center">
            <p className="mb-4">Please sign in to access your courses.</p>
            <Button
              asChild
              className="bg-indigo-600 text-indigo-50 hover:bg-indigo-700"
            >
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          </div>
        )}

        {status === "authenticated" && session?.user && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-6">
                Welcome, {session.user.name}!
              </h1>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
                {user && user.courseLinks.length > 0 ? (
                  <ul className="space-y-4">
                    {user.courseLinks.map((link) => {
                      const course =
                        allCourses.find((c) => c.id === link.course.id) ||
                        link.course
                      return (
                        <li
                          key={course.id}
                          className="bg-slate-700 shadow-md rounded-lg p-4"
                        >
                          <Link
                            href={`/userCourse/`}
                            className="text-lg font-semibold text-blue-400 hover:underline"
                          >
                            {course.courseName}
                          </Link>
                          {course.subjects && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {course.subjects.map((subject) => (
                                <Link
                                  key={subject.id}
                                  href={`/courses/${course.slug}/${subject.slug}`}
                                  className="flex items-center p-3 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors"
                                >
                                  <div className="mr-3 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {subject.subCode}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">
                                      {subject.subName}
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                      Code: {subject.subCode}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p>No courses available.</p>
                )}
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Explore Courses</h2>
                <Link href="/userCourse/">
                  <Button className="bg-blue-500 hover:bg-blue-600 transition-colors">
                    Add Courses
                  </Button>
                </Link>
              </section>
            </CardContent>
          </Card>
        )}

        <p className="font-bold text-center mt-6">
          Developed by{" "}
          <span className="text-indigo-400 hover:text-indigo-500">
            <Link href="https://abidalwassie.me/" target="_blank">
              Abid Al Wassie
            </Link>
          </span>
        </p>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
