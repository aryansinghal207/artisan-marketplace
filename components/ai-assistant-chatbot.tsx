"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Send, Minimize2, Maximize2, X, Bot, Globe } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

type Language = 'en' | 'hi'

const translations = {
  en: {
    assistant: "AI Assistant",
    online: "Online • Ready to help",
    placeholder: "Ask me anything about your craft business...",
    greeting: "Hello! I'm your AI assistant. I can help you with product listings, pricing strategies, marketplace optimization, and customer inquiries. How can I assist you today?",
    suggestedQuestions: [
      "How do I price my handmade jewelry?",
      "Which platform is best for pottery?",
      "How to improve product photos?",
      "What are trending keywords for crafts?"
    ],
    tryAsking: "Try asking:",
    responses: {
      pricing: "For handmade jewelry pricing, consider: 1) Material costs × 2-3, 2) Time spent × desired hourly rate, 3) Market research on similar items, 4) Add 20-30% for profit margin. Price uniqueness and craftsmanship premium!",
      platform: "For pottery, I recommend: Etsy (handmade focus), Instagram Shopping (visual appeal), Facebook Marketplace (local sales), and your own website. Start with Etsy for built-in craft audience!",
      photos: "Great product photos tips: 1) Use natural lighting, 2) Show multiple angles, 3) Include scale reference, 4) Highlight unique details, 5) Use consistent background, 6) Show product in use. Good photos increase sales by 40%!",
      keywords: "Trending craft keywords: 'handmade', 'artisan', 'custom', 'eco-friendly', 'personalized', 'unique gift', 'small business', 'handcrafted'. Use long-tail keywords like 'custom handmade wooden jewelry box'!",
      default: "I can help you with pricing strategies, platform selection, photo optimization, keyword research, inventory management, and customer service. What specific area would you like to explore?"
    }
  },
  hi: {
    assistant: "AI सहायक",
    online: "ऑनलाइन • मदद के लिए तैयार",
    placeholder: "अपने शिल्प व्यवसाय के बारे में कुछ भी पूछें...",
    greeting: "नमस्ते! मैं आपका AI सहायक हूं। मैं उत्पाद सूची, मूल्य निर्धारण रणनीति, बाजार अनुकूलन और ग्राहक पूछताछ में आपकी सहायता कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
    suggestedQuestions: [
      "हस्तनिर्मित गहनों की कीमत कैसे तय करूं?",
      "मिट्टी के बर्तनों के लिए कौन सा प्लेटफॉर्म सबसे अच्छा है?",
      "उत्पाद की तस्वीरों को कैसे बेहतर बनाएं?",
      "शिल्प के लिए ट्रेंडिंग कीवर्ड क्या हैं?"
    ],
    tryAsking: "पूछने की कोशिश करें:",
    responses: {
      pricing: "हस्तनिर्मित गहनों के मूल्य निर्धारण के लिए: 1) सामग्री लागत × 2-3, 2) समय × वांछित घंटे की दर, 3) समान वस्तुओं पर बाजार अनुसंधान, 4) लाभ मार्जिन के लिए 20-30% जोड़ें। अनोखेपन और शिल्पकारी का प्रीमियम मूल्य रखें!",
      platform: "मिट्टी के बर्तनों के लिए मैं सुझाता हूं: Etsy (हस्तनिर्मित फोकस), Instagram Shopping (दृश्य अपील), Facebook Marketplace (स्थानीय बिक्री), और आपकी अपनी वेबसाइट। शिल्प दर्शकों के लिए Etsy से शुरुआत करें!",
      photos: "बेहतरीन उत्पाद फोटो टिप्स: 1) प्राकृतिक प्रकाश का उपयोग करें, 2) कई कोण दिखाएं, 3) आकार संदर्भ शामिल करें, 4) अनोखी विवरण हाइलाइट करें, 5) सुसंगत पृष्ठभूमि का उपयोग करें, 6) उपयोग में उत्पाद दिखाएं। अच्छी तस्वीरें 40% तक बिक्री बढ़ाती हैं!",
      keywords: "ट्रेंडिंग शिल्प कीवर्ड: 'हस्तनिर्मित', 'कारीगर', 'कस्टम', 'पर्यावरण-अनुकूल', 'व्यक्तिगत', 'अनोखा उपहार', 'छोटा व्यवसाय', 'हस्तशिल्प'। लंबे कीवर्ड का उपयोग करें जैसे 'कस्टम हस्तनिर्मित लकड़ी का गहना बॉक्स'!",
      default: "मैं मूल्य निर्धारण रणनीति, प्लेटफॉर्म चयन, फोटो अनुकूलन, कीवर्ड अनुसंधान, इन्वेंट्री प्रबंधन और ग्राहक सेवा में आपकी सहायता कर सकता हूं। आप किस विशिष्ट क्षेत्र का पता लगाना चाहते हैं?"
    }
  }
}

export function AIAssistantChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [language, setLanguage] = useState<Language>('en')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const t = translations[language]

  // Initialize messages when language changes
  useEffect(() => {
    setMessages([{
      id: '1',
      type: 'ai',
      content: t.greeting,
      timestamp: new Date()
    }])
  }, [language, t.greeting])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentMessage = message
    setMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(currentMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    if (lowerMessage.includes('price') || lowerMessage.includes('pricing') || lowerMessage.includes('कीमत') || lowerMessage.includes('मूल्य')) return t.responses.pricing
    if (lowerMessage.includes('platform') || lowerMessage.includes('where') || lowerMessage.includes('प्लेटफॉर्म') || lowerMessage.includes('कहां')) return t.responses.platform
    if (lowerMessage.includes('photo') || lowerMessage.includes('image') || lowerMessage.includes('तस्वीर') || lowerMessage.includes('फोटो')) return t.responses.photos
    if (lowerMessage.includes('keyword') || lowerMessage.includes('seo') || lowerMessage.includes('कीवर्ड')) return t.responses.keywords
    return t.responses.default
  }

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en')
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg z-50 flex items-center justify-center"
        size="sm"
      >
        <MessageCircle className="w-5 h-5" />
      </Button>
    )
  }

  return (
    <Card className={`fixed bg-gray-800/95 backdrop-blur-md border-gray-700 shadow-2xl z-50 transition-all duration-300 ${
      isMinimized 
        ? 'bottom-4 right-4 w-72 h-12' 
        : 'bottom-4 right-4 w-80 max-h-[85vh] flex flex-col'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-3 h-3 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-white text-sm">{t.assistant}</h3>
            {!isMinimized && (
              <p className="text-xs text-gray-400">{t.online}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-gray-400 hover:text-white p-1 h-6 w-6"
          >
            <Globe className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white p-1 h-6 w-6"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white p-1 h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages - Scrollable area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2 rounded-lg text-xs ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  <div className="flex items-start space-x-1">
                    {msg.type === 'ai' && (
                      <Bot className="w-3 h-3 mt-0.5 text-purple-400 flex-shrink-0" />
                    )}
                    <p className="text-xs leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 p-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <Bot className="w-3 h-3 text-purple-400" />
                    <div className="flex space-x-0.5">
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div className="px-3 pb-2 flex-shrink-0">
            <p className="text-xs text-gray-400 mb-1">{t.tryAsking}</p>
            <div className="flex flex-wrap gap-1">
              {t.suggestedQuestions.slice(0, 2).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700 h-6 px-2 py-1"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question.length > 15 ? question.substring(0, 15) + '...' : question}
                </Button>
              ))}
            </div>
          </div>

          {/* Input - Always at bottom */}
          <div className="p-3 border-t border-gray-700 flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 h-8 text-xs"
                onKeyPress={handleKeyPress}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-8 w-8 p-0 flex-shrink-0"
                size="sm"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}