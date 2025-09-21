"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Facebook } from "lucide-react"
import { FacebookProfileViewer } from "./facebook-profile-viewer"

export function FacebookConnectButton() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check URL for access token after OAuth redirect
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('access_token')
    const connected = urlParams.get('facebook_connected')
    const error = urlParams.get('error')

    if (error) {
      console.error('Facebook connection error:', error)
      return
    }

    if (token && connected) {
      setAccessToken(token)
      setIsConnected(true)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleConnect = () => {
    window.location.href = '/api/facebook/auth'
  }

  const handleDisconnect = () => {
    setAccessToken(null)
    setIsConnected(false)
  }

  if (isConnected && accessToken) {
    return (
      <FacebookProfileViewer 
        accessToken={accessToken} 
        onClose={handleDisconnect}
      />
    )
  }

  return (
    <Button onClick={handleConnect} className="flex items-center gap-2">
      <Facebook className="h-4 w-4" />
      Connect Facebook
    </Button>
  )
}