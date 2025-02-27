"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/Button";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "Ad Soyad gereklidir";
    }

    if (!formData.email) {
      newErrors.email = "E-posta adresi gereklidir";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }

    if (!formData.password) {
      newErrors.password = "Şifre gereklidir";
    } else if (formData.password.length < 8) {
      newErrors.password = "Şifre en az 8 karakter olmalıdır";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
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
      console.log("Kayıt yapılıyor:", formData);

      // Simüle edilmiş API gecikmesi
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Başarılı kayıt sonrası yönlendirme
      window.location.href = "/auth/login?registered=true";
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setErrors({
        form: "Kayıt yapılamadı. Lütfen bilgilerinizi kontrol edin.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Yeni Hesap Oluşturun"
      subtitle="Overthinkistan'a katılın ve deneyiminizi paylaşın"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {errors.form && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm transition-colors duration-200">
            {errors.form}
          </div>
        )}

        <Input
          id="name"
          name="name"
          type="text"
          label="Ad Soyad"
          autoComplete="name"
          placeholder="Ad Soyad"
          required
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

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
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Şifre Tekrar"
          placeholder="Şifre Tekrar"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark border-gray-300 dark:border-gray-600 rounded transition-colors duration-200"
            required
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-text-light dark:text-text-dark transition-colors duration-200"
          >
            <span>
              <Link
                href="/terms"
                className="text-primary-light dark:text-primary-dark hover:text-primary-light/80 dark:hover:text-primary-dark/80 transition-colors duration-200"
              >
                Kullanım Şartları
              </Link>{" "}
              ve{" "}
              <Link
                href="/privacy"
                className="text-primary-light dark:text-primary-dark hover:text-primary-light/80 dark:hover:text-primary-dark/80 transition-colors duration-200"
              >
                Gizlilik Politikası
              </Link>
              'nı kabul ediyorum
            </span>
          </label>
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
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
            Zaten hesabınız var mı?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary-light dark:text-primary-dark hover:text-primary-light/80 dark:hover:text-primary-dark/80 transition-colors duration-200"
            >
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
