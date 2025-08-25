"use client";
import React, { JSX } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface LinkSection {
  title: string;
  items: string[];
}

interface InfoBlock {
  icon: JSX.Element;
  label: string;
  value: string;
}

export default function Footer(): JSX.Element {
  const linkSections: LinkSection[] = [
    {
      title: "Useful Links",
      items: ["About us", "Contact us", "Gallery", "Blog", "F.A.Q"],
    },
    {
      title: "Vehicles",
      items: ["Sedan", "Cabriolet", "Pickup", "Minivan", "SUV"],
    },
    {
      title: "Services",
      items: ["Rental", "Chauffeur", "Insurance", "Leasing", "Fleet"],
    },
  ];

  const socialIcons: { icon: JSX.Element; label: string }[] = [
    { icon: <Facebook size={20} />, label: "Facebook" },
    { icon: <Instagram size={20} />, label: "Instagram" },
    { icon: <Twitter size={20} />, label: "Twitter" },
    { icon: <Youtube size={20} />, label: "YouTube" },
  ];

  const infoBlocks: InfoBlock[] = [
    {
      icon: <MapPin size={20} />,
      label: "Address",
      value: "Oxford Ave. Cary, NC 27511",
    },
    {
      icon: <Mail size={20} />,
      label: "Email",
      value: "nwiger@yahoo.com",
    },
    {
      icon: <Phone size={20} />,
      label: "Phone",
      value: "+537 547-6401",
    },
  ];

  return (
    <div className="lg:flex justify-center px-4 sm:px-6 lg:px-8 mb-[80px]">
      <footer className="w-full max-w-[1780px] rounded-[30px] border border-[#CCCCCC] bg-[#F1F1F1]">
        {/* Top Section */}
        <div className="px-4 sm:px-8 lg:px-[40px] pt-[30px] pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Logo & Description */}
            <div className="text-center sm:text-left">
              <img
                src="/images/Logo.png"
                alt="Logo"
                className="mx-auto sm:mx-0 w-[80px] h-[55px] sm:w-[90px] sm:h-[60px]"
              />
              <p className="text-base  mt-4 leading-relaxed text-[#000000] max-w-md mx-auto sm:mx-0">
                Faucibus faucibus pellentesque dictum turpis. Id pellentesque
                turpis massa a id iaculis lorem turpis euismod. Purus at quisque
                integer sit. Libero quis sapien tempus.
              </p>
            </div>

            <div className="sm:flex w-full justify-between">
              {/* Each LinkSection in its own div */}
              <div className="flex justify-between">
                <div className="text-left sm:w-[300px] xl:w-[300px] sm:text-left w-full xl:ml-[60px] ml-[20px]">
                  <h3 className="text-lg font-bold text-[#1E1E1E] mb-4">
                    {linkSections[0].title}
                  </h3>
                  <ul className="space-y-2">
                    {linkSections[0].items.map((item) => (
                      <li
                        key={item}
                        className="text-base text-[#000000] hover:text-[#1E1E1E] transition cursor-pointer"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-left 2xl:w-[400px] ml-[80px] w-full">
                  <h3 className="text-lg font-bold text-[#1E1E1E] mb-4">
                    {linkSections[1].title}
                  </h3>
                  <ul className="space-y-2">
                    {linkSections[1].items.map((item) => (
                      <li
                        key={item}
                        className="text-base text-[#000000] hover:text-[#1E1E1E] transition cursor-pointer"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-left sm:w-[300px] 2xl:w-[400px] sm:mt-[0] ml-[20px] mt-[30px] w-full">
                <h3 className="text-lg font-bold text-[#1E1E1E] mb-4">
                  {linkSections[2].title}
                </h3>
                <ul className="space-y-2">
                  {linkSections[2].items.map((item) => (
                    <li
                      key={item}
                      className="text-base text-[#000000] hover:text-[#1E1E1E] transition cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-[#1FC091] mx-4 sm:mx-8 lg:mx-[40px]"></div>

        {/* Bottom Section */}
        <div className="px-4 sm:px-8 lg:px-16 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Social Icons */}
          <div className="flex justify-center sm:justify-start gap-4">
            {socialIcons.map((social, idx) => (
              <div
                key={idx}
                title={social.label}
                className="h-[40px] w-[40px] bg-[#8D8D8D] transition duration-200 rounded-full text-white flex items-center justify-center hover:scale-105 cursor-pointer"
              >
                {social.icon}
              </div>
            ))}
          </div>

          {/* Info Blocks */}
          {infoBlocks.map((info, idx) => (
            <div
              key={idx}
              className="flex flex-row sm:flex-row items-center sm:items-start justify-start gap-2 sm:gap-4text-left"
            >
              <div className="h-[40px] w-[40px] bg-[#8D8D8D] text-white rounded-full flex items-center justify-center">
                {info.icon}
              </div>
              <div>
                <p className="text-sm sm:text-base text-[#000000]">
                  {info.label}
                </p>
                <p className="text-base font-semibold text-[#000000]">
                  {info.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
