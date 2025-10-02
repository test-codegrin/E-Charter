"use client";

import React, { forwardRef } from "react";

interface InputProps {
  name: string;
  type: string;
  value?: string;
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  autoFocus?: boolean;
  min?: string;
  max?: string;
  disabled?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur=()=>{},
  required,
  autoFocus,
  className = "",
  min,
  max,
  disabled,
}, ref) => {
  return (
    <div className="flex flex-col space-y-1">
      <input
        id={name}
        name={name}
        ref={ref}
        type={type}
        min={min}
        max={max}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoFocus={autoFocus}
        required={required}
        className={`w-full rounded-lg py-2 focus:outline-none leading-none border-none bg-transparent ${className}`}
      />
    </div>
  );
});

Input.displayName = "Input";

export default Input;
