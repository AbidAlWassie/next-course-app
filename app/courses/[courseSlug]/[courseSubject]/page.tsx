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

// Define the correct PageProps type
type PageProps = {
  params: Awaited<CourseSubjectParams> // Await resolved params
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
}

export async function generateStaticParams() {
  const subjects = await prisma.subject.findMany({
    select: { slug: true },
  })

  return subjects.map((subject) => ({
    courseSlug: subject.slug,
    courseSubject: subject.slug,
  }))
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
        <nav>
          <ButtonIconLeft href="/" text="Back" />
        </nav>
        <div className="chapterInfo flex flex-col">
          <h1 className="font-semibold mb-1">{subject.subName}</h1>
          <p className="font-normal mb-1">({subject.subCode})</p>
        </div>
        <div>
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <div key={chapter.id} className="chapter">
                <h2>
                  {chapter.number}. {chapter.chapterName}
                </h2>
                <div className="contents">
                  {chapter.contents.length > 0 ? (
                    <Carousel
                      items={chapter.contents.map((content) => {
                        const videoIdMatch =
                          content.contentUrl.match(/v=([^&]+)/)
                        const videoId = videoIdMatch ? videoIdMatch[1] : null
                        return (
                          <YouTubeEmbed
                            key={content.id}
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
                        )
                      })}
                    />
                  ) : (
                    <p>No contents available for this chapter.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No chapters available for this subject.</p>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching data:", error)
    throw new Error("Failed to fetch course data")
  }
}
