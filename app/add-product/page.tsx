"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/image-upload"
import { AIDescriptionGenerator } from "@/components/ai-description-generator"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
  const router = useRouter()
  
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    price: "",
    material: "",
    length: "",
    width: "",
    description: "",
    images: [] as string[],
    postToFacebook: false
  })

  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const handleImageUpload = (imageUrls: string[]) => {
    setProductData(prev => ({ ...prev, images: imageUrls }))
  }

  const handleDescriptionGenerated = (description: string, hashtags: string) => {
    setProductData(prev => ({ 
      ...prev, 
      description: `${description}\n\n${hashtags}` 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPublishing(true)

    try {
      // Save the product data to localStorage
      localStorage.setItem('pendingProduct', JSON.stringify(productData))

      // If Facebook posting is enabled, redirect to Facebook OAuth
      if (productData.postToFacebook) {
        console.log("Redirecting to Facebook OAuth for product publishing...")
        // Redirect to Facebook auth which will handle the OAuth flow
        // After OAuth, it will redirect back to dashboard with Facebook connected
        window.location.href = '/api/facebook/auth'
        return
      }

      // If no Facebook posting, just publish the product normally and redirect to dashboard
      console.log("Publishing product without Facebook:", productData)
      
      // Here you would normally save to your database
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Clear the product data and redirect to dashboard
      localStorage.removeItem('pendingProduct')
      router.push('/')
      
    } catch (error) {
      console.error("Error publishing product:", error)
      alert("Failed to publish product. Please try again.")
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-sm text-gray-600">Create a new product for your jewelry collection</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={productData.name}
                  onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setProductData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="pottery">Pottery</SelectItem>
                    <SelectItem value="textiles">Textiles</SelectItem>
                    <SelectItem value="paintings">Paintings</SelectItem>
                    <SelectItem value="home-decor">Home Decor</SelectItem>
                    <SelectItem value="gifts">Gifts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={productData.price}
                  onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  placeholder="e.g. Sterling Silver, Ceramic, Cotton"
                  value={productData.material}
                  onChange={(e) => setProductData(prev => ({ ...prev, material: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input
                    id="length"
                    type="number"
                    placeholder="0.0"
                    value={productData.length}
                    onChange={(e) => setProductData(prev => ({ ...prev, length: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="0.0"
                    value={productData.width}
                    onChange={(e) => setProductData(prev => ({ ...prev, width: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload onImagesUploaded={handleImageUpload} />
            </CardContent>
          </Card>

          {/* Product Description */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Description</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  disabled={isGeneratingDescription}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate with AI</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AIDescriptionGenerator
                productName={productData.name}
                category={productData.category}
                material={productData.material}
                onDescriptionGenerated={handleDescriptionGenerated}
                isGenerating={isGeneratingDescription}
                setIsGenerating={setIsGeneratingDescription}
              />
              
              <div className="mt-4">
                <Textarea
                  placeholder="AI will generate a professional description based on your product details..."
                  className="min-h-32"
                  value={productData.description}
                  onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                />
                <p className="text-sm text-gray-500 mt-2">
                  AI-generated descriptions are optimized for both your website and social media posts with trending hashtags
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Integration */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Social Media Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Facebook</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="facebook"
                      checked={productData.postToFacebook}
                      onCheckedChange={(checked) => 
                        setProductData(prev => ({ ...prev, postToFacebook: checked as boolean }))
                      }
                    />
                    <Label htmlFor="facebook">Post to Facebook when publishing this product</Label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Your product will be posted to Facebook with AI-generated trending hashtags, professional descriptions, and background music
                  </p>
                  
                  {productData.postToFacebook && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        📱 <strong>Note:</strong> You'll be redirected to Facebook to authorize posting when you publish this product.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="lg:col-span-2 flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push('/')}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-red-500 hover:bg-red-600"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {productData.postToFacebook ? 'Connecting to Facebook...' : 'Publishing...'}
                </>
              ) : (
                'Publish Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}