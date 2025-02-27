import React from "react";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-text-light dark:text-text-dark transition-colors duration-200">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-card-dark py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-200">
          {children}
        </div>
      </div>
    </div>
  );
}
