"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, ExternalLink, Calendar } from "lucide-react"
import Image from "next/image"

interface InstagramPost {
  id: string
  caption: string
  media_type: string
  media_url: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

interface InstagramProfile {
  id: string
  username: string
  account_type: string
  media_count: number
}

interface InstagramProfileViewerProps {
  accessToken?: string
  onClose: () => void
}

export function InstagramProfileViewer({ accessToken, onClose }: InstagramProfileViewerProps) {
  const [profile, setProfile] = useState<InstagramProfile | null>(null)
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (accessToken) {
      fetchInstagramData()
    } else {
      setError("No access token provided")
      setLoading(false)
    }
  }, [accessToken])

  const fetchInstagramData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/instagram/profile?accessToken=${accessToken}`)
      const data = await response.json()

      if (data.success) {
        setProfile(data.profile)
        setPosts(data.recentPosts)
        console.log("[v0] Instagram profile loaded successfully")
      } else {
        setError(data.error || "Failed to load Instagram profile")
      }
    } catch (err) {
      setError("Failed to connect to Instagram")
      console.error("[v0] Instagram profile fetch error:", err)
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
          <p>Loading your Instagram profile...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <Instagram className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
                <Instagram className="h-6 w-6 mr-2 text-pink-500" />
                Instagram Profile
              </CardTitle>
              <Button onClick={onClose} variant="outline" size="sm">
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Instagram className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">@{profile.username}</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary">{profile.account_type.replace("_", " ").toUpperCase()}</Badge>
                  <span className="text-sm text-muted-foreground">{profile.media_count} posts</span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => window.open(`https://instagram.com/${profile.username}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Instagram
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square relative">
                    <Image
                      src={post.media_type === "VIDEO" ? post.thumbnail_url || post.media_url : post.media_url}
                      alt="Instagram post"
                      fill
                      className="object-cover"
                    />
                    {post.media_type === "VIDEO" && (
                      <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.caption || "No caption"}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.timestamp)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(post.permalink, "_blank")}
                        className="h-6 px-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Instagram className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No posts found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
