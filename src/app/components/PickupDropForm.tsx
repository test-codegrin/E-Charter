"use client";

import React from "react";

const inputClasses =
  "ml-3 w-[300px] bg-transparent focus:border-[#3DC1C4] focus:outline-none font-semibold text-sm text-[#9C9C9C]";

const PickupDropForm = () => {
  const fields = [
    { icon: "Mask group1.png", placeholder: "Pickup Location", type: "text"},
    { icon: "Clock.png", placeholder: "Pick‑Up Date & Time", type: "datetime-local"},
    { icon: "Mask group1.png", placeholder: "Drop‑off Location", type: "text"},
    { icon: "Clock.png", placeholder: "Drop‑off Date & Time", type: "datetime-local"},
  ];

  return (
    <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start mb-10">
      {fields.map((field, i) => (
        <div
          key={i}
          className="flex items-center border-b border-[#DBDBDB] px-2 py-2 w-full sm:w-60"
        >
          <img src={`/images/${field.icon}`} alt={field.placeholder} className="w-6 h-6" />
          <input
            type={field.type}
            placeholder={field.placeholder}
            className={inputClasses}
          />
        </div>
      ))}
    </div>
  );
};
export default PickupDropForm;