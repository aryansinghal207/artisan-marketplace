"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Facebook, ExternalLink, Calendar, AlertCircle, Share, CheckCircle, Copy } from "lucide-react"
import Image from "next/image"

interface FacebookProfile {
  id: string
  name: string
  email?: string
  picture: {
    data: {
      url: string
    }
  }
}

interface FacebookProfileViewerProps {
  accessToken?: string
  onClose: () => void
}

export function FacebookProfileViewer({ accessToken, onClose }: FacebookProfileViewerProps) {
  const [profile, setProfile] = useState<FacebookProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)
  const [postContent, setPostContent] = useState<string>("")

  useEffect(() => {
    if (accessToken) {
      fetchFacebookData()
      // Check if there's a pending product to post
      autoPostPendingProduct()
    } else {
      setError("No access token provided")
      setLoading(false)
    }
  }, [accessToken])

  const fetchFacebookData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/facebook/profile?accessToken=${accessToken}`)
      const data = await response.json()

      if (data.success) {
        setProfile(data.profile)
        console.log("[Facebook] Profile loaded successfully")
      } else {
        setError(data.error || "Failed to load Facebook profile")
      }
    } catch (err) {
      setError("Failed to connect to Facebook")
      console.error("[Facebook] Profile fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const autoPostPendingProduct = async () => {
    // Check if there's a pending product to post
    const pendingProduct = localStorage.getItem('pendingProduct')
    if (pendingProduct && accessToken) {
      const productData = JSON.parse(pendingProduct)
      if (productData.postToFacebook) {
        console.log("Auto-preparing pending product for Facebook...")
        await prepareProductPost(productData)
        // Don't clear the pending product yet - let user decide when to post
      }
    }
  }

  const prepareProductPost = async (productData?: any) => {
    if (!accessToken) {
      alert("No Facebook access token available")
      return
    }

    setIsPosting(true)
    try {
      // Get product data from localStorage if not provided
      if (!productData) {
        const pendingProduct = localStorage.getItem('pendingProduct')
        if (pendingProduct) {
          productData = JSON.parse(pendingProduct)
        } else {
          // Create sample product data if none exists
          productData = {
            name: "Sample Artisan Product",
            category: "jewelry",
            price: "29.99",
            material: "Sterling Silver",
            length: "5",
            width: "3",
            description: `Discover the exquisite beauty of our handcrafted jewelry. This stunning piece showcases exceptional artisanship and attention to detail. Made from premium sterling silver, each piece is carefully crafted to bring elegance and sophistication to your collection.

Perfect for special occasions or as a meaningful gift, this unique jewelry combines traditional techniques with contemporary design. The careful attention to detail and quality materials ensure this piece will be treasured for years to come.

Each item is handmade with love and care, making every piece slightly unique and special.

#handmade #artisan #jewelry #handcrafted #unique #artisanmade #shoplocal #supportartists #oneofakind #craftsmanship #handmadejewelry #artisanjewelry #specialgift #trending #viral #aesthetic #luxury #premium #exclusive #limitededition`,
            postToFacebook: true,
            images: []
          }
          console.log("Using sample product data for sharing")
        }
      }

      console.log("Preparing product post content:", productData)

      // Get post content from our API
      const response = await fetch('/api/facebook/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken,
          productData: productData
        })
      })

      const result = await response.json()

      if (result.success && result.postContent) {
        console.log("Post content prepared successfully!")
        setPostContent(result.postContent.message)
        setPostSuccess(true)
        
        // Hide success message after 10 seconds
        setTimeout(() => {
          setPostSuccess(false)
        }, 10000)
      } else {
        console.error("Failed to prepare post content:", result.error)
        alert(`Failed to prepare post content: ${result.error}`)
      }
    } catch (error) {
      console.error("Error preparing post content:", error)
      alert("An error occurred while preparing the post content")
    } finally {
      setIsPosting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postContent)
      alert("Post content copied to clipboard! You can now paste it in Facebook.")
    } catch (err) {
      console.error('Failed to copy text: ', err)
      alert("Failed to copy to clipboard")
    }
  }

  const openFacebookPost = () => {
    // Copy to clipboard first
    if (postContent) {
      navigator.clipboard.writeText(postContent).then(() => {
        console.log("Content copied to clipboard")
      })
    }
    
    // Open Facebook create post page
    window.open('https://www.facebook.com/', '_blank')
    alert("Content copied to clipboard! Paste it in the Facebook post box that just opened.")
  }

  const createSampleProduct = () => {
    const sampleProduct = {
      name: "Handcrafted Silver Ring",
      category: "jewelry",
      price: "45.99",
      material: "Sterling Silver",
      length: "2",
      width: "2",
      description: `Discover the exquisite beauty of our handcrafted silver ring. This stunning jewelry piece showcases exceptional artisanship and attention to detail. Made from premium sterling silver, each piece is carefully crafted to bring elegance and sophistication to your collection.

Perfect for special occasions or as a meaningful gift, this unique jewelry combines traditional techniques with contemporary design. The careful attention to detail and quality materials ensure this piece will be treasured for years to come.

Each item is handmade with love and care, making every piece slightly unique and special.

#handmade #artisan #jewelry #handcrafted #unique #artisanmade #shoplocal #supportartists #oneofakind #craftsmanship #handmadejewelry #artisanjewelry #specialgift #trending #viral #aesthetic #luxury #premium #exclusive #limitededition`,
      postToFacebook: true,
      images: []
    }
    
    localStorage.setItem('pendingProduct', JSON.stringify(sampleProduct))
    alert("Sample product created! Click 'Prepare Post' to generate the Facebook content.")
  }

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your Facebook profile...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <Facebook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2 text-destructive">Connection Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {postSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Facebook post content prepared successfully!</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Header */}
      {profile && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Facebook className="h-6 w-6 mr-2 text-blue-600" />
                Facebook Profile Connected
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  onClick={() => prepareProductPost()}
                  variant="outline"
                  size="sm"
                  disabled={isPosting}
                  className="flex items-center space-x-2"
                >
                  {isPosting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Preparing...</span>
                    </>
                  ) : (
                    <>
                      <Share className="h-4 w-4" />
                      <span>Prepare Post</span>
                    </>
                  )}
                </Button>
                <Button onClick={onClose} variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 relative rounded-full overflow-hidden">
                {profile.picture?.data?.url ? (
                  <Image
                    src={profile.picture.data.url}
                    alt="Profile picture"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Facebook className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{profile.name}</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary">Connected</Badge>
                  {profile.email && (
                    <span className="text-sm text-muted-foreground">{profile.email}</span>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => window.open(`https://facebook.com/${profile.id}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Facebook
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post Content Preview */}
      {postContent && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Facebook Post Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{postContent}</pre>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>Copy to Clipboard</span>
              </Button>
              <Button
                onClick={openFacebookPost}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              >
                <Facebook className="h-4 w-4" />
                <span>Open Facebook & Auto-Copy</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Generate Facebook post content with AI-generated description and hashtags.
          </p>
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-3">
              <Button
                onClick={() => prepareProductPost()}
                disabled={isPosting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPosting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Preparing Content...
                  </>
                ) : (
                  <>
                    <Share className="h-4 w-4 mr-2" />
                    Prepare Facebook Post
                  </>
                )}
              </Button>
              
              <Button
                onClick={createSampleProduct}
                variant="outline"
                disabled={isPosting}
              >
                Create Sample Product
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
            How to Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="text-sm text-muted-foreground space-y-2">
            <li>1. Click <strong>"Prepare Facebook Post"</strong> to generate AI content</li>
            <li>2. Click <strong>"Open Facebook & Auto-Copy"</strong> to open Facebook with content copied</li>
            <li>3. Paste (Ctrl+V) the content into the Facebook post box</li>
            <li>4. Add product images manually if needed</li>
            <li>5. Click <strong>"Share"</strong> to post on Facebook</li>
          </ol>
        </CardContent>
      </Card>

      {/* Permissions Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
            Facebook Integration Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Due to Facebook's privacy policies, we cannot automatically post content. Instead, we generate the perfect post content with AI and help you copy it to Facebook.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold text-sm text-green-600">✅ What We Do</h4>
              <ul className="text-xs text-muted-foreground mt-1">
                <li>• Generate AI descriptions</li>
                <li>• Add trending hashtags</li>
                <li>• Format product details</li>
                <li>• Copy to clipboard</li>
              </ul>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold text-sm text-blue-600">📝 You Do</h4>
              <ul className="text-xs text-muted-foreground mt-1">
                <li>• Paste content in Facebook</li>
                <li>• Add product images</li>
                <li>• Review and edit if needed</li>
                <li>• Click Share</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

