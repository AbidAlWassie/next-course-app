// path: app/subjects/%5BchapterSlug%5D/page.tsx
import prisma from "@/lib/db"
import Link from "next/link"

export default async function SubjectPage({ params = { chapterSlug: "" } }) {
  const subject = await prisma.subject.findUnique({
    where: {
      slug: params.chapterSlug,
    },
  })

  const chapters = await prisma.chapter.findMany({
    where: {
      subjectId: subject?.id,
    },
  })

  return (
    <main className="flex flex-col p-6 items-center">
      <h1 className="text-2xl font-semibold mb-8">View Chapter</h1>
      <div className="subject">
        <div className="chapterInfo flex flex-col">
          {/* <Link href={`/subjects`} className="py-4">Back</Link> */}
          <h1 className="font-semibold mb-1">{subject?.subName}</h1>
          <p className="font-normal mb-1">({subject?.subCode})</p>
        </div>
      </div>

      {/* <p className="text-1xl font-semibold">{subject?.id}</p> */}

      {/* <div className="chapters">
        </div> */}

      <Link href={`/subjects/`} className="py-4">
        <button className="bg-blue-500 py-2 px-3 rounded-md mx-2">Back</button>
      </Link>
      <div className="chapterDiv">
        {chapters
          .sort((a, b) => a.number - b.number)
          .map((chapter) => (
            <div key={chapter.id} className="chapterContainer mx-2 my-4">
              <Link href={`/subjects/${subject?.slug}/${chapter.slug}`}>
                <div className="chapter bg-blue-800 flex flex-col justify-center items-center my-4 rounded-md">
                  <p className="text-1xl font-semibold my-1">
                    Chapter-{chapter.number}
                  </p>
                  <p className="text-2xl font-semibold my-1">
                    {chapter.chapterName}
                  </p>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </main>
  )
}
