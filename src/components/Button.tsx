import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseClasses = "btn";

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger:
      "bg-danger text-white hover:bg-danger/90 focus:ring-danger/50 transition-colors duration-200",
    accent:
      "bg-accent-light dark:bg-accent-dark text-white hover:bg-accent-light/90 dark:hover:bg-accent-dark/90 focus:ring-accent-light/50 dark:focus:ring-accent-dark/50 transition-colors duration-200",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${
    sizeClasses[size]
  } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
