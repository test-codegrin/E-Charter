"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main className="relative w-full min-h-screen 2xl:mt-[70px] max-w-[1760px] mx-auto bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/images/404-dark.jpg')" }}
    >
      <div className="flex flex-col lg:w-[700px] lg:h-[630px] h-auto items-center">
        {/* 404 Illustration */}
        <img
          src="/images/404.svg"
          alt="404 Not Found"
          className="w-[250px] sm:w-[320px] md:w-[400px] lg:w-[700px] h-[452px] mx-auto"
        />

        {/* Go Back Button */}
        <button
          onClick={() => router.back()}
          className="mt-4 cursor-pointer bg-green-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg"
        >
          Go Back
        </button>
      </div>
    </main>
  );
}
