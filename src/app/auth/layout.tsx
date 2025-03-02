import React from "react";
import { Metadata } from "next";
import ThemeToggle from "@/components/common/ThemeToggle";
import Logo from "@/components/common/Logo";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Overthinkistan - Giriş & Kayıt",
  description:
    "Overthinkistan platformuna giriş yapın veya yeni bir hesap oluşturun.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.className} min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200`}
    >
      <ThemeProvider>
        <main className="flex-grow">{children}</main>
      </ThemeProvider>
    </div>
  );
}
