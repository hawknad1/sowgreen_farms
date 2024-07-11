import Image from "next/image";
import React from "react";

const MiddleCard = () => {
  return (
    <>
      <div className="md:p-8 p-4 bg-orange-100 rounded-lg flex-1">
        <div className="flex items-center">
          <div className="flex-col max-w-44 flex-1 md:max-w-52">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">
              Everyday fresh & clean with our products
            </h3>
            <button className="bg-green-500 text-white px-4 py-2 rounded-full">
              Shop Now
            </button>
          </div>

          <div className="flex-1">
            <Image
              src="/images/veg2.png"
              height={100}
              width={700}
              className="w-full h-[250px] object-contain"
              alt="Veggies"
            />
          </div>
        </div>
      </div>
      <div className="md:p-8 p-4 bg-green-100 rounded-lg flex-1">
        <div className="flex items-center bg-fuchsia-500">
          <div className="flex-col max-w-44 flex-1 md:max-w-52">
            <h3 className="md:text-xl text-lg lg:text-2xl font-bold mb-4">
              Make your breakfast healthy and easy
            </h3>
            <button className="bg-green-500 text-white px-4 py-2 rounded-full">
              Shop Now
            </button>
          </div>

          <div className="flex-1 ">
            <Image
              src="/images/veg.png"
              height={100}
              width={700}
              className="w-full h-[250px] object-contain"
              alt="Veggies"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MiddleCard;
