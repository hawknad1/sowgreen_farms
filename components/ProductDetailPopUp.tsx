"use client";

// import { Product } from "@/typings/productTypings";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  ShoppingCartIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import Ratings from "./Ratings";
import { useRouter } from "next/navigation";
import AddToCart from "./AddToCart";
import { Product } from "@/typings/productTypings";
import { useCartStore } from "@/store";
import { getCartTotal } from "@/lib/getCartTotal";

interface Props {
  product: Product;
}

const ProductDetailPopUp = ({ product }: Props) => {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const total = getCartTotal(cart);

  console.log(`products popup here--- ${product}`);
  return (
    <div className="flex items-center gap-4">
      {/* <h3 className="text-xl flex justify-center font-bold mb-4 w-full">{`${product?.attributes?.category?.data?.attributes?.category} / ${product?.attributes?.title}`}</h3> */}
      <div className="">
        <Image
          src={product?.imageUrl}
          unoptimized={true}
          alt={product?.title}
          width={400}
          height={400}
          className=" bg-gray-100 object-contain w-[200px] h-[200px] p-2 rounded-2xl"
        />
      </div>
      <div className="h-[200px] flex flex-col flex-1">
        <p className="text-neutral-400 text-sm">
          {`Categories -> ${product?.categoryName}`}
        </p>
        <h3 className="text-2xl font-bold mb-3">{product?.title}</h3>
        <div className="flex items-center space-x-2">
          <p className="text-xl font-bold text-black">{`GHC ${product?.price}`}</p>
          <p className="bg-black text-white text-[10px] font-medium px-2  p-1 rounded-full w-fit">
            20% Disc
          </p>
        </div>
        <p className="text-sm font-medium text-neutral-600">400ml / each</p>

        <div className="flex items-center mt-4">
          <AddToCart product={product} />
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-1 hover:text-gray-400 cursor-pointer">
            <HeartIcon className="h-5 w-5" />
            <p className="text-sm font-medium">Favorite</p>
          </div>
          <div className="flex items-center gap-1 hover:text-gray-400 cursor-pointer">
            <ClipboardDocumentListIcon className="h-5 w-5" />
            <p className="text-sm font-medium">Add To List</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPopUp;
