"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [sidebar, setSidebar] = useState(false);

  return (
    <>
      <div className="border-b border-gray-300 py-3 bg-gray-50">
        <div className="flex justify-between items-center container mx-auto px-2 md:px-0">
          <Link href="/" className="text-2xl font-semibold text-gray-800">
            Rent<span className="text-blue-800">Ease</span>
          </Link>

          <div className="md:flex gap-16 items-center text-gray-800 tracking-wider hidden">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="hover:text-blue-600 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="hover:text-blue-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>

          <div
            className="lg:mr-8 border px-4 py-1 rounded-md bg-blue-600 text-white hidden md:block hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Sign in
          </div>

          <div className="text-gray-800 md:hidden">
            <button onClick={() => setSidebar(!sidebar)}>
              <Menu />
            </button>
          </div>
        </div>

        {/* sidebar */}
        <div
          className={`h-screen md:hidden w-4/5 fixed z-40 top-0 right-0 shadow-lg bg-gray-50 transform transition-transform duration-300 ease-in-out ${
            sidebar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="py-4 flex justify-end px-4">
            <button onClick={() => setSidebar(!sidebar)}>
              <X />
            </button>
          </div>

          <div className="flex flex-col gap-6 text-lg mt-8 text-center">
            <Link
              href="/"
              onClick={() => setSidebar(false)}
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setSidebar(false)}
              className="hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/blog"
              onClick={() => setSidebar(false)}
              className="hover:text-blue-600 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              onClick={() => setSidebar(false)}
              className="hover:text-blue-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
