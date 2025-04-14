import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PostDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/posts/${slug}`);
          const data = await res.json();
          setPost(data.post);
        } catch (err) {
          console.error("Error fetching post:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [slug]);

  if (loading) return <p className="text-center mt-10 text-xl text-gray-600">Loading...</p>;

  if (!post) return <p className="text-center mt-10 text-xl text-red-500">Post not found</p>;

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-pink-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 md:p-12 transition duration-300">
        <Link href="/" className="inline-block text-blue-600 mb-6 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight text-center">
          {post.title}
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          By:{" "}
          <Link
            href={`/profile/${post.author._id}`}
            className="text-blue-600 hover:underline"
          >
            {post.author.name}
          </Link>
        </p>

        {post.image && (
          <div className="relative w-full h-80 md:h-[28rem] mb-10 rounded-xl overflow-hidden shadow-md">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <article className="prose prose-lg md:prose-xl max-w-none prose-img:rounded-xl prose-headings:text-gray-800 prose-p:text-gray-700">
          <p>{post.content}</p>
        </article>
      </div>
    </div>
  );
}
