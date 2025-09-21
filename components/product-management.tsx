"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Edit, Trash2, Instagram, Eye } from "lucide-react"
import { AddProductForm } from "./add-product-form"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  icon: any
  color: string
  count: number
}

interface Product {
  id: string
  name: string
  price: number
  material: string
  dimensions: { length: number; width: number }
  image: string
  description: string
  category: string
}

// Mock products data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Handwoven Silver Bracelet",
    price: 89.99,
    material: "Sterling Silver",
    dimensions: { length: 18, width: 1.2 },
    image: "/handwoven-silver-bracelet-artisan-jewelry.jpg",
    description: "Beautifully crafted sterling silver bracelet with intricate handwoven patterns.",
    category: "jewelry",
  },
  {
    id: "2",
    name: "Ceramic Vase with Blue Glaze",
    price: 45.0,
    material: "Ceramic",
    dimensions: { length: 15, width: 15 },
    image: "/ceramic-vase-blue-glaze-pottery.jpg",
    description: "Elegant ceramic vase featuring a stunning blue glaze finish.",
    category: "pottery",
  },
]

interface ProductManagementProps {
  category: Category
  onBack: () => void
}

export function ProductManagement({ category, onBack }: ProductManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [products, setProducts] = useState<Product[]>(mockProducts.filter((p) => p.category === category.id))
  const router = useRouter()

  const handleAddProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    }
    setProducts([...products, newProduct])
    setShowAddForm(false)
  }

  const manageProducts = (categoryId: string, categoryName: string) => {
    router.push(`/dashboard/categories/${categoryId}/products`)
  }

  if (showAddForm) {
    return <AddProductForm category={category} onBack={() => setShowAddForm(false)} onSubmit={handleAddProduct} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-balance">{category.name} Products</h2>
            <p className="text-muted-foreground mt-1">Manage your {category.name.toLowerCase()} collection</p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className={`p-4 rounded-lg ${category.color} mb-4`}>
              <category.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start building your {category.name.toLowerCase()} collection by adding your first product.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                  <span className="text-sm text-muted-foreground">{product.material}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-muted-foreground mb-4">
                  Dimensions: {product.dimensions.length}cm × {product.dimensions.width}cm
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
