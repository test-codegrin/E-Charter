"use client";

import React from "react";
import Link from "next/link";

type UniversalButtonProps = {
  label: string;
  href?: string; // if button is a link
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "outline" | "gray";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string; // for custom overrides
  disabled?: boolean;
  rounded?: boolean;
};

const baseStyles ="font-semibold transition-colors duration-200 flex items-center justify-center";

const sizeStyles: Record<string, string> = {
  sm: "px-4 py-2 text-xs sm:text-sm h-[40px] w-auto",
  md: "px-6 py-2 text-sm sm:text-base h-[45px] w-auto",
  lg: "px-8 py-3 text-base md:text-lg h-[52px] w-auto",
  xl: "px-10 py-3 text-lg md:text-xl h-[47px] w-[198px]",
  full: "w-full h-12 sm:h-14",
};

const variantStyles: Record<string, string> = {
  primary: "bg-primary text-white hover:bg-[#35aab1]",
  secondary: "bg-[#3DC1C4] text-white hover:bg-[#2da8ab]",
  danger: "bg-[#FF6363] text-white hover:brightness-110",
  outline: "border border-gray-300 text-gray-600 hover:bg-gray-100",
  gray: "bg-gray-200 text-gray-700 hover:bg-gray-300",
};

export default function Button({
  label,
  href,
  onClick,
  rounded = true,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: UniversalButtonProps) {
  const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${rounded ? "rounded-full" : ""} ${
    variantStyles[variant]
  } ${className}`;

  if (href) {
    return (
      <Link href={href}>
        <button className={`${buttonClasses} cursor-pointer`} type={type} onClick={onClick} disabled={disabled}>
          {label}
        </button>
      </Link>
    );
  }

  return (
    <button className={`${buttonClasses} cursor-pointer`} type={type} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
