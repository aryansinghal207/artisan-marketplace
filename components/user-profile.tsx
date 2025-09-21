"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Instagram, Package, TrendingUp, ExternalLink, Edit } from "lucide-react"

interface UserProfileProps {
  user: {
    name: string
    email: string
    avatar: string
    instagramHandle: string
    location: string
    joinedDate: string
    totalProducts: number
    totalSales: number
  }
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-balance">My Profile</h2>
        <p className="text-muted-foreground mt-2">Your artisan profile and achievements</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-2xl font-bold">{user.name}</h3>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Verified Artisan
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {user.joinedDate}
                </div>
                <div className="flex items-center">
                  <Instagram className="h-4 w-4 mr-1" />
                  {user.instagramHandle}
                </div>
              </div>

              <p className="text-muted-foreground">
                Passionate artisan creating unique handcrafted jewelry with sustainable materials. Specializing in
                sterling silver designs that tell stories and connect hearts.
              </p>
            </div>

            <Button variant="outline" className="shrink-0 bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{user.totalProducts}</p>
                <p className="text-sm text-muted-foreground">Products Listed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{user.totalSales}</p>
                <p className="text-sm text-muted-foreground">Total Sales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Instagram className="h-8 w-8 text-pink-600" />
              <div>
                <p className="text-2xl font-bold">2.4K</p>
                <p className="text-sm text-muted-foreground">Instagram Followers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 font-bold">★</span>
              </div>
              <div>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sterling Silver Moon Pendant", date: "2 days ago", status: "Active" },
                { name: "Handwoven Copper Bracelet", date: "5 days ago", status: "Sold" },
                { name: "Ceramic Glazed Vase", date: "1 week ago", status: "Active" },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.date}</p>
                  </div>
                  <Badge variant={product.status === "Sold" ? "default" : "secondary"}>{product.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instagram Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Posts this month</span>
                <span className="font-bold">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Average engagement</span>
                <span className="font-bold">8.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Reach</span>
                <span className="font-bold">12.5K</span>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Instagram Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
