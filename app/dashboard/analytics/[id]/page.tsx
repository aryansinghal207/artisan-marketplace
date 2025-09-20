'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  price: number
  status: 'active' | 'draft'
  views: number
}

// Mock products data
const mockProducts: Record<string, Product[]> = {
  '1': [
    { id: '1', name: 'Handcrafted Silver Ring', price: 89.99, status: 'active', views: 45 },
    { id: '2', name: 'Custom Gold Necklace', price: 129.99, status: 'active', views: 38 },
    { id: '3', name: 'Artisan Bracelet', price: 65.99, status: 'draft', views: 12 },
  ],
  '2': [
    { id: '4', name: 'Ceramic Vase', price: 45.99, status: 'active', views: 32 },
    { id: '5', name: 'Handmade Bowl', price: 29.99, status: 'active', views: 28 },
  ],
  '3': [
    { id: '6', name: 'Cotton Scarf', price: 35.99, status: 'active', views: 25 },
    { id: '7', name: 'Woven Blanket', price: 89.99, status: 'active', views: 42 },
  ],
  '4': [
    { id: '8', name: 'Abstract Canvas', price: 150.99, status: 'active', views: 18 },
    { id: '9', name: 'Portrait Painting', price: 200.99, status: 'draft', views: 15 },
  ],
  '5': [
    { id: '10', name: 'Wooden Lamp', price: 75.99, status: 'active', views: 28 },
    { id: '11', name: 'Decorative Mirror', price: 120.99, status: 'active', views: 35 },
  ],
  '6': [
    { id: '12', name: 'Gift Basket', price: 45.99, status: 'active', views: 22 },
    { id: '13', name: 'Custom Mug', price: 25.99, status: 'active', views: 30 },
  ],
}

const categoryNames: Record<string, string> = {
  '1': 'Jewelry',
  '2': 'Pottery',
  '3': 'Textiles',
  '4': 'Paintings',
  '5': 'Home Decor',
  '6': 'Gifts',
}

export default function CategoryProducts() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string
  
  const [products, setProducts] = useState<Product[]>([])
  const [categoryName, setCategoryName] = useState<string>('')

  useEffect(() => {
    // Get products for this category
    const categoryProducts = mockProducts[categoryId] || []
    setProducts(categoryProducts)
    setCategoryName(categoryNames[categoryId] || 'Unknown Category')
  }, [categoryId])

  const handleEditProduct = (productId: string) => {
    console.log('Edit product:', productId)
    // Navigate to edit product page
    router.push(`/dashboard/products/edit/${productId}`)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const handleAddProduct = () => {
    // Navigate to add product page with category pre-selected
    router.push(`/dashboard/products/new?category=${categoryId}`)
  }

  const handleViewProduct = (productId: string) => {
    router.push(`/dashboard/products/${productId}`)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Manage Products - {categoryName}</h1>
            <p className="text-gray-600">{products.length} products in this category</p>
          </div>
        </div>
        <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products yet</h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first product to this category
            </p>
            <Button onClick={handleAddProduct}>
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="font-medium text-green-600">${product.price}</span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {product.views} views
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProduct(product.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product.id)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}