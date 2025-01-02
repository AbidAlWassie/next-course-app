"use server"

import prisma from "@/lib/db"

export async function fetchSubjects() {
  const subject = await prisma.subject.findMany({
    select: {
      id: true,
      slug: true,
      subCode: true,
      subName: true,
    },
  })

  if (!subject) {
    throw new Error("Subjects not found.")
  }

  return subject
}

export async function fetchChapters() {
  const chapter = await prisma.chapter.findMany({
    where: {
      // Add your own condition here
    },
    select: {
      id: true,
      slug: true,
      number: true,
    },
  })

  if (!chapter) {
    throw new Error("Chapters not found.")
  }

  return chapter
}

export async function fetchContents() {
  const content = await prisma.content.findMany({
    where: {
      // Add your own condition here
    },
    select: {
      id: true,
      contentUrl: true,
      contentNum: true,
    },
  })

  if (!content) {
    throw new Error("Contents not found.")
  }

  return content
}

export async function getUserCourses(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    include: {
      courseLinks: {
        include: {
          course: true, // Include course details through the join table
        },
      },
    },
  })

  return user
}

// Fetch all courses (optional)
export async function fetchCourses() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      courseName: true,
      slug: true,
      subjectCodes: true,
    },
  })

  return courses
}

export async function enrollCourse(courseId: string, userEmail: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user) {
      throw new Error("User not found")
    }

    await prisma.userCourse.create({
      data: {
        userId: user.id,
        courseId,
      },
    })
  } catch (error) {
    console.error("Error enrolling course:", error)
    throw error
  }
}

export async function removeCourse(courseId: string, userEmail: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user) {
      throw new Error("User not found")
    }

    await prisma.userCourse.deleteMany({
      where: {
        userId: user.id,
        courseId,
      },
    })
  } catch (error) {
    console.error("Error unenrolling course:", error)
    throw error
  }
}

export async function fetchSubjectsForCourse(subIds: string[]) {
  return await prisma.subject.findMany({
    where: {
      id: {
        in: subIds,
      },
    },
  })
}
