"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Package, Edit, Trash2, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  icon: string
  count: number
  color: string
  description?: string
}

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Jewelry",
    icon: "💎",
    count: 12,
    color: "bg-blue-100",
    description: "12 products in this category",
  },
  {
    id: "2",
    name: "Pottery",
    icon: "🏺",
    count: 8,
    color: "bg-orange-100",
    description: "8 products in this category",
  },
  {
    id: "3",
    name: "Textiles",
    icon: "🧵",
    count: 15,
    color: "bg-purple-100",
    description: "15 products in this category",
  },
  {
    id: "4",
    name: "Paintings",
    icon: "🎨",
    count: 6,
    color: "bg-pink-100",
    description: "6 products in this category",
  },
  {
    id: "5",
    name: "Home Decor",
    icon: "🏠",
    count: 10,
    color: "bg-green-100",
    description: "10 products in this category",
  },
  {
    id: "6",
    name: "Gifts",
    icon: "🎁",
    count: 4,
    color: "bg-red-100",
    description: "4 products in this category",
  },
]

export function ProductCategories() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryIcon, setNewCategoryIcon] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const manageProducts = (categoryId: string, categoryName: string) => {
    router.push(`/dashboard/categories/${categoryId}/products`)
  }

  const viewAnalytics = (categoryId: string, categoryName: string) => {
    router.push(`/dashboard/analytics/${categoryId}`)
  }

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName,
        icon: newCategoryIcon || "📦",
        count: 0,
        color: "bg-gray-100",
        description: "0 products in this category",
      }
      setCategories([...categories, newCategory])
      setNewCategoryName("")
      setNewCategoryIcon("")
      setIsAddDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Your Product Categories
          </h2>
          <p className="text-gray-600">
            Organize and manage your handcrafted products by category
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="category-icon">Icon (emoji)</Label>
                <Input
                  id="category-icon"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  placeholder="📦"
                />
              </div>
              <Button onClick={addCategory} className="w-full">
                Create Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`${
              category.color
            } border border-gray-200 hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-6">
              {/* Category Header */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {category.name}
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {category.count}
                </div>
                <p className="text-sm text-gray-600">
                  {category.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => manageProducts(category.id, category.name)}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Manage Products
                </Button>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => viewAnalytics(category.id, category.name)}
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Stats
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Category Card */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-6">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <div className="text-center cursor-pointer h-full flex flex-col justify-center">
                  <Plus className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-gray-700">
                    Create New Category
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Add a new category to organize your handcrafted items
                  </p>
                  <Button variant="outline" size="sm" className="mx-auto">
                    Add New Category
                  </Button>
                </div>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}