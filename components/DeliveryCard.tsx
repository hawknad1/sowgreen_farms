import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

const DeliveryCard = () => {
  return (
    <div className="mt-4 md:mt-0 md:ml-8 w-full ">
      <div className="sm:flex justify-center">
        <div className="flex-1 lg:max-w-lg">
          <h2 className="text-3xl lg:text-4xl font-bold md:max-w-md md:mt-9 lg:mt-28 leading-snug ">
            We ship on the following day from 10:00 AM to 08:00 PM
          </h2>
          <p className="mt-4">For purchases over GHC 20.00</p>
          <Button className="mt-4 bg-white text-neutral-800 rounded-full px-4 py-2 hover:bg-neutral-100">
            Order Now
          </Button>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/delivery.png"
            width={400}
            height={400}
            alt="Delivery Man"
            className="lg:h-[390px] lg:w-[390px] h-72 w-72 sm:h-80 object-cover sm:w-full "
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryCard;
