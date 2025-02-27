import React from "react";
import { Metadata } from "next";

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
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
