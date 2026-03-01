import { Skeleton } from "@/components/ui/skeleton"

export default function FeedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-4 p-6 border rounded-2xl">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}