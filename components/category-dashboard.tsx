"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package, Palette, Gem, Shirt, Home, Gift, Play } from "lucide-react"
import { ProductManagement } from "./product-management"

const categories = [
  { id: "jewelry", name: "Jewelry", icon: Gem, color: "bg-amber-100 text-amber-700", count: 12 },
  { id: "pottery", name: "Pottery", icon: Package, color: "bg-orange-100 text-orange-700", count: 8 },
  { id: "textiles", name: "Textiles", icon: Shirt, color: "bg-rose-100 text-rose-700", count: 15 },
  { id: "paintings", name: "Paintings", icon: Palette, color: "bg-purple-100 text-purple-700", count: 6 },
  { id: "home-decor", name: "Home Decor", icon: Home, color: "bg-green-100 text-green-700", count: 10 },
  { id: "gifts", name: "Gifts", icon: Gift, color: "bg-blue-100 text-blue-700", count: 4 },
]

export function CategoryDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  if (selectedCategory) {
    const category = categories.find((c) => c.id === selectedCategory)
    return <ProductManagement category={category!} onBack={() => setSelectedCategory(null)} />
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Play className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Getting Started Tutorial</CardTitle>
              <p className="text-sm text-muted-foreground">Learn how to maximize your artisan marketplace experience</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Artisan Marketplace Tutorial"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-primary/80 text-white text-xs rounded-full">Product Photography</span>
            <span className="px-2 py-1 bg-primary/80 text-white text-xs rounded-full">AI Descriptions</span>
            <span className="px-2 py-1 bg-primary/80 text-white text-xs rounded-full">Instagram Integration</span>
            <span className="px-2 py-1 bg-primary/80 text-white text-xs rounded-full">Category Management</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-balance">Your Product Categories</h2>
          <p className="text-muted-foreground mt-2">Organize and manage your handcrafted products by category</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <Card
              key={category.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20"
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-bold text-primary">{category.count}</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl mb-2">{category.name}</CardTitle>
                <p className="text-muted-foreground text-sm">{category.count} products in this category</p>
                <Button
                  variant="outline"
                  className="w-full mt-4 hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  Manage Products
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Plus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Create New Category</h3>
          <p className="text-muted-foreground text-center mb-4">Add a new category to organize your products better</p>
          <Button variant="outline">Add New Category</Button>
        </CardContent>
      </Card>
    </div>
  )
}
