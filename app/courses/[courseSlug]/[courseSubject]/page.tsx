// path: app/courses/%5BcourseSlug%5D/%5BcourseSubject%5D/page.tsx
import ButtonIconLeft from "@/components/elements/ButtonIconLeft"
import Carousel from "@/components/elements/Carousel"
import YouTubeEmbed from "@/components/elements/YouTubeEmbed"
import prisma from "@/lib/db"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface CourseSubjectParams {
  courseSlug: string
  courseSubject: string
}

export async function generateMetadata({
  params,
}: {
  params: CourseSubjectParams
}): Promise<Metadata> {
  try {
    const subject = await prisma.subject.findUnique({
      where: { slug: params.courseSubject },
      select: { subName: true, subCode: true },
    })

    if (!subject) {
      return { title: "Subject Not Found" }
    }

    return {
      title: `${subject.subName} (${subject.subCode})`,
      description: `Learn about ${subject.subName} in our comprehensive course material`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Subject Not Found",
      description: "Error fetching subject data.",
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

export default async function CourseSubject({
  params,
}: {
  params: CourseSubjectParams
}) {
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
          <ButtonIconLeft
            href={`/courses/${courseSlug}`}
            text="Back to Course"
          />
        </nav>
        <div className="bg-blue-800 text-white p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-semibold mb-1">{subject.subName}</h1>
          <p className="text-lg">Subject Code: {subject.subCode}</p>
        </div>
        <div className="space-y-8">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <h2 className="text-xl font-semibold bg-blue-100 p-4">
                Chapter {chapter.number}: {chapter.chapterName}
              </h2>
              <div className="p-4">
                {chapter.contents.length > 0 ? (
                  <Carousel
                    items={chapter.contents.map((content) => {
                      const videoIdMatch = content.contentUrl.match(
                        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                      )
                      const videoId = videoIdMatch ? videoIdMatch[1] : null
                      return (
                        <div key={content.id} className="w-full aspect-video">
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
                ) : (
                  <p className="text-gray-600">
                    No contents available for this chapter.
                  </p>
                )}
              </div>
            </div>
          ))}
          {chapters.length === 0 && (
            <p className="text-center text-gray-600">
              No chapters available for this subject.
            </p>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching data:", error)
    notFound()
  }
}
