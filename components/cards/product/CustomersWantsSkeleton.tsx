// app/components/CustomersWantsSkeleton.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const CustomersWantsSkeleton = ({ message }: { message?: string }) => {
  return (
    <div className="relative">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-2 p-0 py-4">
          <CardTitle className="text-xl flex items-center text-sowgren_Color self-center sm:text-2xl md:text-3xl font-bold">
            {message}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="flex gap-4">
            {/* Create an array of 4 skeletons to show as placeholders */}
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-[240px] space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomersWantsSkeleton
