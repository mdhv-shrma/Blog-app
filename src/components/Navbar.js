import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow bg-white dark:bg-gray-800 sticky top-0 z-50">
      {/* Left - Blog Title */}
      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        <Link href="/">Dev Blog</Link>
      </div>

      {/* Right - Navigation Links */}
      <div className="space-x-6 text-md font-medium text-gray-700 dark:text-gray-300">
        <Link href="/posts" className="hover:text-blue-600 dark:hover:text-blue-400">
          Posts
        </Link>
        <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">
          Contact
        </Link>
        <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
          Login
        </Link>
      </div>
    </nav>
  );
}
