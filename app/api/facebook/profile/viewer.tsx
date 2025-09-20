"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Facebook, ExternalLink, Calendar, AlertCircle } from "lucide-react"
import Image from "next/image"

interface FacebookPost {
  id: string
  message?: string
  created_time: string
  picture?: string
  permalink_url: string
}

interface FacebookPage {
  id: string
  name: string
  access_token: string
  category: string
}

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
  const [pages, setPages] = useState<FacebookPage[]>([])
  const [posts, setPosts] = useState<FacebookPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (accessToken) {
      fetchFacebookData()
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
        setPages(data.pages)
        setPosts(data.recentPosts)
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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
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
      {/* Profile Header */}
      {profile && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Facebook className="h-6 w-6 mr-2 text-blue-600" />
                Facebook Profile Connected
              </CardTitle>
              <Button onClick={onClose} variant="outline" size="sm">
                Disconnect
              </Button>
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

      {/* Permissions Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
            Limited Access Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Currently showing basic profile information only. To access pages and posts, 
            this app would need to undergo Facebook's App Review process for advanced permissions.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold text-sm">✅ Available</h4>
              <ul className="text-xs text-muted-foreground mt-1">
                <li>• Basic profile info</li>
                <li>• Profile picture</li>
                <li>• Email address</li>
              </ul>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold text-sm">🔒 Requires Review</h4>
              <ul className="text-xs text-muted-foreground mt-1">
                <li>• Manage Facebook pages</li>
                <li>• Read page posts</li>
                <li>• Post to pages</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pages Section */}
      {pages.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Managed Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pages.map((page) => (
                <div key={page.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{page.name}</h4>
                  <Badge variant="outline" className="mt-2">{page.category}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Facebook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Pages Available</h3>
            <p className="text-muted-foreground text-sm">
              Page management requires additional permissions that need Facebook App Review.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Posts Section */}
      {posts.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {post.picture && (
                    <div className="aspect-square relative">
                      <Image
                        src={post.picture}
                        alt="Facebook post"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {post.message || "No caption"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.created_time)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(post.permalink_url, "_blank")}
                        className="h-6 px-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Facebook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Posts Available</h3>
            <p className="text-muted-foreground text-sm">
              Reading posts requires additional permissions that need Facebook App Review.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}