"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDown, Search, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const desktopDropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(target)
      ) {
        setDesktopDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(target)
      ) {
        setMobileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white">
      <div className="max-w-[1780px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/images/Logo.png" alt="Logo" width={90} height={60} />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Center Nav Links */}
          <div className="flex space-x-8 text-lg font-semibold text-[#040401]">
            <Link href="#" className="hover:text-[#3DBEC8]">Home</Link>
            <Link href="#" className="hover:text-[#3DBEC8]">Service</Link>
            <Link href="#" className="hover:text-[#3DBEC8]">About Us</Link>
            <Link href="#" className="hover:text-[#3DBEC8]">Contact Us</Link>
          </div>

          {/* Search bar */}
          <div className="hidden lg:flex items-center border-2 border-[#3DBEC8] rounded-full px-3 py-1 w-[260px] h-[42px]">
            <Search className="w-[18px] h-[18px] text-[#A3A3A3] mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="outline-none w-full text-sm font-medium text-gray-600 bg-transparent"
            />
          </div>

          {/* Book Now */}
          <button className="bg-[#3DBEC8] font-semibold text-base w-[160px] h-[42px] text-white rounded-full hover:bg-[#36aeb7] transition">
            Book Now
          </button>

          {/* User Avatar + Dropdown (Desktop) */}
          <div className="relative" ref={desktopDropdownRef}>
            <button
              className="flex items-center space-x-2"
              onClick={() => setDesktopDropdownOpen((s) => !s)}
              aria-haspopup="menu"
              aria-expanded={desktopDropdownOpen}
            >
              <Image
                src="/images/Profile.png"
                alt="User"
                width={42}
                height={42}
                className="rounded-full"
              />
              <ChevronDown className="w-[16px] h-[16px] text-gray-600" />
            </button>

            {desktopDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#FCFCFC] rounded-lg shadow-sm border border-[#DBDBDB] py-2 text-base animate-fadeIn">
                <Link
                  href="/page6"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => setDesktopDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => setDesktopDropdownOpen(false)}
                >
                  Settings
                </Link>
                <hr className="my-1 text-[#DBDBDB]" />
                <Link
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 text-red-500 font-medium"
                  onClick={() => setDesktopDropdownOpen(false)}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Right Section */}
        <div className="flex items-center space-x-4 lg:hidden">
          {/* User Avatar + Dropdown (Mobile) */}
          <div className="relative" ref={mobileDropdownRef}>
            <button
              className="flex items-center"
              onClick={() => setMobileDropdownOpen((s) => !s)}
              aria-haspopup="menu"
              aria-expanded={mobileDropdownOpen}
            >
              <Link href="/page6">
                <Image
                src="/images/Profile.png"
                alt="User"
                width={36}
                height={36}
                className="rounded-full"
                />
              </Link>
            </button>

            {mobileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#FCFCFC] rounded-lg shadow-sm border border-[#DBDBDB] py-2 text-base animate-fadeIn">
                <Link
                  href="/Page6"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => setMobileDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => setMobileDropdownOpen(false)}
                >
                  Settings
                </Link>
                <hr className="my-1 text-[#DBDBDB]" />
                <Link
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 text-red-500 font-medium"
                  onClick={() => setMobileDropdownOpen(false)}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((s) => !s)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7 text-gray-700" />
            ) : (
              <Menu className="w-7 h-7 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden text-center bg-white shadow-md border-t border-gray-200 px-4 py-4 space-y-4"
        >
          {/* Mobile Search */}
          <div className="flex md:w-[400px] mx-auto items-center border-2 border-[#3DBEC8] rounded-full px-3 py-1 w-full h-[42px]">
            <Search className="w-[18px] h-[18px] text-[#A3A3A3] mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="outline-none w-full text-sm font-medium text-gray-600 bg-transparent"
            />
          </div>

          <Link href="#" className="block text-lg font-medium text-gray-800 hover:text-[#3DBEC8]">
            Home
          </Link>
          <Link href="#" className="block text-lg font-medium text-gray-800 hover:text-[#3DBEC8]">
            Service
          </Link>
          <Link href="#" className="block text-lg font-medium text-gray-800 hover:text-[#3DBEC8]">
            About Us
          </Link>
          <Link href="#" className="block text-lg font-medium text-gray-800 hover:text-[#3DBEC8]">
            Contact Us
          </Link>

          {/* Book Now */}
          <button className="w-full md:w-[400px] mx-auto bg-[#3DBEC8] font-semibold text-base h-[42px] text-white rounded-full hover:bg-[#36aeb7] transition">
            Book Now
          </button>
        </div>
      )}
    </nav>
  );
}
