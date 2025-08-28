"use client";

import React from "react";

interface InputProps {
  name: string;
  type: string;
  value?: string;
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  className = "",
}: InputProps) {
  return (
    <div className="flex flex-col space-y-1">
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full rounded-lg py-2 focus:outline-none ${className}`}
      />
    </div>
  );
}
