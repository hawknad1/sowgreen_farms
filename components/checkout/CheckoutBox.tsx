import React from "react";

const CheckoutBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[300px] h-fit rounded-lg bg-white shadow-sm border border-1 p-5">
      {children}
    </div>
  );
};

export default CheckoutBox;
