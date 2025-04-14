import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      const fetchUserPosts = async () => {
        try {
          const res = await fetch(`/api/posts/byAuthor?author=${encodeURIComponent(session.user.name)}`);
          const data = await res.json();
          setPosts(data.posts);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      };

      fetchUserPosts();
    }
  }, [session]);

  if (status === "loading") {
    return <p className="text-center mt-10 text-xl text-gray-600">Loading...</p>;
  }

  if (!session) {
    return null; // Prevent rendering if not authenticated
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
        Profile
      </h2>
      <div className="space-y-4 mb-8">
        <p>
          <strong>Name:</strong> {session.user.name}
        </p>
        <p>
          <strong>Email:</strong> {session.user.email}
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-4">Your Posts:</h3>
      {posts?.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">You have not created any posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts?.map((post) => (
            <li key={post._id}>
              <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:underline">
                {post.title} by {post.author.name} {/* Display author's name */}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
