import { Subject } from "@/app/page"
import Link from "next/link"

interface SubjectListProps {
  subjects: Subject[]
  courseSlug: string
}

export function SubjectList({ subjects, courseSlug }: SubjectListProps) {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {subjects.map((subject) => (
        <Link
          key={subject.id}
          href={`/courses/${courseSlug}/${subject.slug}`}
          className="flex items-center p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          <div className="mr-3 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {subject.subCode}
          </div>
          <div>
            <h3 className="font-semibold">{subject.subName}</h3>
            <p className="text-sm text-gray-600">Code: {subject.subCode}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
