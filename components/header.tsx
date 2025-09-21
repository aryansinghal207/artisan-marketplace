"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings, User, ChevronDown } from "lucide-react"
import { ProfileSettings } from "./profile-settings"
import { UserProfile } from "./user-profile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const [user] = useState({
    name: "Sarah Johnson",
    email: "sarah@artisanhub.com",
    avatar: "/artisan-woman-profile.jpg",
    instagramHandle: "@sarahjewelrycraft",
    location: "Portland, Oregon",
    joinedDate: "March 2024",
    totalProducts: 47,
    totalSales: 156,
  })

  if (showSettings) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-primary">ArtisanHub</h1>
                <p className="text-muted-foreground">Your Creative Marketplace</p>
              </div>
              <Button variant="ghost" onClick={() => setShowSettings(false)}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <ProfileSettings />
        </main>
      </div>
    )
  }

  if (showProfile) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-primary">ArtisanHub</h1>
                <p className="text-muted-foreground">Your Creative Marketplace</p>
              </div>
              <Button variant="ghost" onClick={() => setShowProfile(false)}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <UserProfile user={user} />
        </main>
      </div>
    )
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">ArtisanHub</h1>
            <p className="text-muted-foreground">Your Creative Marketplace</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowProfile(true)}>
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
