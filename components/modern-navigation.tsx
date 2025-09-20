"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Palette, Menu, X } from 'lucide-react'
import Link from 'next/link'

export function ModernNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="relative z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
                  <Palette className="w-4 h-4 text-gray-900" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-80"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full opacity-60"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
                कलाकार्ट
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors font-medium">
              Analytics
            </Link>
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
              Log In
            </Link>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/95 backdrop-blur-md rounded-lg mt-2 border border-gray-700">
              <Link href="/dashboard" className="block px-3 py-2 text-gray-300 hover:text-white">
                Dashboard
              </Link>
              <Link href="/analytics" className="block px-3 py-2 text-gray-300 hover:text-white">
                Analytics
              </Link>
              <Link href="/login" className="block px-3 py-2 text-gray-300 hover:text-white">
                Log In
              </Link>
              <Button className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}