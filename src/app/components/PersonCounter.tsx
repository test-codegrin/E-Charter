"use client";

import React from "react";

interface PersonCounterProps {
  value?: number;
  onChange: (newValue: number) => void;
}

const PersonCounter: React.FC<PersonCounterProps> = ({ value = 1, onChange }) => {
  const inc = () => onChange(value + 1);
  const dec = () => onChange(Math.max(1, value - 1));

  return (
    <div className="flex items-center border border-[#E5E5E5] rounded-full px-3 py-1 gap-3 w-fit mt-[10px] md:mt-[0] select-none">
      <p>Person</p>
      <button
        onClick={dec}
        className="w-6 h-6 cursor-pointer flex items-center justify-center bg-[#3DBEC8] rounded-full text-white"
      >
        <i className="fa-solid fa-minus text-xs" />
      </button>
      <span className="text-sm font-semibold">{value}</span>
      <button
        onClick={inc}
        className="w-6 h-6 cursor-pointer flex items-center justify-center bg-[#3DBEC8] rounded-full text-white"
      >
        <i className="fa-solid fa-plus text-xs" />
      </button>
    </div>
  );
};

export default PersonCounter;
