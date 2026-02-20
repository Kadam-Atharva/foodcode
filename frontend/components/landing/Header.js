import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                FoodConnect
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex gap-6 text-gray-600 font-medium">
              <Link
                href="#how-it-works"
                className="hover:text-orange-500 transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="#live-feed"
                className="hover:text-orange-500 transition-colors"
              >
                Live Feed
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-gray-100 shadow-lg animate-in slide-in-from-top-5">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link
              href="#how-it-works"
              className="block text-gray-600 hover:text-orange-500 font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="#live-feed"
              className="block text-gray-600 hover:text-orange-500 font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Live Feed
            </Link>
            <div className="pt-4 flex flex-col gap-3 border-t border-gray-100">
              <Link
                href="/login"
                className="block text-center text-gray-600 hover:text-orange-500 font-medium py-2 border border-gray-200 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
