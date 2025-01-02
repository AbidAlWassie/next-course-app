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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchUserCourses(session.user.email)
      fetchAllCourses()
    }
  }, [status, session])

  const fetchUserCourses = async (email: string) => {
    try {
      const response = await fetch(`/api/user-courses?email=${email}`)
      if (!response.ok) {
        throw new Error("Failed to fetch user courses")
      }
      const data = await response.json()
      setUser(data)
    } catch (error) {
      console.error("Error fetching user courses:", error)
      setError("Failed to load user courses. Please try again later.")
    }
  }

  const fetchAllCourses = async () => {
    try {
      const response = await fetch("/api/courses")
      if (!response.ok) {
        throw new Error("Failed to fetch courses")
      }
      const data = await response.json()
      setAllCourses(data)
    } catch (error) {
      console.error("Error fetching all courses:", error)
      setError("Failed to load courses. Please try again later.")
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

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
                {user && user.courseLinks && user.courseLinks.length > 0 ? (
                  <ul className="space-y-4">
                    {user.courseLinks.map((link) => (
                      <li
                        key={link.course.id}
                        className="bg-slate-700 p-4 rounded-lg"
                      >
                        <Link
                          href={`/userCourse/${link.course.slug}`}
                          className="text-lg font-semibold text-blue-400 hover:underline"
                        >
                          {link.course.courseName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No courses available.</p>
                )}
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Explore Courses</h2>
                {allCourses.length > 0 ? (
                  <ul className="space-y-2">
                    {allCourses.map((course) => (
                      <li key={course.id}>
                        <Link
                          href={`/courses/${course.slug}`}
                          className="text-blue-400 hover:underline"
                        >
                          {course.courseName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No courses available to explore.</p>
                )}
                <Link href="/userCourse/">
                  <Button className="mt-4 bg-blue-500 hover:bg-blue-600 transition-colors">
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
