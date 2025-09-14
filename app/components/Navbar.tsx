"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-teal-600 hover:text-teal-700 transition-colors"
            >
              TripTales India
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/tripplanner"
                className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Trip Planner
              </Link>
              <Link
                href="/cinephile"
                className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Cinephile
              </Link>
              <Link
                href="/filter"
                className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center">
              {session ? (
                <>
                  <span className="text-gray-700 text-sm font-medium mr-2">
                    Hi, {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="bg-gradient-to-r from-orange-400 to-green-400 mx-auto text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
            >
              🏠 Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
            >
              ℹ️ About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
            >
              📞 Contact
            </Link>
            <Link
              href="/tripplanner"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
            >
              🗺️ Trip Planner
            </Link>
            <Link
              href="/cinephile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
            >
              🎬 Cinephile
            </Link>
            <Link
              href="/filter"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-md text-sm font-medium tra nsition-colors"
            >
              🔍 Search
            </Link>

            {/* Mobile Auth */}
            <div className="pt-3 border-t border-gray-200">
              {session ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Hi, {session.user?.name || session.user?.email}
                  </div>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/login" });
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    signIn();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 bg-gradient-to-r from-orange-400 to-green-400 text-white rounded-md text-sm font-medium transition-colors"
                >
                  🔑 Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
