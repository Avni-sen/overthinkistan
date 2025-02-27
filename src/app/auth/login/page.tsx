"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/Button";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "E-posta adresi gereklidir";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }

    if (!formData.password) {
      newErrors.password = "Şifre gereklidir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Burada gerçek API çağrısı yapılacak
      console.log("Giriş yapılıyor:", formData);

      // Simüle edilmiş API gecikmesi
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Başarılı giriş sonrası yönlendirme
      window.location.href = "/";
    } catch (error) {
      console.error("Giriş hatası:", error);
      setErrors({
        form: "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Hesabınıza Giriş Yapın"
      subtitle="Overthinkistan'a hoş geldiniz"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {errors.form && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm transition-colors duration-200">
            {errors.form}
          </div>
        )}

        <Input
          id="email"
          name="email"
          type="email"
          label="E-posta Adresi"
          placeholder="E-posta Adresi"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Şifre"
          placeholder="Şifre"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark border-gray-300 dark:border-gray-600 rounded transition-colors duration-200"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-text-light dark:text-text-dark transition-colors duration-200"
            >
              Beni hatırla
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-primary-light dark:text-primary-dark hover:text-primary-light/80 dark:hover:text-primary-dark/80 transition-colors duration-200"
            >
              Şifrenizi mi unuttunuz?
            </Link>
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700 transition-colors duration-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Veya
            </span>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-center text-sm text-text-light dark:text-text-dark transition-colors duration-200">
            Hesabınız yok mu?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary-light dark:text-primary-dark hover:text-primary-light/80 dark:hover:text-primary-dark/80 transition-colors duration-200"
            >
              Hemen kaydolun
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
