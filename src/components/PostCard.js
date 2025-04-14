import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="p-4">
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{post.title}</h3>
          <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">{post.content}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-2 text-sm text-gray-500 dark:text-gray-400">
          By <span className="font-semibold">{post.author.name}</span>
        </div>
      </Link>
    </div>
  );
}
