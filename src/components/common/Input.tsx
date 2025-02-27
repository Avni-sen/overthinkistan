import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
  placeholder?: string;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  placeholder = "",
  ...props
}: InputProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text-light dark:text-text-dark mb-1 transition-colors duration-200"
      >
        {label}
      </label>
      <input
        id={id}
        className={`appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
        placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-text-light dark:text-text-dark
        focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark 
        sm:text-sm transition-colors duration-200 ${
          error ? "border-red-500 dark:border-red-600" : ""
        } ${className}`}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
