import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function FeedPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchFeedPosts = async () => {
        try {
          const res = await fetch(`/api/posts/feed?userId=${session.user.id}`);
          const data = await res.json();
          setPosts(data.posts || []);
        } catch (error) {
          console.error("Error fetching feed posts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchFeedPosts();
    }
  }, [session]);

  if (status === "loading" || loading) {
    return <p className="text-center mt-10 text-xl text-gray-600">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center mt-10 text-xl text-gray-600">Please log in to view your feed.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center">
          Your Feed
        </h2>
        {posts.length === 0 ? (
          <p className="text-gray-600 text-center">No posts to display. Follow users to see their posts here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post._id} href={`/posts/${post.slug}`} passHref>
                <div className="group border rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  {/* Post Image */}
                  <div className="relative w-full h-52">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  {/* Post Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {post.title}
                    </h3>
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
