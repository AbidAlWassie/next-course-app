// path: app/subjects/page.tsx
import prisma from "@/lib/db"
import Link from "next/link"

export default async function SubjectPages() {
  const subjects = await prisma.subject.findMany()

  return (
    <main className="flex min-h-screen flex-col p-6 items-center">
      <h1 className="text-2xl font-semibold">
        Select Subjects ({subjects.length})
      </h1>
      <div className="subjects">
        <Link href={`/`} className="py-4">
          <button className="bg-blue-500 py-2 px-3 rounded-md mx-2">
            Back
          </button>
        </Link>

        <div className="subjectDiv flex flex-wrap justify-center border-[#1b3358] border-2 rounded-lg my-6 bg-[#0f2235] py-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="subjectContainer mx-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/5"
            >
              <Link href={`/subjects/${subject.slug}`}>
                <div className="subject mx-auto w-full h-full bg-blue-800 flex flex-col my-4 rounded-[1rem]"></div>
                <div className="flex flex-col justify-center items-center">
                  <h1 className="subjectName font-semibold">
                    {subject.subName}
                  </h1>
                  <p className="subjectCode font-semibold">{subject.subCode}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
