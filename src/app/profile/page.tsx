"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { getCookie as getNextCookie, deleteCookie } from "cookies-next";
import { Gender, User } from "@/types/user";
import { UpdateUserDto } from "@/types/update-user-dto";

// Cookie yardımcı fonksiyonu
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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    biography: "",
    gender: Gender.PREFER_NOT_TO_SAY,
    profilePhoto: "",
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cinsiyet değerini Türkçe olarak göster
  const getGenderText = (gender: Gender) => {
    switch (gender) {
      case Gender.MALE:
        return "Erkek";
      case Gender.FEMALE:
        return "Kadın";
      case Gender.OTHER:
        return "Diğer";
      case Gender.PREFER_NOT_TO_SAY:
        return "Belirtilmemiş";
      default:
        return "Belirtilmemiş";
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Token kontrolü
        const token = getNextCookie("token");

        if (!token) {
          router.push("/auth/login");
          return;
        }

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

        // Form verilerini kullanıcı bilgileriyle doldur
        setFormData({
          name: userData.name || "",
          surname: userData.surname || "",
          email: userData.email || "",
          biography: userData.biography || "",
          gender: userData.gender || Gender.PREFER_NOT_TO_SAY,
          profilePhoto: userData.profilePhoto || "",
        });

        // Profil fotoğrafı varsa önizleme olarak göster
        if (userData.profilePhoto) {
          setProfilePhotoPreview(userData.profilePhoto);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
        console.error("Profil bilgileri alınırken hata oluştu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      gender: e.target.value as Gender,
    });
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhotoFile(file);

      // Dosyayı önizleme için URL'e dönüştür
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setProfilePhotoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePhoto = async () => {
    if (!profilePhotoFile || !user) return null;

    try {
      const token = getCookie("token");
      if (!token) return null;

      const formData = new FormData();
      formData.append("file", profilePhotoFile);

      const response = await fetch(
        "http://localhost:3001/users/upload-profile-photo",
        {
          method: "POST",
          headers: {
            Authorization: String(token),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Profil fotoğrafı yüklenemedi");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Profil fotoğrafı yükleme hatası:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      const token = getCookie("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      let profilePhotoUrl = null;
      if (profilePhotoFile) {
        profilePhotoUrl = await uploadProfilePhoto();
        console.log(profilePhotoUrl);
      }

      const updateData: UpdateUserDto = {
        ...formData,
        profilePhoto: profilePhotoUrl || user.profilePhoto,
      };

      const response = await fetch(
        `http://localhost:3001/users/ref/${user.refId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: String(token),
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Profil güncellenemedi");
      }

      // Başarılı güncelleme sonrası kullanıcı bilgilerini yeniden çek
      const updatedUserResponse = await fetch(
        "http://localhost:3001/users/me",
        {
          method: "GET",
          headers: {
            Authorization: String(token),
            "Content-Type": "application/json",
          },
        }
      );

      if (updatedUserResponse.ok) {
        const updatedUserData = await updatedUserResponse.json();
        setUser(updatedUserData);
      }

      // Düzenleme modunu kapat
      setIsEditing(false);
      setSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      console.error("Profil güncelleme hatası:", err);
      setSaving(false);
    }
  };

  // Pasaport numarası oluştur (kullanıcı adından hash)
  const generatePassportNumber = (username: string) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(9, "0");
  };

  // Pasaport için rastgele tarih oluştur
  const generateRandomDate = () => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setFullYear(today.getFullYear() + 10);

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    const expDay = String(futureDate.getDate()).padStart(2, "0");
    const expMonth = String(futureDate.getMonth() + 1).padStart(2, "0");
    const expYear = futureDate.getFullYear();

    return {
      issueDate: `${day}.${month}.${year}`,
      expiryDate: `${expDay}.${expMonth}.${expYear}`,
    };
  };

  const dates = generateRandomDate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Overthinkistan Cumhuriyeti Pasaportu
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : user ? (
        isEditing ? (
          // Düzenleme Modu
          <form onSubmit={handleSubmit}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
              {/* Pasaport Üst Kısım */}
              <div className="bg-blue-900 p-4 text-white flex justify-between items-center">
                <div>
                  <h2>Dijital Pasaport</h2>
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={saving}
                    className="mr-2"
                  >
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    İptal
                  </Button>
                </div>
              </div>

              {/* Pasaport İçerik */}
              <div className="p-6 bg-white">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Sol Taraf - Fotoğraf ve Temel Bilgiler */}
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div
                      className="w-40 h-48 bg-gray-100 border-2 border-gray-300 mb-4 overflow-hidden rounded relative cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {profilePhotoPreview ? (
                        <img
                          src={profilePhotoPreview}
                          alt="Profil Fotoğrafı"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-gray-400"
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
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-medium">
                          Fotoğraf Değiştir
                        </span>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfilePhotoChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Pasaport No</p>
                      <p className="font-mono font-bold text-blue-800">
                        {generatePassportNumber(user.username)}
                      </p>
                    </div>
                  </div>

                  {/* Sağ Taraf - Detaylı Bilgiler */}
                  <div className="md:w-2/3 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          Ad
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          Soyad
                        </label>
                        <input
                          type="text"
                          name="surname"
                          value={formData.surname}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          Kullanıcı Adı
                        </label>
                        <p className="font-semibold text-gray-800 p-2 bg-gray-100 rounded">
                          {user.username}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Cinsiyet</p>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gender: e.target.value as Gender,
                            })
                          }
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        >
                          <option value={Gender.MALE}>Erkek</option>
                          <option value={Gender.FEMALE}>Kadın</option>
                          <option value={Gender.OTHER}>Diğer</option>
                          <option value={Gender.PREFER_NOT_TO_SAY}>
                            Belirtilmemiş
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        E-posta
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        Biyografi
                      </label>
                      <textarea
                        name="biography"
                        value={formData.biography}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-xs text-gray-500">Takipçi</p>
                        <p className="font-bold text-blue-800">
                          {user.followersCount}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-xs text-gray-500">Takip</p>
                        <p className="font-bold text-blue-800">
                          {user.followingCount}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-xs text-gray-500">Gönderi</p>
                        <p className="font-bold text-blue-800">
                          {user.postCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pasaport Alt Kısım */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-500">
                  <div>
                    <p>Veriliş Tarihi: {dates.issueDate}</p>
                    <p>Son Geçerlilik: {dates.expiryDate}</p>
                  </div>
                  <div className="text-right">
                    <p>Rol: {user.role === "user" ? "Vatandaş" : user.role}</p>
                    <p>Overthinkistan Cumhuriyeti</p>
                  </div>
                </div>
              </div>

              {/* Pasaport Alt Şerit */}
              <div className="h-8 bg-gradient-to-r from-blue-600 to-blue-800"></div>
            </div>
          </form>
        ) : (
          // Görüntüleme Modu
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
            {/* Pasaport Üst Kısım */}
            <div className="bg-blue-900 p-4 text-white flex justify-between items-center">
              <div>
                <h2>Dijital Pasaport</h2>
              </div>
            </div>

            {/* Pasaport İçerik */}
            <div className="p-6 bg-white">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Sol Taraf - Fotoğraf ve Temel Bilgiler */}
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="w-40 h-48 bg-gray-100 border-2 border-gray-300 mb-4 overflow-hidden rounded">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto || "/default-profile.png"}
                        alt={`${user.name} ${user.surname}`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-gray-400"
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
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Pasaport No</p>
                    <p className="font-mono font-bold text-blue-800">
                      {generatePassportNumber(user.username)}
                    </p>
                  </div>
                </div>

                {/* Sağ Taraf - Detaylı Bilgiler */}
                <div className="md:w-2/3 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Ad</p>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Soyad</p>
                      <p className="font-semibold text-gray-800">
                        {user.surname}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Kullanıcı Adı</p>
                      <p className="font-semibold text-gray-800">
                        {user.username}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cinsiyet</p>
                      <p className="font-semibold text-gray-800">
                        {getGenderText(user.gender)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">E-posta</p>
                    <p className="font-semibold text-gray-800">{user.email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Biyografi</p>
                    <p className="text-gray-800">
                      {user.biography || "Henüz biyografi eklenmemiş."}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-xs text-gray-500">Takipçi</p>
                      <p className="font-bold text-blue-800">
                        {user.followersCount}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-xs text-gray-500">Takip</p>
                      <p className="font-bold text-blue-800">
                        {user.followingCount}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-xs text-gray-500">Gönderi</p>
                      <p className="font-bold text-blue-800">
                        {user.postCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pasaport Alt Kısım */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-500">
                <div>
                  <p>Veriliş Tarihi: {dates.issueDate}</p>
                  <p>Son Geçerlilik: {dates.expiryDate}</p>
                </div>
                <div className="text-right">
                  <p>Rol: {user.role === "user" ? "Vatandaş" : user.role}</p>
                  <p>Overthinkistan Cumhuriyeti</p>
                </div>
              </div>
            </div>

            {/* Pasaport Alt Şerit */}
            <div className="h-8 bg-gradient-to-r from-blue-600 to-blue-800"></div>
          </div>
        )
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Kullanıcı bilgileri bulunamadı.</p>
        </div>
      )}

      {!isEditing && user && (
        <div className="mt-8 flex justify-center">
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Profili Düzenle
          </Button>
        </div>
      )}
    </div>
  );
}
