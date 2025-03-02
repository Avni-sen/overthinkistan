"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";
import Button from "@/components/Button";
import { getCookie, deleteCookie } from "cookies-next";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login veya register sayfalarında olup olmadığımızı kontrol et
  const isAuthPage = pathname?.includes("/auth/");

  useEffect(() => {
    // Token kontrolü
    const token = getCookie("token");
    setIsLoggedIn(!!token);
  }, [pathname]); // pathname değiştiğinde token kontrolünü tekrar yap

  const handleLogout = () => {
    deleteCookie("token");
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  return (
    <header className="bg-white dark:bg-card-dark shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Logo size="md" />
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isLoggedIn && !isAuthPage ? (
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="danger" onClick={handleLogout}>
                Çıkış Yap
              </Button>
            </div>
          ) : !isAuthPage && !isLoggedIn ? (
            <Button
              variant="primary"
              onClick={() => router.push("/auth/login")}
            >
              Giriş Yap
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
