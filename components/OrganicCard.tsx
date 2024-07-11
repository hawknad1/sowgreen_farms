import Image from "next/image";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { accordion } from "@/constants";

const OrganicCard = () => {
  return (
    <>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex justify-center">
        Fresh & Flavorful organic goods
      </h2>
      <div className="flex flex-col justify-center items-center md:flex-row p-4 ">
        <div className="h-[450px] justify-center flex items-center">
          <Image
            src="/images/farmers.jpg"
            alt="Farmer"
            width={500}
            height={500}
            className="rounded-lg h-[420px] w-[400px] object-cover"
          />
        </div>

        <div className="ml-0 md:ml-8 mt-4 md:mt-0 h-[450px] flex flex-col justify-center ">
          <Accordion
            type="single"
            collapsible
            className="lg:w-[480px] h-[420px] w-96  flex flex-col gap-1.5 bg-gray-100 rounded-2xl p-4 "
          >
            {accordion.map(({ heading, description, id, value }) => (
              <AccordionItem
                key={id}
                value={value}
                className="bg-white rounded-lg px-3 text-sm"
              >
                <AccordionTrigger>{heading}</AccordionTrigger>
                <AccordionContent>{description}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default OrganicCard;
