import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch("/api/getPost");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    getPosts();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        All Blog Posts
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/posts/${post.slug}`}>
            <div className="border rounded-lg shadow hover:shadow-lg cursor-pointer overflow-hidden bg-white dark:bg-gray-800 transition-all duration-200">
              <div className="relative w-full h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {post.title}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
