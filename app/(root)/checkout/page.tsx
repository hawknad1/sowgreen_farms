import React from "react";
import { CheckoutForm } from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import PaymentMethods from "./PaymentMethods";

const CheckoutPage = () => {
  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="p-4 rounded-lg flex flex-col md:flex-row md:gap-8">
        <CheckoutForm />
        {/* <PaymentMethods /> */}
        {/* <div className="mt-8 md:mt-0 md:w-1/3">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <OrderSummary />
        </div> */}
      </div>
    </div>
  );
};

export default CheckoutPage;
