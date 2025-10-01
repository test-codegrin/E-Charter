"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IMAGES_ASSETS } from "@/app/constants/ImageConstant";

const GlobalPageLoader = () => {
  const [showLoader, setShowLoader] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setShowLoader(true);
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white bg-opacity-90 flex flex-col items-center justify-center space-y-6">
      {/* Logo */}
      <img src={IMAGES_ASSETS.LOGO} alt="Logo" className="w-32 md:w-36 lg:w-52 h-auto" />

      {/* Infinite Loading Bar */}
      <div className="w-80 md:w-120 lg:w-150 h-1 bg-primary-gray/25 rounded overflow-hidden relative mt-4">
        <div className="absolute h-full w-1/3 bg-primary animate-loading" />
      </div>
    </div>
  );
};

export default GlobalPageLoader;
