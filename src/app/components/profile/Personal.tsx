// File: src/app/personal/page.tsx
"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import Inputs from "../ui/Inputs";

export default function PersonalPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    zip: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted ✅", formData);
  };

  return (
    <div className="mt-6 max-w-[1176px] min-h-[519px] w-full">
      <h3 className="text-[22px] font-semibold text-[#3DBEC8] mb-4">
        Personal Info
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid mt-[30px] grid-cols-2 gap-4 text-sm text-gray-700"
      >
        {/* First Name */}
        <div>
          <label className="text-lg text-[#040401] font-medium">
            First Name
          </label>
          <Inputs
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border-b border-[#DBDBDB] mt-[0px] outline-none"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="text-lg text-[#040401] font-medium">
            Last Name
          </label>
          <Inputs
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border-b border-[#DBDBDB] outline-none"
          />
        </div>

        {/* Email */}
        <div className="mt-[40px]">
          <label className="text-lg text-[#040401] font-medium">
            Email Address
          </label>
          <Inputs
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-b border-[#DBDBDB] outline-none"
          />
        </div>

        {/* Phone */}
        <div className="mt-[40px]">
          <label className="text-lg text-[#040401] font-medium">
            Phone Number
          </label>
          <Inputs
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border-b border-[#DBDBDB] outline-none"
          />
        </div>

        {/* City */}
        <div className="mt-[40px]">
          <label className="text-lg text-[#040401] font-medium">
            City
          </label>
          <Inputs
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border-b border-[#DBDBDB] outline-none"
          />
        </div>

        {/* Zip */}
        <div className="mt-[40px]">
          <label className="text-lg text-[#040401] font-medium">
            Zip Code
          </label>
          <Inputs
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            className="w-full border-b border-[#DBDBDB] outline-none"
          />
        </div>

        {/* Address */}
        <div className="col-span-2 mt-[40px]">
          <label className="text-lg text-[#040401] font-medium">
            Address
          </label>
          <Inputs
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border-b border-[#DBDBDB] outline-none"
          />
        </div>

        {/* Button */}
        <div className="col-span-2 flex justify-end mt-6">
          <Button label="Save Info" size="md" type="submit" />
        </div>
      </form>
    </div>
  );
}
