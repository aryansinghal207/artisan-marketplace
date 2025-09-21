import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AIAssistantChatbot } from '@/components/ai-assistant-chatbot'

export const metadata: Metadata = {
  title: ' - Kalakart | AI-Powered Indian Artisan Platform',
  description: 'Transform your handmade products into thriving online businesses with AI-driven listing optimization for Indian artisans.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gradient-to-br from-red-950 via-orange-950 to-yellow-950 text-white min-h-screen">
        {children}
        <Toaster />
        <AIAssistantChatbot />
      </body>
    </html>
  )
}
