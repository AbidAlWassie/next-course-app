import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
      <p className="text-gray-600 mb-6">Could not find the requested course.</p>
      <Button asChild>
        <Link href="/">Return to Courses</Link>
      </Button>
    </div>
  )
}
