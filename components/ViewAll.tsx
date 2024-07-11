"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
const ViewAll = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/products")}
      className="flex justify-center mt-7"
    >
      <Button>View All Products</Button>
    </div>
  );
};

export default ViewAll;
