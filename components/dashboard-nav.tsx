"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Search, Plus } from "lucide-react"
import Link from "next/link"

export function DashboardNav() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AH</span>
            </div>
            <span className="font-bold text-gray-900">ArtisanHub</span>
            <span className="text-sm text-gray-500">Your Creative Marketplace</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <Link href="/add-product">
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>

          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          <Avatar>
            <AvatarFallback>YO</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  )
}