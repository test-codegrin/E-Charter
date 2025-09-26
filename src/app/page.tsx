"use client";

import { useEffect } from "react";
import Hero from "./components/home/Hero";
import Choice from "./components/home/Choice";
import Service from "./components/home/Service";
import Fleet from "./components/home/Fleet";
import Quality from "./components/home/Quality";
import BookCar from "./components/home/BookCar";

export default function Page() {
  useEffect(() => {
    const html = document.documentElement;
    html.style.scrollBehavior = "smooth";
    
    return () => {
      html.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="max-w-screen mx-auto">
      <Hero />
      <Choice />
      <Service />
      <Fleet />
      <Quality />
      <BookCar />
    </div>
  );
}