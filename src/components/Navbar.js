import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import { useEffect } from "react"; // Import useEffect

export default function Navbar() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      toast.success(`Welcome back, ${session.user.name}!`); // Show success toast on login
    }
  }, [status, session]);

  const handleLogout = () => {
    signOut();
    toast.success("Logged out successfully!"); // Show success toast
  };

  return (
    <>
      <ToastContainer /> {/* Add this to render the toast notifications */}
      <nav className="flex items-center justify-between px-6 md:px-20 py-4 shadow-md bg-white dark:bg-gray-900 sticky top-0 z-50">
        {/* Left - Blog Title */}
        <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">
          <Link href="/">Dev Blog</Link>
        </div>

        {/* Right - Navigation Links */}
        <div className="flex items-center space-x-8 text-md font-medium text-gray-700 dark:text-gray-300">
          <Link href="/posts" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Posts
          </Link>
          <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Contact
          </Link>
          {session ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
                <span>Welcome, {session.user.name}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href="/posts/add-post"
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Add Post
                </Link>
                <Link
                  href="/profile"
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout} // Use the new logout handler
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
