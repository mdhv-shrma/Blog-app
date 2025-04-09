import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [featuredPosts, setFeaturedPosts] = useState([]);

  const words = ["Welcome to My Blog", "Explore Amazing Content"];

  useEffect(() => {
    const currentWord = words[index % words.length];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      setText(currentWord.slice(0, charIndex + 1));
      charIndex++;
      if (charIndex === currentWord.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setText("");
          setIndex((prev) => prev + 1);
        }, 1000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [index]);

  // Fetch all posts and filter for featured posts locally
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch("/api/posts/getPost");
        const data = await res.json();
        if (Array.isArray(data)) {
          const featured = data.filter((post) => post.isFeatured); // Filter featured posts
          setFeaturedPosts(featured);
          console.log("Filtered featured posts:", featured);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    getPosts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 via-white to-pink-100 text-center py-24">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 tracking-tight">
          {text}
          <span className="text-blue-600">|</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your daily dose of insightful articles, tutorials, and tech stories.
        </p>
      </section>

      {/* Featured Posts Section */}
      <section className="py-20 bg-white">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          ✨ Featured Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20">
          {featuredPosts.map((post) => (
            <Link
              key={post._id}
              href={`/posts/${post.slug}`}
              className="bg-gradient-to-tr from-white to-blue-50 p-6 rounded-2xl shadow-lg transition hover:shadow-xl hover:scale-105 duration-300"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 line-clamp-3">
                {post.excerpt || "A sneak peek of what’s inside this post."}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
