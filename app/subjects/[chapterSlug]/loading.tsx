// path: app/subjects/%5BchapterSlug%5D/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col gap-4 mx-6 pt-12 pb-24">
      <div className="bg-base-300 skeleton h-4 w-full"></div>
      <div className="bg-base-300 skeleton h-4 w-20"></div>
      <div className="bg-base-300 skeleton h-64 w-full"></div>
      <div className="bg-base-300 skeleton h-64 w-full"></div>
    </div>
  )
}
