"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Upload, BarChart3, User, Menu, X } from 'lucide-react'
import Link from 'next/link'

export function ModernNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="relative z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              CraftAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link href="/upload" className="text-gray-300 hover:text-white transition-colors">
              Upload
            </Link> */}
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">
              Analytics
            </Link>
            <Link href="/sign-in" className="text-gray-300 hover:text-white transition-colors">
              Log In
            </Link>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/95 backdrop-blur-md rounded-lg mt-2">
              <Link href="/upload" className="block px-3 py-2 text-gray-300 hover:text-white">
                Upload
              </Link>
              <Link href="/dashboard" className="block px-3 py-2 text-gray-300 hover:text-white">
                Dashboard
              </Link>
              <Link href="/analytics" className="block px-3 py-2 text-gray-300 hover:text-white">
                Analytics
              </Link>
              <Link href="/sign-in" className="block px-3 py-2 text-gray-300 hover:text-white">
                Sign In
              </Link>
              <Button className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}