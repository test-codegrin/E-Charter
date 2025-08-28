"use client";

import Hero from "./components/home/Hero";
import Choice from "./components/home/Choice";
import Service from "./components/home/Service";
import Fleet from "./components/home/Fleet";
import Quality from "./components/home/Quality";
import BookCar from "./components/home/BookCar";

export default function Page() {
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
}