"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FacebookConnectButton } from "./facebook-connect-button"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Sparkles, ArrowRight, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SocialMediaIntegration() {
  const [shouldAutoPost, setShouldAutoPost] = useState(false)

  useEffect(() => {
    // Check if we need to auto-post to Facebook after connection
    const urlParams = new URLSearchParams(window.location.search)
    const productPublished = urlParams.get('product_published')
    const facebookConnected = urlParams.get('facebook_connected')
    const accessToken = urlParams.get('access_token')
    
    if (productPublished && facebookConnected && accessToken) {
      setShouldAutoPost(true)
      
      // Auto-post to Facebook
      const pendingProduct = localStorage.getItem('pendingProduct')
      if (pendingProduct) {
        const productData = JSON.parse(pendingProduct)
        postToFacebook(accessToken, productData)
      }
    }
  }, [])

  const postToFacebook = async (token: string, product: any) => {
    try {
      console.log('Auto-posting to Facebook:', { product, token })
      
      // Here you would make the actual Facebook API call
      // For now, just simulate the posting
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Successfully posted to Facebook!')
      
    } catch (error) {
      console.error('Failed to post to Facebook:', error)
    }
  }

  const handleInstagramConnect = () => {
    window.location.href = '/api/instagram/auth'
  }

  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-100 mb-3">Social Media Integration</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Connect your social media accounts to automatically showcase and promote your artisan products across platforms
        </p>
      </div>

      {/* Enhanced Card Container */}
      <Card className="w-full max-w-6xl mx-auto bg-gray-800/50 border-gray-600 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-gray-100 text-center text-xl">Platform Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="facebook" className="w-full">
            {/* Enhanced Tab List */}
            <TabsList className="grid w-full grid-cols-2 bg-gray-700/50 border border-gray-600">
              <TabsTrigger 
                value="facebook" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </TabsTrigger>
              <TabsTrigger 
                value="instagram"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </TabsTrigger>
            </TabsList>
            
            {/* Facebook Tab Content */}
            <TabsContent value="facebook" className="mt-6">
              <div className="bg-gray-900/50 border border-gray-600 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-full">
                    <Facebook className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100">Facebook Marketplace</h3>
                    <p className="text-sm text-gray-400">Connect to reach millions of local customers</p>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  Automatically list your handmade products on Facebook Marketplace with AI-generated descriptions and optimized pricing.
                </p>
                
                <FacebookConnectButton />
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                    Auto-Post Products
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                    AI Descriptions
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                    Local Reach
                  </Badge>
                </div>
              </div>
            </TabsContent>
            
            {/* Instagram Tab Content */}
            <TabsContent value="instagram" className="mt-6">
              <div className="bg-gray-900/50 border border-gray-600 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full">
                    <Instagram className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100">Instagram Shopping</h3>
                    <p className="text-sm text-gray-400">Transform your profile into a shopping destination</p>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  Enable Instagram Shopping tags and showcase your beautiful handmade products with automated story features.
                </p>
                
                <Button 
                  onClick={handleInstagramConnect} 
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 mb-4"
                >
                  <Instagram className="h-4 w-4" />
                  Connect Instagram
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    Shopping Tags
                  </Badge>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    Story Features
                  </Badge>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    Business Profile
                  </Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Coming Soon Section */}
      <div className="mt-8 bg-gray-900/50 border border-gray-600 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-1">More Platforms Coming Soon</h4>
            <p className="text-gray-400 text-sm">Expand your reach with additional marketplace integrations</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-600/20 rounded-full flex items-center justify-center">
              <span className="text-orange-400 text-xs font-bold">E</span>
            </div>
            <div className="w-8 h-8 bg-yellow-600/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-xs font-bold">A</span>
            </div>
            <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-orange-500/30 text-orange-300">
            Etsy Integration
          </Badge>
          <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
            Amazon Handmade
          </Badge>
          <Badge variant="outline" className="border-green-500/30 text-green-300">
            WhatsApp Business
          </Badge>
        </div>
      </div>
    </div>
  )
}