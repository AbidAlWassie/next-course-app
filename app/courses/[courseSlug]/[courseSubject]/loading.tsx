export default function Loading() {
  return (
    <div className="container mx-auto p-4 min-h-[86vh]">
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-gray-200 rounded"></div>
            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
              <div className="aspect-video bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
