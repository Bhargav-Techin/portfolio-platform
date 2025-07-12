'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, Send, Bot, User, Loader2, X } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatbotProps {
  isOpen: boolean
  onToggle: () => void
  username?: string
}

interface Portfolio {
  username: string
  fullName?: string
  openRouterApiKey?: string
  [key: string]: any
}

const PortfolioChatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle, username }) => {
  const params = useParams()
  const portfolioUsername = username || params?.username as string
  
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [portfolioLoading, setPortfolioLoading] = useState(false)
  const [portfolioError, setPortfolioError] = useState<string | null>(null)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch portfolio data by username
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!portfolioUsername) return

      setPortfolioLoading(true)
      setPortfolioError(null)

      try {
        const response = await fetch(`/api/fetch-portfolio/${portfolioUsername}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Portfolio not found')
          }
          throw new Error('Failed to fetch portfolio data')
        }

        const data = await response.json()
        setPortfolio(data.portfolio)
      } catch (error) {
        console.error('Error fetching portfolio:', error)
        setPortfolioError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setPortfolioLoading(false)
      }
    }

    fetchPortfolio()
  }, [portfolioUsername])

  // Initialize welcome message when portfolio loads
  useEffect(() => {
    if (portfolio) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hello! I'm ${portfolio?.fullName || portfolioUsername}'s portfolio assistant. I can help answer questions about their background, skills, projects, and experience. What would you like to know?`,
          timestamp: new Date()
        }
      ])
    }
  }, [portfolio, portfolioUsername])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !portfolio) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          portfolio: portfolio,
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your message. Please make sure the portfolio owner has configured their OpenRouter API key correctly.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Define types for formatted message parts
  type TextPart = { type: 'text'; content: string }
  type LinkPart = { type: 'link'; text: string; url: string }
  type BoldPart = { type: 'bold'; text: string }
  type MessagePart = TextPart | LinkPart | BoldPart

  const formatMessageContent = (content: string): MessagePart[] => {
    // Parse content for custom markers
    const parts: MessagePart[] = []
    let currentIndex = 0
    
    // First, find all links with # markers: #text|url#
    const linkRegex = /#([^|#]+)\|([^#]+)#/g
    const boldRegex = /\*([^*]+)\*/g
    
    // Collect all markers with their positions
    const markers: Array<
      ({
        start: number
        end: number
        type: 'link'
        text: string
        url: string
        fullMatch: string
      } | {
        start: number
        end: number
        type: 'bold'
        text: string
        fullMatch: string
      })
    > = []
    
    // Find links
    let linkMatch
    while ((linkMatch = linkRegex.exec(content)) !== null) {
      markers.push({
        start: linkMatch.index,
        end: linkMatch.index + linkMatch[0].length,
        type: 'link',
        text: linkMatch[1], // Link text
        url: linkMatch[2],   // URL
        fullMatch: linkMatch[0]
      })
    }
    
    // Find bold text
    let boldMatch
    while ((boldMatch = boldRegex.exec(content)) !== null) {
      markers.push({
        start: boldMatch.index,
        end: boldMatch.index + boldMatch[0].length,
        type: 'bold',
        text: boldMatch[1], // Bold text
        fullMatch: boldMatch[0]
      })
    }
    
    // Sort markers by position
    markers.sort((a, b) => a.start - b.start)
    
    // Remove overlapping markers (links take priority over bold)
    const cleanMarkers: typeof markers = []
    markers.forEach(marker => {
      const hasOverlap = cleanMarkers.some(existing => {
        return (marker.start >= existing.start && marker.start < existing.end) ||
               (marker.end > existing.start && marker.end <= existing.end) ||
               (existing.start >= marker.start && existing.start < marker.end)
      })
      if (!hasOverlap) {
        cleanMarkers.push(marker)
      } else if (marker.type === 'link') {
        // If there's overlap and current is a link, replace the existing
        const overlapIndex = cleanMarkers.findIndex(existing => 
          (marker.start >= existing.start && marker.start < existing.end) ||
          (marker.end > existing.start && marker.end <= existing.end) ||
          (existing.start >= marker.start && existing.start < marker.end)
        )
        if (overlapIndex !== -1) {
          cleanMarkers[overlapIndex] = marker
        }
      }
    })
    
    // Build parts array
    let lastIndex = 0
    cleanMarkers.forEach(marker => {
      // Add text before marker
      if (marker.start > lastIndex) {
        const beforeText = content.slice(lastIndex, marker.start)
        if (beforeText) {
          parts.push({
            type: 'text',
            content: beforeText
          })
        }
      }
      
      // Add the marker
      if (marker.type === 'link') {
        parts.push({
          type: 'link',
          text: marker.text,
          url: marker.url
        })
      } else if (marker.type === 'bold') {
        parts.push({
          type: 'bold',
          text: marker.text
        })
      }
      lastIndex = marker.end
    })
    
    // Add remaining text
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex)
      if (remainingText) {
        parts.push({
          type: 'text',
          content: remainingText
        })
      }
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', content: content }]
  }

  const renderFormattedContent = (content: string) => {
    const parts = formatMessageContent(content)
    
    return (
      <div className="whitespace-pre-wrap break-words word-wrap overflow-wrap-anywhere leading-relaxed">
        {parts.map((part, index) => {
          if (part.type === 'link') {
            return (
              <a
                key={index}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200 cursor-pointer"
              >
                {part.text}
              </a>
            )
          } else if (part.type === 'bold') {
            return (
              <span key={index} className="font-semibold text-gray-900">
                {part.text}
              </span>
            )
          } else {
            return (
              <span key={index}>
                {part.content}
              </span>
            )
          }
        })}
      </div>
    )
  }

  const clearChat = () => {
    if (portfolio) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hello! I'm ${portfolio?.fullName || portfolioUsername}'s portfolio assistant. I can help answer questions about their background, skills, projects, and experience. What would you like to know?`,
          timestamp: new Date()
        }
      ])
    }
  }

  if (!isOpen) return null

  // Show loading state while fetching portfolio
  if (portfolioLoading) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <Card className="w-96 shadow-2xl border-2 h-32">
          <CardContent className="p-6 flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading portfolio...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state
  if (portfolioError) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <Card className="w-96 shadow-2xl border-2 border-red-200">
          <CardHeader className="p-3 bg-red-50 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-red-600">
              Portfolio Assistant - Error
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-red-600">{portfolioError}</p>
            <p className="text-xs text-gray-500 mt-2">
              Please check the username and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Don't render if no portfolio data
  if (!portfolio) return null

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Card className="w-96 h-[500px] shadow-2xl border-2 flex flex-col">
        <CardHeader className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg flex-shrink-0">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Portfolio Assistant
            {portfolio?.fullName && (
              <span className="text-xs opacity-80">for {portfolio.fullName}</span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 flex flex-col flex-1 min-h-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 min-h-0 bg-gradient-to-b from-gray-50/30 to-transparent">
            <div className="space-y-4 max-w-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 max-w-full ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`flex-1 min-w-0 ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block p-3 rounded-lg text-sm max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-md'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                    }`}>
                      <div className="whitespace-pre-wrap break-words word-wrap overflow-wrap-anywhere leading-relaxed">
                      {renderFormattedContent(message.content)}
                      </div>
                    </div>
                    <div className={`text-xs text-gray-400 mt-1 px-1 ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="inline-block p-3 rounded-lg rounded-bl-none bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 text-sm border border-gray-200 shadow-sm max-w-[85%]">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        <span className="text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white flex-shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about the portfolio..."
                disabled={isLoading}
                className="flex-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="flex justify-between items-center mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1"
              >
                🗑️ Clear Chat
              </Button>
              <div className="text-xs text-gray-400">
                {!portfolio?.openRouterApiKey && (
                  <span className="text-amber-600 font-medium">⚠️ API key required</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Floating Action Button Component
export const ChatbotFAB: React.FC<{ username?: string }> = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Action Button - always visible */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>
      
      {/* Chat Window - only show when chat is open */}
      {isOpen && (
        <PortfolioChatbot 
          isOpen={isOpen} 
          onToggle={() => setIsOpen(!isOpen)} 
          username={username}
        />
      )}
    </div>
  )
}

export default PortfolioChatbot