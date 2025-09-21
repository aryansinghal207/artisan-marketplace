"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw } from "lucide-react"

interface AIDescriptionGeneratorProps {
  productName: string
  category: string
  material: string
  onDescriptionGenerated: (description: string, hashtags: string) => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}

export function AIDescriptionGenerator({
  productName,
  category,
  material,
  onDescriptionGenerated,
  isGenerating,
  setIsGenerating
}: AIDescriptionGeneratorProps) {
  const generateDescription = async () => {
    if (!productName || !category) {
      alert("Please fill in product name and category first")
      return
    }

    setIsGenerating(true)

    try {
      // Simulate AI generation - replace with actual AI API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const description = `Discover the exquisite beauty of our handcrafted ${productName.toLowerCase()}. This stunning ${category.toLowerCase()} piece showcases exceptional artisanship and attention to detail. ${material ? `Made from premium ${material.toLowerCase()}, ` : ''}each piece is carefully crafted to bring elegance and sophistication to your collection.

Perfect for special occasions or as a meaningful gift, this unique ${category.toLowerCase()} combines traditional techniques with contemporary design. The careful attention to detail and quality materials ensure this piece will be treasured for years to come.

Each item is handmade with love and care, making every piece slightly unique and special.`

      const hashtags = `#handmade #artisan #${category.toLowerCase()} #handcrafted #unique #artisanmade #shoplocal #supportartists #oneofakind #craftsmanship #handmadejewelry #artisanjewelry #specialgift #trending #viral #aesthetic #luxury #premium #exclusive #limitededition`

      onDescriptionGenerated(description, hashtags)
    } catch (error) {
      console.error("Failed to generate description:", error)
      alert("Failed to generate description. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="font-medium">AI Description Generator</span>
        </div>
        <Button
          type="button"
          onClick={generateDescription}
          disabled={isGenerating || !productName || !category}
          size="sm"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Description
            </>
          )}
        </Button>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          Our AI will create a professional product description optimized for social media with trending hashtags based on your product details.
        </p>
      </div>
    </div>
  )
}