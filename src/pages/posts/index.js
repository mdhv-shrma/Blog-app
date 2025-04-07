import Link from "next/link";
import Image from "next/image";

const dummyPosts = [
  {
    title: "Getting Started with Next.js",
    slug: "getting-started-with-nextjs",
    image: "https://source.unsplash.com/random/600x400?nextjs",
  },
  {
    title: "Understanding React Hooks",
    slug: "understanding-react-hooks",
    image: "https://source.unsplash.com/random/600x400?react",
  },
  {
    title: "Deploying with Vercel",
    slug: "deploying-with-vercel",
    image: "https://source.unsplash.com/random/600x400?vercel",
  },
];

export default function PostsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">All Blog Posts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyPosts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`}>
            <div className="border rounded-lg shadow hover:shadow-lg cursor-pointer overflow-hidden bg-white transition-all duration-200">
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
                <h2 className="text-lg font-semibold">{post.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
