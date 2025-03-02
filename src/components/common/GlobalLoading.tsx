"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { FaBrain } from "react-icons/fa";

export default function GlobalLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // URL değişikliklerini izle
  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);

      // 500ms sonra loading'i kapat
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    };

    handleRouteChange();
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm loading-overlay">
      <div className="text-center">
        <div className="inline-block">
          <FaBrain className="text-6xl text-blue-600 dark:text-blue-400 brain-rotate" />
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-white loading-text">
          Overthinkistan'a Yolculuk...
        </p>
      </div>
    </div>
  );
}
