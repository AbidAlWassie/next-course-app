// path: app/courses/[courseSlug]/[courseSubject]/page.tsx
import ButtonIconLeft from "@/components/elements/ButtonIconLeft"
import Carousel from "@/components/elements/Carousel"
import YouTubeEmbed from "@/components/elements/YouTubeEmbed"
import prisma from "@/lib/db"

interface CourseSubjectParams {
  courseSlug: string
  courseSubject: string
}

export default async function CourseSubject({
  params,
}: {
  params: CourseSubjectParams
}) {
  // Log params for debugging
  console.log("Params received:", params)

  const { courseSlug, courseSubject } = params

  // Check if parameters are present
  if (!courseSlug || !courseSubject) {
    return (
      <div>
        Error: Missing course or subject slug. courseSlug: {courseSlug},
        courseSubject: {courseSubject}
      </div>
    )
  }

  try {
    // Fetch the subject using slug
    const subject = await prisma.subject.findUnique({
      where: {
        slug: courseSubject,
      },
    })

    if (!subject) {
      return <div>Error: Subject not found.</div>
    }

    // Fetch chapters for the subject along with their contents
    const chapters = await prisma.chapter.findMany({
      where: {
        subjectId: subject.id,
      },
      include: {
        contents: true, // Ensure this matches your schema
      },
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
    return <div>Error: Unable to fetch data.</div>
  }
}
