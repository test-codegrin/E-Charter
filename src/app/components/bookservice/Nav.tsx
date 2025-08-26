"use client";

import React, { useState } from "react";
import { Menu, X, Search } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white px-4 sm:px-6 md:px-8">
      <nav className="max-w-[1760px] mx-auto flex items-center justify-between h-[60px] my-2">
        {/* Logo */}
        <div className="flex-shrink-0 w-[70px] sm:w-[80px] md:w-[90px]">
          <a href="/">
            <img src="/images/Logo.png" alt="Logo" className="w-full" />  
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 items-center justify-evenly ml-36">
          {/* Nav Links */}
          <div className="flex gap-4 xl:gap-12 2xl:gap-24 text-[16px] xl:text-[18px]">
            <a href="/" className="hover:text-[#3DBEC8] text-lg font-semibold text-[#040401]">Home</a>
            <a href="/services/page1" className="hover:text-[#3DBEC8] text-lg font-semibold text-[#040401]">Service</a>
            <a href="/about" className="hover:text-[#3DBEC8] text-lg font-semibold text-[#040401]">About Us</a>
            <a href="/contact" className="hover:text-[#3DBEC8] text-lg font-semibold text-[#040401]">Contact Us</a>
          </div>

          {/* Search & Book Now */}
          <div className="flex items-center">
            <div className="relative w-[180px] md:w-[250px] xl:w-[310px] mr-4 xl:mr-6">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="search"
                placeholder="Search..."
                className="border border-[#3DBEC8] bg-white rounded-full h-[42px] md:h-[47px] w-full pl-12 pr-4 text-sm md:text-base focus:outline-none"
              />
            </div>
            <button className="h-[42px] md:h-[47px] w-[120px] md:w-[150px] xl:w-[198px] bg-[#3DBEC8] text-white rounded-full font-semibold text-sm md:text-base mr-6 xl:mr-8">
              Book Now
            </button>
          </div>
        </div>

        {/* Right Section (Avatar + Hamburger) */}
        <div className="flex items-center gap-4">
          {/* User Avatar + Dropdown */}
          <div className="relative">
            <button
              className="flex items-center"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-label="User menu"
            >
              <div className="rounded-full h-[36px] w-[36px] md:h-[40px] md:w-[40px] overflow-hidden">
                <img
                  src="/header/user.png"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <svg
                className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <ul className="py-1">
                  <li>
                    <a
                      href="/page6"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="/logout"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Log Out
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Hamburger Icon - Only Mobile */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      <div
        className={`lg:hidden  fixed top-[84px] right-0 bottom-0 w-[80vw] sm:w-[60vw] bg-white shadow-xl z-50 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-4 px-6 pt-6">
          <a href="/" className="text-[18px] font-medium py-2">Home</a>
          <a href="/service" className="text-[18px] font-medium py-2">Service</a>
          <a href="/about" className="text-[18px] font-medium py-2">About Us</a>
          <a href="/contact" className="text-[18px] font-medium py-2">Contact Us</a>

          <div className="relative mt-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="search"
              placeholder="Search..."
              className="border border-[#3DBEC8] rounded-full h-[42px] w-full pl-12 pr-4 text-sm focus:outline-none"
            />
          </div>

          <button className="mt-4 h-[42px] w-full bg-[#3DBEC8] text-white rounded-full font-semibold text-sm">
            Book Now
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
