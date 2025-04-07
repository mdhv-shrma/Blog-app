import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow bg-white sticky top-0 z-50">
      {/* Left - Blog Title */}
      <div className="text-2xl font-bold text-blue-600">
        <Link href="/">Dev Blog</Link>
      </div>

      {/* Right - Navigation Links */}
      <div className="space-x-6 text-md font-medium text-gray-700">
        <Link href="/posts">Posts</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}
