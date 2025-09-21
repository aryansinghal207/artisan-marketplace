"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, Camera, Wand2, Instagram, Loader2, Sparkles } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Category {
  id: string
  name: string
  icon: any
  color: string
  count: number
}

interface Product {
  name: string
  price: number
  material: string
  dimensions: { length: number; width: number }
  image: string
  description: string
  category: string
}

interface AddProductFormProps {
  category: Category
  onBack: () => void
  onSubmit: (product: Product) => void
}

export function AddProductForm({ category, onBack, onSubmit }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    material: "",
    length: "",
    width: "",
    image: "",
    description: "",
  })
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [isEnhancingImage, setIsEnhancingImage] = useState(false)
  const [postToInstagram, setPostToInstagram] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageData = e.target?.result as string
        setFormData((prev) => ({ ...prev, image: imageData }))

        // Auto-enhance the image
        if (formData.name && formData.material) {
          await enhanceImage(imageData)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const enhanceImage = async (imageData: string) => {
    if (!formData.name || !formData.material) return

    setIsEnhancingImage(true)
    try {
      const response = await fetch("/api/enhance-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData,
          productName: formData.name,
          material: formData.material,
        }),
      })

      const result = await response.json()
      if (result.enhanced) {
        setFormData((prev) => ({ ...prev, image: result.enhancedImage }))
        // You could show the suggestions to the user
        console.log("Enhancement suggestions:", result.suggestions)
      }
    } catch (error) {
      console.error("Error enhancing image:", error)
    } finally {
      setIsEnhancingImage(false)
    }
  }

  const generateDescription = async () => {
    if (!formData.name || !formData.material) {
      alert("Please fill in product name and material first")
      return
    }

    setIsGeneratingDescription(true)

    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: formData.name,
          material: formData.material,
          category: category.name,
          imageData: formData.image,
        }),
      })

      const result = await response.json()
      if (result.description) {
        setFormData((prev) => ({ ...prev, description: result.description }))
      }
    } catch (error) {
      console.error("Error generating description:", error)
      // Fallback to simulated description
      const fallbackDescription = `Discover the beauty of handcrafted artistry with this exquisite ${formData.name.toLowerCase()}. Meticulously crafted from premium ${formData.material.toLowerCase()}, this piece showcases the perfect blend of traditional techniques and contemporary design.

Each piece is unique, bearing the distinctive marks of skilled craftsmanship that make it truly one-of-a-kind. The attention to detail and quality materials ensure this ${category.name.toLowerCase().slice(0, -1)} will be treasured for years to come.

Perfect for those who appreciate authentic, handmade artistry and want to support local artisans. This piece tells a story of passion, skill, and dedication to the craft.

#HandmadeWithLove #ArtisanCrafted #${category.name} #LocalArtist #UniqueDesign #HandcraftedQuality #SupportLocal #ArtisanMade`

      setFormData((prev) => ({ ...prev, description: fallbackDescription }))
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const product: Product = {
      name: formData.name,
      price: Number.parseFloat(formData.price),
      material: formData.material,
      dimensions: {
        length: Number.parseFloat(formData.length),
        width: Number.parseFloat(formData.width),
      },
      image:
        formData.image ||
        `/placeholder.svg?height=400&width=400&query=${formData.name} ${formData.material} ${category.name}`,
      description: formData.description,
      category: category.id,
    }

    onSubmit(product)

    if (postToInstagram) {
      try {
        // Get Instagram credentials from localStorage (set by profile settings)
        const profileData = localStorage.getItem("artisan-profile")
        const profile = profileData ? JSON.parse(profileData) : null

        console.log("[v0] Attempting Instagram post for product:", formData.name)

        const response = await fetch("/api/instagram/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: formData.name,
            description: formData.description,
            imageUrl: formData.image,
            category: category.name,
            material: formData.material,
            price: formData.price,
            instagramAccessToken: profile?.instagramAccessToken,
            instagramUserId: profile?.instagramUserId,
          }),
        })

        const result = await response.json()

        if (result.success) {
          if (result.realPost) {
            alert(
              `✅ Product published and posted to Instagram successfully!\n\nPost ID: ${result.postId}\nEstimated Reach: ${result.engagement.estimatedReach}\nHashtags Used: ${result.engagement.hashtagsUsed}\n\nMusic Suggestions:\n${result.musicSuggestions}`,
            )
          } else {
            alert(
              `✅ Product published successfully!\n\n📱 Instagram Simulation Mode:\n${result.note}\n\nGenerated Content Preview:\n${result.caption.substring(0, 200)}...\n\nMusic Suggestions:\n${result.musicSuggestions}`,
            )
          }
        } else {
          throw new Error(result.error || "Failed to post to Instagram")
        }
      } catch (error) {
        console.error("[v0] Instagram posting error:", error)
        alert(
          `❌ Product published but Instagram posting failed: ${error instanceof Error ? error.message : "Unknown error"}\n\nPlease check your Instagram connection in profile settings.`,
        )
      }
    } else {
      alert("✅ Product published successfully!")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-balance">Add New Product</h2>
          <p className="text-muted-foreground mt-1">
            Create a new product for your {category.name.toLowerCase()} collection
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category.id} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder={category.name} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={category.id}>{category.name}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) => setFormData((prev) => ({ ...prev, material: e.target.value }))}
                  placeholder="e.g., Sterling Silver, Ceramic, Cotton"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    value={formData.length}
                    onChange={(e) => setFormData((prev) => ({ ...prev, length: e.target.value }))}
                    placeholder="0.0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={formData.width}
                    onChange={(e) => setFormData((prev) => ({ ...prev, width: e.target.value }))}
                    placeholder="0.0"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Image and Description */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                Product Image
                {isEnhancingImage && <Sparkles className="h-4 w-4 ml-2 animate-pulse text-primary" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                {formData.image ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {isEnhancingImage && (
                        <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
                          <div className="flex items-center space-x-2 text-primary">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm font-medium">AI Enhancing...</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                      className="w-full"
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center space-x-4">
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <Button type="button" variant="outline" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload from Gallery
                          </span>
                        </Button>
                      </label>
                      <Button type="button" variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Take Picture
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI will automatically enhance and optimize your image
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Product Description</CardTitle>
              <Button type="button" variant="outline" onClick={generateDescription} disabled={isGeneratingDescription}>
                {isGeneratingDescription ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                {isGeneratingDescription ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="AI will generate a professional description based on your product details..."
              rows={8}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground mt-2">
              AI-generated descriptions are optimized for both your website and Instagram posts with trending hashtags
            </p>
          </CardContent>
        </Card>

        {/* Instagram Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Instagram className="h-5 w-5 mr-2" />
              Instagram Integration
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="instagram"
                checked={postToInstagram}
                onCheckedChange={(checked) => setPostToInstagram(checked as boolean)}
              />
              <Label htmlFor="instagram" className="text-sm">
                Post to Instagram when publishing this product
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Your product will be posted to Instagram with AI-generated trending hashtags, professional description,
              and background music
            </p>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
            {postToInstagram ? "Publish & Post to Instagram" : "Publish Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
