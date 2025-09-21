"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Instagram, User, Save, ExternalLink } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { InstagramProfileViewer } from "./instagram-profile-viewer"

export function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    bio: "Handcrafted jewelry artisan specializing in sterling silver designs",
    location: "Portland, Oregon",
    instagramHandle: "@sarahjewelrycraft",
    instagramConnected: false,
    instagramAccessToken: "",
    instagramUserId: "",
    autoPost: true,
    includeMusic: true,
    defaultHashtags: "#HandmadeWithLove #ArtisanMade #SupportLocal #UniqueDesign",
  })

  const [showInstagramProfile, setShowInstagramProfile] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    const userId = urlParams.get("user_id")

    if (token && userId) {
      setProfile((prev) => ({
        ...prev,
        instagramConnected: true,
        instagramAccessToken: token,
        instagramUserId: userId,
      }))

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("artisan-profile", JSON.stringify(profile))
    console.log(
      "[v0] Profile settings saved:",
      profile.instagramConnected ? "Instagram connected" : "Instagram not connected",
    )
    alert("Profile settings saved successfully!")
  }

  const connectInstagram = () => {
    console.log("[v0] Redirecting to Instagram OAuth...")
    window.location.href = "/api/instagram/auth"
  }

  const viewInstagramProfile = () => {
    if (profile.instagramAccessToken) {
      setShowInstagramProfile(true)
    } else {
      alert("Please connect your Instagram account first")
    }
  }

  if (showInstagramProfile) {
    return (
      <InstagramProfileViewer
        accessToken={profile.instagramAccessToken}
        onClose={() => setShowInstagramProfile(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-balance">Profile Settings</h2>
        <p className="text-muted-foreground mt-2">Manage your artisan profile and social media integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Instagram Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Instagram className="h-5 w-5 mr-2" />
              Instagram Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.instagramConnected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Connected</span>
                  </div>
                  <span className="text-sm text-green-600">{profile.instagramHandle}</span>
                </div>

                <div>
                  <Label htmlFor="instagram-handle">Instagram Handle</Label>
                  <Input
                    id="instagram-handle"
                    value={profile.instagramHandle}
                    onChange={(e) => setProfile((prev) => ({ ...prev, instagramHandle: e.target.value }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-post">Auto-post new products</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically post to Instagram when adding products
                    </p>
                  </div>
                  <Switch
                    id="auto-post"
                    checked={profile.autoPost}
                    onCheckedChange={(checked) => setProfile((prev) => ({ ...prev, autoPost: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="include-music">Include trending music</Label>
                    <p className="text-sm text-muted-foreground">Add AI-suggested music to Instagram posts</p>
                  </div>
                  <Switch
                    id="include-music"
                    checked={profile.includeMusic}
                    onCheckedChange={(checked) => setProfile((prev) => ({ ...prev, includeMusic: checked }))}
                  />
                </div>

                <div>
                  <Label htmlFor="default-hashtags">Default Hashtags</Label>
                  <Textarea
                    id="default-hashtags"
                    value={profile.defaultHashtags}
                    onChange={(e) => setProfile((prev) => ({ ...prev, defaultHashtags: e.target.value }))}
                    rows={2}
                    placeholder="Enter default hashtags separated by spaces"
                  />
                </div>

                <Button variant="outline" className="w-full bg-transparent" onClick={viewInstagramProfile}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Instagram Profile
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <Instagram className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Connect Your Instagram</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your Instagram account to automatically post your products with AI-generated content
                  </p>
                  <Button
                    onClick={connectInstagram}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Connect Instagram
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Instagram Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">127</div>
              <div className="text-sm text-muted-foreground">Posts This Month</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">2.4K</div>
              <div className="text-sm text-muted-foreground">Average Reach</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">89%</div>
              <div className="text-sm text-muted-foreground">Engagement Rate</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">45</div>
              <div className="text-sm text-muted-foreground">Products Sold</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
