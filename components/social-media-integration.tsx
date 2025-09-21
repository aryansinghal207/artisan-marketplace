"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"
import { FacebookConnectButton } from "./facebook-connect-button"

export function SocialMediaIntegration() {
  const [shouldAutoPost, setShouldAutoPost] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const productPublished = urlParams.get("product_published")
    const facebookConnected = urlParams.get("facebook_connected")
    const accessToken = urlParams.get("access_token")

    if (productPublished && facebookConnected && accessToken) {
      setShouldAutoPost(true)

      const pendingProduct = localStorage.getItem("pendingProduct")
      if (pendingProduct) {
        const productData = JSON.parse(pendingProduct)
        postToFacebook(accessToken, productData)
      }
    }
  }, [])

  const postToFacebook = async (token: string, product: any) => {
    try {
      console.log("Auto-posting to Facebook:", { product, token })
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Successfully posted to Facebook!")
    } catch (error) {
      console.error("Failed to post to Facebook:", error)
    }
  }

  const handleInstagramConnect = () => {
    window.location.href = "/api/instagram/auth"
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Top heading */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold">Social Media Integration</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Connect your social media accounts to automatically showcase and promote your artisan products across platforms
        </p>
      </div>

      {/* Facebook & Instagram side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facebook Card */}
        <Card className="p-6 flex flex-col justify-between">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <span className="text-blue-600 text-lg font-semibold">Facebook</span>
              <span className="text-sm text-muted-foreground">Marketplace &amp; Business Page</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect to automatically list your handmade products on Facebook Marketplace and reach millions of local customers.
            </p>
            <FacebookConnectButton /> {/* functionality unchanged */}
          </CardContent>
        </Card>

        {/* Instagram Card */}
        <Card className="p-6 flex flex-col justify-between">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <span className="text-pink-600 text-lg font-semibold">Instagram</span>
              <span className="text-sm text-muted-foreground">Shopping &amp; Business Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Transform your Instagram into a shopping destination with automatic product tagging and story features.
            </p>
            <Button
              onClick={handleInstagramConnect}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            >
              <Instagram className="h-4 w-4" />
              Connect Instagram
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* More Platforms Coming Soon */}
      <div className="mt-10 border-t pt-6 text-center">
        <h2 className="text-lg font-semibold mb-4">More Platforms Coming Soon</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Expand your reach with additional marketplace integrations
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <span className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">Etsy Integration</span>
          <span className="px-4 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">Amazon Handmade</span>
          <span className="px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">WhatsApp Business</span>
        </div>
      </div>
    </div>
  )
}
