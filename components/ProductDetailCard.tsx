"use client";

// import { Product } from "@/typings/productTypings";
import Image from "next/image";
import { Button } from "./ui/button";
import { smallImage } from "@/constants";
import {
  ShoppingCartIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import Ratings from "./Ratings";
import { useRouter } from "next/navigation";

interface Props {
  product: any;
}

const ProductDetailCard = ({ product }: Props) => {
  const router = useRouter();

  console.log(`products here--- ${product}`);
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between space-x-16">
        <div className=" flex flex-col w-full h-screen">
          <h3 className="text-2xl flex justify-center font-bold mb-4 w-full">{`${product?.categoryName} / ${product?.title}`}</h3>

          <div className="flex flex-col gap-3">
            <div className="flex justify-end">
              <Image
                src={product?.imageUrl}
                alt={product?.title}
                width={400}
                height={400}
                className=" bg-gray-100 object-contain w-[400px] h-[400px] p-2 rounded-2xl"
              />
            </div>

            <div className="flex gap-2 justify-end items-center">
              <div className="bg-slate-100 h-24 w-[95px] flex justify-center rounded-xl p-1.5">
                <Image
                  src={product?.imageUrl}
                  alt={product?.title}
                  width={90}
                  height={90}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" w-full h-screen">
          <div className="flex flex-col gap-4 mt-11">
            <p className="text-neutral-400 text-sm">
              {`Categories -> ${product?.categoryName}`}
            </p>
            <h3 className="text-3xl font-bold">{product?.title}</h3>
            {/* ratings */}
            <Ratings />
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-black">{`GHC ${product?.price}`}</p>
              <p className="bg-black text-white text-[10px] font-medium px-2  p-1 rounded-full w-fit">
                20% Disc
              </p>
              <p className="text-sm font-medium text-neutral-600">400ml/each</p>
            </div>
            <div className="flex flex-col max-w-lg">
              <p className="text-sm font-semibold">Descriptions</p>
              <p className="text-sm text-neutral-600">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Ducimus qui magni nesciunt. Sit corporis deserunt voluptates
                porro doloremque aliquid illo magnam, autem consectetur saepe
                quaerat accusamus totam. Quidem, et suscipit?
              </p>
            </div>

            <div className="flex items-stretch gap-3">
              <Button className="rounded-full p-0 px-6 hover:bg-slate-100 bg-gray-200 text-black">
                Add To Cart
              </Button>
              <Button className="rounded-full p-0 px-4">Checkout Now</Button>
            </div>
            <div className="flex items-center gap-5 mt-2">
              <div className="flex items-center gap-1 hover:text-gray-400 cursor-pointer">
                <HeartIcon className="h-5 w-5" />
                <p className="text-sm font-medium">Add To Favorites</p>
              </div>
              <div className="flex items-center gap-1 hover:text-gray-400 cursor-pointer">
                <ClipboardDocumentListIcon className="h-5 w-5" />
                <p className="text-sm font-medium">Add To List</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailCard;
