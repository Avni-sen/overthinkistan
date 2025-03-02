"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { Gender, User } from "@/types/user";
import Image from "next/image";
import { FaLayerGroup } from "react-icons/fa";
import CategoryPopup from "@/components/common/CategoryPopup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Posts from "@/components/Posts";

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
  const [postContent, setPostContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [postPhoto, setPostPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [refreshPosts, setRefreshPosts] = useState(0);

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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      toast.error("Lütfen gönderi içeriği giriniz.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    setIsLoading(true);
    try {
      let photoUrl = "";

      if (postPhoto) {
        const formData = new FormData();
        formData.append("file", postPhoto);

        const photoResponse = await fetch(
          "http://localhost:3001/posts/upload-post-photo",
          {
            method: "POST",
            headers: {
              Authorization: String(getCookie("token")),
            },
            body: formData,
          }
        );

        if (!photoResponse.ok) {
          throw new Error("Fotoğraf yüklenemedi");
        }

        const photoData = await photoResponse.json();
        photoUrl = photoData.url;
      }

      const postData = {
        content: postContent,
        categoryRefIds: selectedCategories,
        isAnonymous,
        photoUrl: photoUrl || undefined,
      };

      const response = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: String(getCookie("token")),
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Gönderi oluşturulamadı");
      }

      setPostContent("");
      setIsAnonymous(false);
      setPostPhoto(null);
      setPreviewUrl(null);
      setSelectedCategories([]);
      setRefreshPosts((prev) => prev + 1);

      toast.success("Gönderi başarıyla oluşturuldu!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error("Post oluşturma hatası:", error);
      toast.error(
        "Gönderi oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
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
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              ></textarea>

              {/* Fotoğraf Önizleme */}
              {previewUrl && (
                <div className="relative mt-3">
                  <img
                    src={previewUrl}
                    alt="Gönderi fotoğrafı önizleme"
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setPostPhoto(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <div className="mt-3 flex justify-between items-center">
                <div className="flex space-x-2">
                  <label className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
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
                  </label>
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
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-text-light dark:text-gray-300 transition-colors duration-200">
                      Anonim olarak paylaş
                    </span>
                  </label>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full"
                    onClick={handleCreatePost}
                    disabled={isLoading}
                  >
                    {isLoading ? "Yükleniyor..." : "Gönderi Yayınla"}
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
            <Posts refresh={refreshPosts} />
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
