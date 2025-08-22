"use client";
import React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

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
            <div className="ml-10 flex items-baseline space-x-8">
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
            </div>
          </div>

          <div className="flex items-center">
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
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
