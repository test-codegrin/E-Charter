"use client";

import React from "react";
import Nav from "../components/home/Nav";
import ProfileCard from "../components/profile/ProfileCard";
import Tabs from "../components/profile/Tabs";

export default function Page() {
  return (
    <div className="min-h-[533px] max-w-[1760px] mx-auto w-full flex flex-col">
      {/* ✅ Navbar at the top */}
      <Nav />

      {/* ✅ Main content */}
      <main className="flex mt-[100px] flex-col items-center mb-[50px] px-4 flex-grow">
        <ProfileCard />
        <Tabs />
      </main>
    </div>
  );
}