"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

interface OffersCardProps {
  title: string;
  date: string;
  image: string;
  description: string;
  features: string[];
  link?: string;
}

const OffersCard: React.FC<OffersCardProps> = ({
  title,
  date,
  image,
  description,
  features,
  link = "/",
}) => {
  return (
    <div className="bg-[#FCFCFC] border border-[#DBDBDB] rounded-2xl p-6 flex flex-col gap-6">
      {/* Icon and Badge */}
      <div className="flex justify-between items-start">
        <div className="bg-[#1FC091] w-[60px] h-[60px] rounded flex items-center justify-center">
          <Image
            src={`/images/${image}`}
            alt={title}
            width={45}
            height={45}
            className="object-contain"
          />
        </div>
        <span className="bg-[#EBEBEB] rounded-full px-4 py-2 text-sm font-medium">
          Limited Time
        </span>
      </div>

      {/* Title and Date */}
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm mt-1">{date}</p>
      </div>

      {/* Description */}
      <p className="text-base">{description}</p>

      {/* Features List */}
      <ul className="space-y-2 text-base">  
        {features.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <i className="fa-solid fa-check text-[#3DC1C4]"></i>
            {item}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link href="/">
        <button className="w-full cursor-pointer bg-[#3DBEC8] text-white font-bold py-3 rounded-full hover:bg-[#35aab1] transition">
          Book Now
        </button>
      </Link>
    </div>
  );
};

export default OffersCard;
