"use client";

import React, { useState } from "react";
import Inputs from "../ui/Inputs";

const inputClasses =
  "ml-3 w-[300px] bg-transparent focus:border-[#3DC1C4] focus:outline-none font-semibold text-sm text-[#9C9C9C]";

const PickupDropForm = () => {
  // Manage form state
  const [formData, setFormData] = useState({
    pickupLocation: "",
    pickupDateTime: "",
    dropoffLocation: "",
    dropoffDateTime: "",
  });

  const fields = [
    {
      key: "pickupLocation",
      icon: "Mask group1.png",
      placeholder: "Pickup Location",
      type: "text",
    },
    {
      key: "pickupDateTime",
      icon: "Clock.png",
      placeholder: "Pick-Up Date & Time",
      type: "datetime-local",
    },
    {
      key: "dropoffLocation",
      icon: "Mask group1.png",
      placeholder: "Drop-off Location",
      type: "text",
    },
    {
      key: "dropoffDateTime",
      icon: "Clock.png",
      placeholder: "Drop-off Date & Time",
      type: "datetime-local",
    },
  ];

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  return (
    <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start mb-10">
      {fields.map((field, i) => (
        <div
          key={i}
          className="flex items-center border-b border-[#DBDBDB] px-2 py-2 w-full sm:w-60"
        >
          <img
            src={`/images/${field.icon}`}
            alt={field.placeholder}
            className="w-6 h-6"
          />
          <Inputs
            name={field.key}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.key as keyof typeof formData]}
            onChange={(e) => handleChange(e, field.key)}
            className={inputClasses}
          />
        </div>
      ))}
    </div>
  );
};

export default PickupDropForm;
