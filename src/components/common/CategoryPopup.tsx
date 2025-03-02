"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

interface Category {
  _id: string;
  name: string;
  description: string;
  refid: string;
  createdAt: string;
  updatedAt: string;
  datastatus: number;
}

interface CategoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedCategories: string[]) => void;
}

export default function CategoryPopup({
  isOpen,
  onClose,
  onSave,
}: CategoryPopupProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/categories");
      if (!response.ok) {
        throw new Error("Kategoriler yüklenemedi");
      }
      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = () => {
    onSave(selectedCategories);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={popupRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 m-4 transform transition-all duration-300 ease-in-out"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Kategoriler
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Makaleniz için uygun kategorileri seçin. Birden fazla kategori
          seçebilirsiniz.
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light dark:border-primary-dark"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6 max-h-60 overflow-y-auto pr-2">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() => toggleCategory(category._id)}
                className={`
                  flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    selectedCategories.includes(category._id)
                      ? "bg-primary-light/10 dark:bg-primary-dark/20 border-primary-light dark:border-primary-dark"
                      : "bg-gray-100 dark:bg-gray-700 border-transparent"
                  }
                  border-2 hover:shadow-md
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded-md mr-2 flex items-center justify-center
                    ${
                      selectedCategories.includes(category._id)
                        ? "bg-primary-light dark:bg-primary-dark"
                        : "bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500"
                    }
                  `}
                >
                  {selectedCategories.includes(category._id) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-gray-800 dark:text-gray-200">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={selectedCategories.length === 0}
            className={`
              px-4 py-2 rounded-lg text-white transition-colors
              ${
                selectedCategories.length > 0
                  ? "bg-primary-light dark:bg-primary-dark hover:bg-primary-light/90 dark:hover:bg-primary-dark/90"
                  : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              }
            `}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
