import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "react-toastify";

interface Category {
  refId: string;
  name: string;
  description?: string;
}

interface User {
  refId: string;
  username: string;
  profilePhotoUrl?: string;
}

interface Post {
  refId: string;
  content: string;
  imageUrl?: string;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  viewCount: number;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  user?: User | null;
}

interface PostsProps {
  refresh?: number;
}

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

export default function Posts({ refresh = 0 }: PostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/posts/get-all-posts-with-relations",
        {
          headers: {
            Authorization: String(getCookie("token")),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gönderiler alınamadı");
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Posts fetch error:", error);
      toast.error("Gönderiler yüklenirken bir hata oluştu.", {
        position: "top-right",
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refresh]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((skeleton) => (
          <div
            key={skeleton}
            className="bg-white dark:bg-card-dark rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.refId}
          className="bg-white dark:bg-card-dark rounded-lg shadow-md p-6 transition-colors duration-200"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-softBg-light dark:bg-gray-700 mr-3 flex items-center justify-center overflow-hidden transition-colors duration-200">
              {post.isAnonymous ? (
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
              ) : post.user?.profilePhotoUrl ? (
                <Image
                  src={post.user.profilePhotoUrl}
                  alt="Profil Fotoğrafı"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
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
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-text-light dark:text-text-dark transition-colors duration-200">
                {post.isAnonymous
                  ? "Anonim Kullanıcı"
                  : post.user?.username || "Kullanıcı"}
              </h3>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
                <span>
                  {format(new Date(post.createdAt), "d MMMM yyyy HH:mm", {
                    locale: tr,
                  })}
                </span>
                <span className="mx-2">•</span>
                <span>{post.viewCount} görüntülenme</span>
                {post.categories.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span>
                      {post.categories.map((cat) => cat.name).join(", ")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-text-light dark:text-text-dark transition-colors duration-200">
              {post.content}
            </p>
            {post.imageUrl && (
              <div className="mt-3">
                <Image
                  src={post.imageUrl}
                  alt="Gönderi fotoğrafı"
                  width={600}
                  height={400}
                  className="rounded-lg w-full object-contain max-h-96"
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors duration-200">
            <div className="flex items-center space-x-4">
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
                <span>{post.likeCount}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200">
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
                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                    transform="rotate(180 12 12)"
                  />
                </svg>
                <span>{post.dislikeCount}</span>
              </button>
            </div>
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
              <span>{post.commentCount}</span>
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
    </div>
  );
}
