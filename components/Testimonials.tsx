import Image from "next/image";
import React from "react";

const Testimonials = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Testimonials</h2>
      <div className="flex items-center">
        <Image
          src="/images/banner.jpg"
          alt="Customer"
          width={50}
          height={50}
          className="rounded-full h-10 w-10 object-cover"
        />
        <div className="ml-4">
          <p className="italic">
            "I love shopping at this grocery store! The wide variety of fresh
            produce and friendly staff make every visit enjoyable and
            convenient."
          </p>
          <div className="mt-2 font-bold">Thomas Dankwah</div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
