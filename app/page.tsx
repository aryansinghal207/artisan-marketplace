"use client"

import { useEffect, useState } from "react"
import { SocialMediaIntegration } from "@/components/social-media-integration"
import { ProductCategories } from "@/components/product-categories"
import { DashboardNav } from "@/components/dashboard-nav"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, X } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Upload, BarChart3, MessageCircle, Star, ArrowRight } from 'lucide-react'
import { AIAssistantChatbot } from '@/components/ai-assistant-chatbot'
import { ModernNavigation } from '@/components/modern-navigation'
import Link from 'next/link'

export default function HomePage() {
  const [showProductSuccess, setShowProductSuccess] = useState(false)
  const [productData, setProductData] = useState<any>(null)
  const [showChatbot, setShowChatbot] = useState(false)

  useEffect(() => {
    // Check if user just returned from Facebook OAuth after product publishing
    const urlParams = new URLSearchParams(window.location.search)
    const productPublished = urlParams.get('product_published')
    const facebookConnected = urlParams.get('facebook_connected')
    
    if (productPublished && facebookConnected) {
      // Get the product data from localStorage
      const pendingProduct = localStorage.getItem('pendingProduct')
      if (pendingProduct) {
        setProductData(JSON.parse(pendingProduct))
        setShowProductSuccess(true)
        
        // Auto-hide the success message after 10 seconds
        setTimeout(() => {
          setShowProductSuccess(false)
        }, 10000)
      }
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <ModernNavigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-blue-800/20" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              The fastest and most
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                powerful platform for
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                artisan businesses
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your handmade products into thriving online businesses with AI-driven listing optimization, 
              automated marketplace management, and intelligent sales analytics.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/upload">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Your Product
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <Card className="bg-gray-800/50 border-gray-700 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-600/20 rounded-lg mb-4 mx-auto">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI-Generated Listings</h3>
                <p className="text-gray-400">
                  Upload a photo and let AI create professional product descriptions, titles, and optimize for marketplaces.
                </p>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-lg mb-4 mx-auto">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Smart Analytics</h3>
                <p className="text-gray-400">
                  Track performance across all platforms with intelligent insights and optimization recommendations.
                </p>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-green-600/20 rounded-lg mb-4 mx-auto">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">24/7 AI Assistant</h3>
                <p className="text-gray-400">
                  Get instant help with pricing strategies, marketplace optimization, and business growth tips.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Success Alert for Product Publishing */}
      {showProductSuccess && productData && (
        <div className="bg-gray-800/50 border-b border-gray-700 px-6 py-4 backdrop-blur-sm">
          <Alert className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Product "{productData.name}" published successfully!</strong>
                  <span className="ml-2">Your product has been added to your marketplace and will be posted to Facebook.</span>
                </div>
                <button
                  onClick={() => setShowProductSuccess(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Artisan Marketplace</h1>
          <p className="text-gray-400">Connect your social media accounts to showcase your artisan products</p>
        </div>

        {/* Getting Started Tutorial */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-100 mb-2">Getting Started Tutorial</h2>
            </div>
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/sB2B4IASeE0"
                title="Getting Started Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Social Media Integration */}
        <div className="mt-12">
          <SocialMediaIntegration />
        </div>
      </div>

      {/* AI Assistant Chatbot */}
      <AIAssistantChatbot />
    </div>
  )
}
