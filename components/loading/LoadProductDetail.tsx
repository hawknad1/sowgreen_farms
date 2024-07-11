import { Skeleton } from "../ui/skeleton";

const LoadProductDetail = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between space-x-16">
        <div className=" flex flex-col w-full h-screen">
          <Skeleton className="h-10 w-40 ml-52 mb-2 flex justify-center" />

          <div className="flex flex-col gap-3">
            <div className="flex justify-end">
              <Skeleton className="w-[400px] h-[400px] rounded-2xl" />
            </div>

            <div className="flex gap-2 justify-end items-center">
              <Skeleton className="h-24 w-[95px] flex justify-center rounded-xl p-1.5" />
              <Skeleton className="h-24 w-[95px] flex justify-center rounded-xl p-1.5" />
              <Skeleton className="h-24 w-[95px] flex justify-center rounded-xl p-1.5" />
              <Skeleton className="h-24 w-[95px] flex justify-center rounded-xl p-1.5" />
            </div>
          </div>
        </div>
        <div className=" w-full h-screen">
          <div className="flex flex-col gap-4 mt-11">
            <Skeleton className="h-4 w-64" />

            <Skeleton className="h-11 w-64" />
            <Skeleton className="h-7 w-64" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-7 w-20" />

              <Skeleton className="h-7 w-20" />

              <Skeleton className="h-7 w-20" />
            </div>
            <div className="flex flex-col max-w-lg gap-3">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-36 w-[450px]" />
            </div>

            <div className="flex items-stretch gap-3">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
            <div className="flex items-center gap-5 mt-2">
              <Skeleton className="h-6 w-52 rounded-lg" />
              <Skeleton className="h-6 w-52 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadProductDetail;
