"use client";
import CategoryCard from "./CategoryCard";
import { useEffect, useState } from "react";
import HomeCategorySkeleton from "../../skeletons/HomeCategorySkeleton";

const CategoryCards = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch("/api/categories", {
          method: "GET",
          cache: "no-store",
        });

        if (res.ok) {
          const categories = await res.json();
          setCategoryList(categories);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getCategories();
  }, []);

  return (
    <>
      {isLoading ? (
        <HomeCategorySkeleton />
      ) : (
        <div className="flex items-center space-x-4 p-4 w-max">
          {categoryList.map((card) => (
            <CategoryCard data={card} key={card.id} />
          ))}
        </div>
      )}
    </>
  );
};

export default CategoryCards;
