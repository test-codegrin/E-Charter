"use client";

import Nav from "../components/Nav";
import ProfileCard from "../components/ProfileCard";
import Tabs from "../components/Tabs";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex flex-col items-center mt-10 px-4 flex-grow">
        <ProfileCard />
        <Tabs />
      </main>
      <Footer />
    </div>
  );
}
