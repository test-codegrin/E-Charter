"use client";

import Nav from "../components/bookservice/Nav";
import ProfileCard from "../components/profile/ProfileCard";
import Tabs from "../components/profile/Tabs";

export default function Home({
  children,
}: Readonly<{
  children?: React.ReactNode; // children optional
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Navbar at the top */}
      <Nav />

      {/* ✅ Main content */}
      <main className="flex mt-[100px] flex-col items-center mb-[50px] px-4 flex-grow">
        <ProfileCard />
        <Tabs />
        {/* ✅ Render children if provided */}
        {children}
      </main>
    </div>
  );
}
