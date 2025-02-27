import React from "react";
import Link from "next/link";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <Link href="/" className={`font-bold ${sizeClasses[size]} ${className}`}>
      <span className="text-primary-light dark:text-primary-dark transition-colors duration-200">
        Over
      </span>
      <span className="text-slate-700 dark:text-gray-100 transition-colors duration-200">
        thinkistan
      </span>
    </Link>
  );
}
