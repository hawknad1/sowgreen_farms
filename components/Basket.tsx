import React from "react";

const Basket = () => {
  const product = [
    {
      id: 1,
      category: "Poultry",
      title: "Eggs",
      href: "/categories/vegetables",
      image: "/svg/fruit.svg",
      imageUrl: "/images/eggs.png",
      price: 20,
      badge: "red",
    },
    {
      id: 2,
      category: "Vegetables",
      title: "Green Pepper",
      href: "/categories/fruits",
      image: "/svg/fruit.svg",
      imageUrl: "/images/veg1.png",
      price: 35,
      badge: "red",
    },
  ];

  return (
    <div>
      <h4 className="text-2xl font-bold">Shopping Cart</h4>
      <div></div>
    </div>
  );
};

export default Basket;
