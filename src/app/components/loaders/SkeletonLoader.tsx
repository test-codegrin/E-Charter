"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: "text" | "circular" | "rectangular";
  animation?: "pulse" | "shimmer" | "none";
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  style,
  variant = "text",
  animation = "pulse"
}) => {
  const variantClass = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg"
  }[variant];

  const animationClass = {
    pulse: "animate-pulse",
    shimmer: "animate-shimmer",
    none: ""
  }[animation];

  return (
    <div
      className={`
        bg-gray-200
        ${variantClass}
        ${animationClass}
        ${className}
      `}
      style={style}
    />
  );
};

export default Skeleton;
