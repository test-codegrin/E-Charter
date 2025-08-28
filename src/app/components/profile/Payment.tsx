// File: src/app/payment/page.tsx
"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import Inputs from "../ui/Inputs";

export default function PaymentPage() {
  const [formData, setFormData] = useState({
    creditCard: "",
    bankTransfer: "",
    digitalWallet: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Payment Data Submitted ✅", formData);
  };

  return (
    <div className="mt-6 max-w-[1176px] min-h-[450px] w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[22px] font-semibold text-[#3DBEC8] mb-4">
          Payment Method
        </h3>

        <div className="bg-[#3DBEC8] w-[261px] h-[52px] rounded-full flex items-center justify-center">
          <Button
            label="Add Payment Method"
            variant="primary"
            size="lg"
            className="bg-transparent hover:bg-transparent text-white font-bold"
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="gap-4 text-sm text-gray-700">
        {/* Credit Card */}
        <div className="col-span-2 mt-[16px]">
          <label className="text-lg font-medium">Credit Card</label>
          <Inputs
            type="text"
            name="creditCard"
            value={formData.creditCard}
            onChange={handleChange}
            placeholder="**** **** **** 9988"
            className="w-full pb-[16px] border-b border-[#DBDBDB] mt-[15px] outline-none"
          />
        </div>

        {/* Bank Transfer */}
        <div className="mt-[30px]">
          <label className="text-lg font-medium">Bank Transfer</label>
          <Inputs
            type="text"
            name="bankTransfer"
            value={formData.bankTransfer}
            onChange={handleChange}
            placeholder="Chase Bank ****1234"
            className="w-full pb-[16px] border-b border-[#DBDBDB] mt-[15px] outline-none"
          />
        </div>

        {/* Digital Wallet */}
        <div className="mt-[30px]">
          <label className="text-lg font-medium">Digital Wallet</label>
          <Inputs
            type="text"
            name="digitalWallet"
            value={formData.digitalWallet}
            onChange={handleChange}
            placeholder="PayPal, Apple Pay"
            className="w-full pb-[16px] border-b border-[#DBDBDB] mt-[15px] outline-none"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button label="Save" size="md" type="submit" />
        </div>
      </form>
    </div>
  );
}
