"use client";

import React from "react";
import Hero from "./components/home/Hero";
import Choice from "./components/home/Choice";
import Service from "./components/home/Service";
import Fleet from "./components/home/Fleet";
import Quality from "./components/home/Quality";
import BookCar from "./components/home/BookCar";

const Page: React.FC = () => {
  return (
    <>
      <Hero />
      <Choice />
      <Service />
      <Fleet />
      <Quality />
      <BookCar />
    </>
  );
};

export default Page;
