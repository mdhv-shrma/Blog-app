import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";

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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!post) return <p className="text-center mt-10 text-red-500">Post not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>
      <div className="relative w-full h-80 mb-6 rounded-md overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      <p className="text-gray-700 text-lg">{post.content}</p>
    </div>
  );
}
