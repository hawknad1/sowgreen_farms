import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="container mx-auto py-8">
      {/* <section className="bg-[#254336] rounded-lg">
          <Banner />
        </section> */}

      <section className="my-10">
        {/* <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              Shop By Category
            </h2>
            <div className="flex gap-2">
              <div className="bg-slate-100 p-1 rounded-full cursor-pointer">
                <ChevronLeftIcon className="size-5" />
              </div>
              <div className="bg-slate-100 p-1 rounded-full cursor-pointer">
                <ChevronRightIcon className="size-5" />
              </div>
            </div>
          </div> */}

        {/* <CategoryCards /> */}
        <Skeleton className="h-24 w-24" />
      </section>

      {/* <section className="my-8 flex flex-col md:flex-row gap-4">
          <Middle />
        </section> */}

      <section className="my-8">
        {/* <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              Farm fresh products
            </h2>
            <div>
              <PaginationButtons />
            </div>
          </div> */}
        {/* <ProductCards /> */}
        <Skeleton className="h-24 w-24" />
      </section>

      <section className="my-8 p-5 rounded-lg flex flex-col md:flex-row items-center ">
        {/* <DeliveryCard /> */}
        <Skeleton className="h-96 w-full" />
      </section>

      <section className="my-8">
        {/* <OrganicCard /> */}
        <Skeleton className="h-24 w-24" />
      </section>

      {/* <section className="my-8 bg-gray-100 p-8 rounded-lg">
          <Testimonials />
        </section> */}
    </div>
  );
};

export default Loading;
