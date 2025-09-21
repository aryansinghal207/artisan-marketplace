"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Upload, Palette, CheckCircle, Edit, DollarSign, Tag, MapPin } from 'lucide-react'
import Link from 'next/link'

// Simple Navigation Component
function Navigation() {
  return (
    <nav className="relative z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/upload" className="text-blue-400 font-medium border-b-2 border-blue-400 pb-1">
              Upload
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
              Dashboard
            </Link>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiGenerated, setAiGenerated] = useState(false)
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: '',
    keywords: [] as string[],
    regionalStory: '',
    platforms: [] as string[]
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        processWithAI()
      }
      reader.readAsDataURL(file)
    }
  }

  const processWithAI = async () => {
    setIsProcessing(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate AI content
    setProductData({
      title: 'Traditional Handmade Clay Cooking Pot',
      description: `Authentic handcrafted clay cooking pot made using traditional techniques passed down through generations. Crafted from natural, food-safe clay, this pot is perfect for slow cooking, retaining natural flavors and nutrients. Each piece is entirely shaped by hand using natural processes, making it ideal for preparing traditional curries, rice dishes, and stews.

The natural and porous nature of clay allows for even heat distribution and natural moisture retention, making it ideal for preparing traditional curries, rice dishes, and stews.`,
      price: '$38.00',
      keywords: ['clay pot', 'handmade', 'cookware', 'traditional', 'eco-friendly'],
      regionalStory: `Crafted in the historic potter's workshops of Jaipur, this clay pot represents centuries of ceramic artistry. Known for Rajasthan's signature blue pottery and traditional terracotta, this piece carries forward ancient techniques passed down through generations. Each pot carries the essence of Rajasthan's rich cultural heritage and the skilled hands that shaped it.`,
      platforms: ['Etsy', 'Amazon Handmade', 'Facebook Marketplace']
    })
    
    setIsProcessing(false)
    setAiGenerated(true)
  }

  const handleCreateListing = () => {
    alert("Listing created successfully!")
  }

  // Function to trigger file input click
  const triggerFileInput = () => {
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Upload Your Product
          </h1>
          <p className="text-xl text-gray-300">Let AI transform your product photo into a professional listing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-100">
                <Upload className="w-5 h-5 mr-2" />
                Product Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-gray-500 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300 mb-4">Upload a clear photo of your handmade product</p>
                  
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  
                  {/* Clickable button that triggers file input */}
                  <Button 
                    onClick={triggerFileInput}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                    type="button"
                  >
                    Choose Photo
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded product"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-white">AI is analyzing your product...</p>
                      </div>
                    </div>
                  )}
                  {aiGenerated && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Photo uploaded successfully
                      </Badge>
                    </div>
                  )}
                  
                  {/* Change photo button */}
                  <div className="absolute bottom-2 left-2">
                    <Button 
                      onClick={triggerFileInput}
                      size="sm"
                      variant="outline"
                      className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
                    >
                      Change Photo
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Generated Details */}
          <div className="space-y-6">
            {/* Product Title */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-gray-100 text-sm">
                  <Palette className="w-4 h-4 mr-2 text-blue-400" />
                  AI-Generated Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Product Title</label>
                  <Input
                    value={productData.title}
                    onChange={(e) => setProductData({...productData, title: e.target.value})}
                    className="bg-gray-700/50 border-gray-600 text-gray-100"
                    placeholder="Traditional Handmade Clay Cooking Pot"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
                  <Textarea
                    value={productData.description}
                    onChange={(e) => setProductData({...productData, description: e.target.value})}
                    className="bg-gray-700/50 border-gray-600 text-gray-100 h-32"
                    placeholder="Authentic handcrafted clay cooking pot..."
                  />
                  <Button variant="ghost" size="sm" className="mt-2 text-blue-400 hover:text-blue-300">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit with AI
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Regional Story */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-gray-100 text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                  Regional Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={productData.regionalStory}
                  onChange={(e) => setProductData({...productData, regionalStory: e.target.value})}
                  className="bg-gray-700/50 border-gray-600 text-gray-100 h-24"
                  placeholder="Crafted in the historic potter's workshops of Jaipur..."
                />
                <Button variant="ghost" size="sm" className="mt-2 text-purple-400 hover:text-purple-300">
                  <Edit className="w-4 h-4 mr-1" />
                  Enhance Story
                </Button>
              </CardContent>
            </Card>

            {/* Price and Keywords */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-gray-100 text-sm">
                    <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                    Suggested Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={productData.price}
                    onChange={(e) => setProductData({...productData, price: e.target.value})}
                    className="bg-gray-700/50 border-gray-600 text-gray-100"
                    placeholder="$38.00"
                  />
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-gray-100 text-sm">
                    <Tag className="w-4 h-4 mr-2 text-cyan-400" />
                    Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {productData.keywords.map((keyword, index) => (
                      <Badge key={index} className="bg-gray-700/50 text-gray-300 border-gray-600">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Platforms */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-100 text-sm">Recommended Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {productData.platforms.map((platform, index) => (
                    <Badge key={index} className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                      {platform}
                    </Badge>
                  ))}
                  <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                    Local Craft Fairs
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Button 
              onClick={handleCreateListing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-4 border-0"
              disabled={!aiGenerated}
            >
              <Palette className="w-5 h-5 mr-2" />
              Create Listing with Regional Story
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}