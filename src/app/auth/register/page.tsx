"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/Button";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAndConditions: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "Ad Soyad gereklidir";
    }

    if (!formData.username) {
      newErrors.username = "Kullanıcı adı gereklidir";
    }

    if (!formData.surname) {
      newErrors.surname = "Soyad gereklidir";
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

    if (!formData.termsAndConditions) {
      newErrors.termsAndConditions = "Kullanım şartlarını kabul etmelisiniz";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          termsAndConditions: formData.termsAndConditions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kayıt işlemi başarısız oldu");
      }
      // Başarılı kayıt sonrası anasayfaya yönlendirme
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "Kayıt yapılamadı. Lütfen bilgilerinizi kontrol edin.",
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
          label="Ad"
          autoComplete="name"
          placeholder="Ad"
          required
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <Input
          id="surname"
          name="surname"
          type="text"
          label="Soyad"
          autoComplete="surname"
          placeholder="Soyad"
          required
          value={formData.surname}
          onChange={handleChange}
          error={errors.surname}
        />

        <Input
          id="username"
          name="username"
          type="text"
          label="Username"
          autoComplete="username"
          placeholder="Username"
          required
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
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
            id="termsAndConditions"
            name="termsAndConditions"
            type="checkbox"
            className="h-4 w-4 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark border-gray-300 dark:border-gray-600 rounded transition-colors duration-200"
            checked={formData.termsAndConditions}
            onChange={handleChange}
            required
          />
          <label
            htmlFor="termsAndConditions"
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
        {errors.termsAndConditions && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.termsAndConditions}
          </p>
        )}

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
