// src/components/layout/Navbar.tsx
`use client`;

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle"; // To be created

const Navbar = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" legacyBehavior>
              <a className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                MeghaTales
              </a>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/bookstore" legacyBehavior><a className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Bookstore</a></Link>
            <Link href="/pdf-library" legacyBehavior><a className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">PDF Library</a></Link>
            <Link href="/education" legacyBehavior><a className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Education</a></Link>
            <Link href="/magazine" legacyBehavior><a className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Magazine</a></Link>
            {/* Add other links as needed */}
          </div>
          <div className="flex items-center">
            <div className="mr-4">
                <ThemeToggle />
            </div>
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <Link href="/dashboard" legacyBehavior>
                        <a className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</a>
                    </Link>
                    <button 
                        onClick={handleSignOut} 
                        className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                    >
                        Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <Link href="/auth/login" legacyBehavior>
                        <a className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Sign In</a>
                    </Link>
                    <Link href="/auth/signup" legacyBehavior>
                        <a className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">Sign Up</a>
                    </Link>
                  </div>
                )}
              </>
            )}
            {loading && <div className="w-6 h-6 border-2 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div>}
          </div>
          {/* Mobile menu button - can be added later if complex nav needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

