// path: app/subjects/%5BchapterSlug%5D/%5BcontentSlug%5D/page.tsx

import YouTubeEmbed from "@/components/elements/YouTubeEmbed"
import prisma from "@/lib/db"
import Link from "next/link"

export default async function SubjectPage({
  params = { contentSlug: "", chapterSlug: "" },
}) {
  const subject = await prisma.subject.findUnique({
    where: {
      slug: params.chapterSlug,
    },
  })

  const chapter = await prisma.chapter.findUnique({
    where: {
      slug: params.contentSlug,
    },
  })

  const contents = await prisma.content.findMany({
    where: {
      chapterId: chapter?.id,
    },
  })

  return (
    <main className="flex flex-col p-6 items-center">
      <h1 className="text-2xl font-semibold mb-8">Contents</h1>

      <div className="subjectInfo">
        <div className="contentInfo flex flex-col items-center">
          <h1 className="text-2xl font-semibold mb-2">
            {chapter?.number}. {chapter?.chapterName}
          </h1>
        </div>
      </div>

      <Link href={`/subjects/${subject?.slug}/`} className="py-4">
        <button className="bg-blue-500 py-2 px-3 rounded-md mx-2">Back</button>
      </Link>

      <div className="contents">
        <div className="flex flex-col justify-center contentDiv">
          {contents.map((content) => {
            const videoIdMatch = content.contentUrl.match(/v=([^&]+)/)
            const videoId = videoIdMatch ? videoIdMatch[1] : null

            return (
              <div key={content.id} className="mx-4 ">
                <div className="ytContainer w-full flex flex-col">
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
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
