import Image from "next/image";
import React from "react";

interface Props {
  product: any;
}

const SmallDetailImage = ({ product }: Props) => {
  return (
    <div className="flex items-center">
      <Image
        src="/images/veg.png"
        alt={product?.attributes?.title}
        width={100}
        height={100}
      />
      <Image
        src="/images/veg.png"
        alt={product?.attributes?.title}
        width={100}
        height={100}
      />
      <Image
        src="/images/veg.png"
        alt={product?.attributes?.title}
        width={100}
        height={100}
      />
      <Image
        src="/images/veg.png"
        alt={product?.attributes?.title}
        width={100}
        height={100}
      />
    </div>
  );
};

export default SmallDetailImage;
