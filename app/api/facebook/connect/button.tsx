"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Facebook, AlertCircle } from "lucide-react"
import { FacebookProfileViewer } from "./../profile/viewer"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function FacebookConnectButton() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check URL for access token after OAuth redirect
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('access_token')
    const connected = urlParams.get('facebook_connected')
    const errorParam = urlParams.get('error')
    const message = urlParams.get('message')

    if (errorParam) {
      setError(message || 'Facebook connection failed')
      console.error('Facebook connection error:', errorParam, message)
      return
    }

    if (token && connected) {
      setAccessToken(token)
      setIsConnected(true)
      setError(null)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleConnect = () => {
    setError(null)
    window.location.href = '/api/facebook/auth'
  }

  const handleDisconnect = () => {
    setAccessToken(null)
    setIsConnected(false)
    setError(null)
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <Button onClick={handleConnect} className="flex items-center gap-2">
          <Facebook className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
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
    <div className="space-y-4">
      <Button onClick={handleConnect} className="flex items-center gap-2">
        <Facebook className="h-4 w-4" />
        Connect Facebook
      </Button>
      <div className="text-sm text-muted-foreground">
        <p>Connect your Facebook account to access basic profile information.</p>
        <p className="mt-1">Advanced features require Facebook App Review.</p>
      </div>
    </div>
  )
}