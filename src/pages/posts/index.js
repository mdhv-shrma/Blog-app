import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch("/api/posts/getPost");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    getPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 dark:text-white mb-12">
          📚 All Blog Posts
        </h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
            No posts found. Please check back later.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post._id} href={`/posts/${post.slug}`} passHref>
                <div className="group border rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  {/* Post Image */}
                  <div className="relative w-full h-52">
                    <Image
                      src={post.image || "/vercel.png"} // Use default image if none is provided
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  {/* Post Content */}
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {post.description || "Read more about this post..."}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      By: {post.author?.name || "Unknown Author"} {/* Fallback for undefined author */}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
