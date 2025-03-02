"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { Gender, User } from "@/types/user";
import Image from "next/image";
import { FaLayerGroup } from "react-icons/fa";
import CategoryPopup from "@/components/common/CategoryPopup";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${name}=; max-age=0; path=/;`;
};

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    // Token cookie kontrolü
    const token = getCookie("token");
    setIsLoggedIn(!!token);

    if (token) {
      const fetchUserData = async () => {
        setLoading(true);
        const response = await fetch("http://localhost:3001/users/me", {
          method: "GET",
          headers: {
            Authorization: String(token),
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Kullanıcı bilgileri alınamadı");
        }

        const userData = await response.json();

        setUser(userData);
        setLoading(false);
      };
      fetchUserData();
    }
  }, []);

  const handleSaveCategories = (categories: string[]) => {
    setSelectedCategories(categories);
  };
  const handleCancelCategories = () => {
    setSelectedCategories([]);
    setIsCategoryPopupOpen(false);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sol Sidebar - Profil ve Ayarlar */}
          <aside className="w-full lg:w-1/4 bg-white dark:bg-card-dark rounded-lg shadow-md p-6 h-fit sticky top-8 transition-colors duration-200">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-softBg-light dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center transition-colors duration-200">
                {user?.profilePhoto ? (
                  <Image
                    src={user.profilePhoto}
                    alt="Profil Fotoğrafı"
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-500 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <h2 className="text-xl font-semibold text-text-light dark:text-text-dark transition-colors duration-200">
                {user?.name} {user?.surname}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                {user?.biography}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-text-light dark:text-text-dark border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
                Menü
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="flex items-center text-text-light dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Ana Sayfa
                  </a>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="flex items-center text-text-light dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profil
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-text-light dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Hikayelerim
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-text-light dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    Mesajlar
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="font-medium text-text-light dark:text-text-dark border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
                Kategoriler
              </h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <a
                    href="#"
                    className="text-text-light dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    Günlük Yaşam
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-text-light dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    Mizah
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-text-light dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    Kişisel Gelişim
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-text-light dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    İlişkiler
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-text-light dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    Teknoloji
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          {/* Orta Alan - Gönderiler ve Makaleler */}
          <div className="w-full lg:w-2/4 space-y-6">
            {/* Gönderi Oluşturma Alanı */}
            <div className="bg-white dark:bg-card-dark rounded-lg shadow-md p-6 transition-colors duration-200">
              <h2 className="text-lg font-semibold ml-2 mb-4 text-text-light dark:text-text-dark transition-colors duration-200">
                Ne Hakkında Konuşmak İstiyorsunuz?
              </h2>
              <textarea
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent transition-colors duration-200"
                placeholder="Düşüncelerini paylaş..."
                rows={3}
              ></textarea>
              <div className="mt-3 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="text-gray-500 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button className="text-gray-500 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsCategoryPopupOpen(true)}
                    className="text-gray-500 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 relative"
                    title="Kategoriler"
                  >
                    <FaLayerGroup className="h-6 w-6" />
                    {selectedCategories.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary-light dark:bg-primary-dark text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedCategories.length}
                      </span>
                    )}
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary-light dark:text-primary-dark rounded border-gray-300 dark:border-gray-600 focus:ring-primary-light dark:focus:ring-primary-dark transition-colors duration-200"
                    />
                    <span className="ml-2 text-sm text-text-light dark:text-gray-300 transition-colors duration-200">
                      Anonim olarak paylaş
                    </span>
                  </label>
                  <Button variant="primary" size="sm" className="rounded-full">
                    Gönderi Yayınla
                  </Button>
                </div>
              </div>
            </div>

            {/* Kategori Popup */}
            <CategoryPopup
              isOpen={isCategoryPopupOpen}
              onClose={() => {
                setIsCategoryPopupOpen(false);
              }}
              onSave={handleSaveCategories}
              onCancel={handleCancelCategories}
            />

            {/* Gönderiler */}
            {[1, 2, 3, 4, 5].map((post) => (
              <div
                key={post}
                className="bg-white dark:bg-card-dark rounded-lg shadow-md p-6 transition-colors duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-softBg-light dark:bg-gray-700 mr-3 flex items-center justify-center transition-colors duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500 dark:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-text-light dark:text-text-dark transition-colors duration-200">
                      Anonim Kullanıcı
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
                      3 saat önce
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-text-light dark:text-text-dark transition-colors duration-200">
                    Bugün hayatımda ilk kez bir şeyi başardığımda, kendimi övmek
                    yerine "neden daha önce yapmadım" diye düşündüm.
                    Overthinking'in en güzel örneği...
                  </p>
                </div>
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors duration-200">
                  <button className="flex items-center space-x-1 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>23</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>7</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    <span>Paylaş</span>
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-8">
              <Button variant="secondary" size="md">
                Daha Fazla Göster
              </Button>
            </div>
          </div>

          {/* Sağ Sidebar - Popüler Konular */}
          <aside className="w-full lg:w-1/4 space-y-6 h-fit sticky top-8">
            <div className="bg-white dark:bg-card-dark rounded-lg shadow-md p-6 transition-colors duration-200">
              <h2 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark transition-colors duration-200">
                Popüler Konular
              </h2>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((topic) => (
                  <li
                    key={topic}
                    className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0 transition-colors duration-200"
                  >
                    <a
                      href="#"
                      className="block hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                    >
                      <h3 className="font-medium text-text-light dark:text-text-dark transition-colors duration-200">
                        Overthinking ile nasıl başa çıkılır?
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-200">
                        32 yorum • 128 beğeni
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-card-dark rounded-lg shadow-md p-6 transition-colors duration-200">
              <h2 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark transition-colors duration-200">
                Yeni Açılan Konular
              </h2>
              <ul className="space-y-4">
                {[1, 2, 3].map((topic) => (
                  <li
                    key={topic}
                    className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0 transition-colors duration-200"
                  >
                    <a
                      href="#"
                      className="block hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                    >
                      <h3 className="font-medium text-text-light dark:text-text-dark transition-colors duration-200">
                        Zihin karmaşası yaşayanlar için öneriler
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-200">
                        5 dakika önce
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="text-primary-light dark:text-primary-dark hover:text-primary-light/80 dark:hover:text-primary-dark/80 text-sm font-medium mt-4 inline-block transition-colors duration-200"
              >
                Tüm konuları gör →
              </a>
            </div>

            <div className="bg-white dark:bg-card-dark rounded-lg shadow-md p-6 transition-colors duration-200">
              <h2 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark transition-colors duration-200">
                Günün Quizi
              </h2>
              <p className="text-text-light dark:text-gray-300 mb-3 transition-colors duration-200">
                Hangi overthinking tipine sahipsin?
              </p>
              <Button variant="primary" size="sm" className="w-full">
                Quizi Çöz
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
