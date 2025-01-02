// path: app/courses/[courseSlug]/[courseSubject]/page.tsx
import ButtonIconLeft from "@/components/elements/ButtonIconLeft"
import Carousel from "@/components/elements/Carousel"
import YouTubeEmbed from "@/components/elements/YouTubeEmbed"
import prisma from "@/lib/db"
import { Metadata } from "next"
import { notFound } from "next/navigation"

interface CourseSubjectParams {
  courseSlug: string
  courseSubject: string
}

interface PageProps {
  params: CourseSubjectParams
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const subject = await prisma.subject.findUnique({
      where: { slug: params.courseSubject },
      select: { subName: true, subCode: true },
    })

    if (!subject) {
      return {
        title: "Subject Not Found",
      }
    }

    return {
      title: `${subject.subName} (${subject.subCode})`,
      description: `Learn about ${subject.subName} in our comprehensive course material`,
    }
  } catch {
    return {
      title: "Error",
    }
  }
}

export async function generateStaticParams() {
  try {
    const subjects = await prisma.subject.findMany({
      select: { slug: true },
    })

    return subjects.map((subject) => ({
      courseSlug: subject.slug,
      courseSubject: subject.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default async function CourseSubject({ params }: PageProps) {
  const { courseSlug, courseSubject } = params

  if (!courseSlug || !courseSubject) {
    notFound()
  }

  try {
    const subject = await prisma.subject.findUnique({
      where: { slug: courseSubject },
    })

    if (!subject) {
      notFound()
    }

    const chapters = await prisma.chapter.findMany({
      where: { subjectId: subject.id },
      include: { contents: true },
      orderBy: { number: "asc" },
    })

    return (
      <div className="container mx-auto p-4 min-h-[86vh]">
        <nav className="mb-6">
          <ButtonIconLeft href="/" text="Back to Courses" />
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="chapterInfo space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {subject.subName}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Course Code: {subject.subCode}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Chapter {chapter.number}: {chapter.chapterName}
                </h2>
                <div className="contents">
                  {chapter.contents.length > 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <Carousel
                        items={chapter.contents.map((content) => {
                          const videoIdMatch =
                            content.contentUrl.match(/v=([^&]+)/)
                          const videoId = videoIdMatch ? videoIdMatch[1] : null
                          return (
                            <div
                              key={content.id}
                              className="w-full aspect-video"
                            >
                              <YouTubeEmbed
                                videoId={videoId ?? ""}
                                autoplay={false}
                                controls={true}
                                modestbranding={false}
                                rel={false}
                                start={0}
                                loop={true}
                                mute={false}
                                playsinline={true}
                              />
                            </div>
                          )
                        })}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                      No contents available for this chapter.
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No chapters available for this subject.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching data:", error)
    throw new Error("Failed to fetch course data")
  }
}
