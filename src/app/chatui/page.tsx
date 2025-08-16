'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video, 
  Search,
  Settings,
  MessageCircle,
  Users,
  Archive,
  Star,
  Menu,
  X,
  Plus,
  Filter
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface Message {
  id: string
  content: string
  sender: 'user' | 'contact'
  timestamp: Date
  status?: 'sent' | 'delivered' | 'read'
}

interface Contact {
  id: string
  name: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  isOnline: boolean
  lastSeen?: Date
  isTyping?: boolean
  isPinned?: boolean
  isArchived?: boolean
}

interface Chat {
  contactId: string
  messages: Message[]
}

const CompleteChatUI: React.FC = () => {
  // Sample contacts data
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Hey, are we still meeting today?',
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2,
      isOnline: true,
      isPinned: true
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Thanks for the help!',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0,
      isOnline: false,
      lastSeen: new Date(Date.now() - 1800000)
    },
    {
      id: '3',
      name: 'Carol Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Can you send me the files?',
      lastMessageTime: new Date(Date.now() - 7200000),
      unreadCount: 1,
      isOnline: true,
      isTyping: true
    },
    {
      id: '4',
      name: 'David Wilson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Great job on the presentation!',
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 0,
      isOnline: false,
      lastSeen: new Date(Date.now() - 43200000)
    },
    {
      id: '5',
      name: 'Emma Brown',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Let\'s catch up soon!',
      lastMessageTime: new Date(Date.now() - 172800000),
      unreadCount: 0,
      isOnline: true
    }
  ])

  const [chats] = useState<Record<string, Chat>>({
    '1': {
      contactId: '1',
      messages: [
        {
          id: '1',
          content: 'Hey there! How are you doing?',
          sender: 'contact',
          timestamp: new Date(Date.now() - 600000),
          status: 'read'
        },
        {
          id: '2',
          content: 'I\'m good! Just working on some projects.',
          sender: 'user',
          timestamp: new Date(Date.now() - 540000),
          status: 'read'
        },
        {
          id: '3',
          content: 'That\'s awesome! Hey, are we still meeting today?',
          sender: 'contact',
          timestamp: new Date(Date.now() - 300000),
          status: 'delivered'
        }
      ]
    },
    '2': {
      contactId: '2',
      messages: [
        {
          id: '1',
          content: 'Could you help me with the React component?',
          sender: 'contact',
          timestamp: new Date(Date.now() - 7200000),
          status: 'read'
        },
        {
          id: '2',
          content: 'Sure! I can help you with that. What specifically do you need help with?',
          sender: 'user',
          timestamp: new Date(Date.now() - 7140000),
          status: 'read'
        },
        {
          id: '3',
          content: 'Thanks for the help!',
          sender: 'contact',
          timestamp: new Date(Date.now() - 3600000),
          status: 'read'
        }
      ]
    }
  })

  const [selectedContactId, setSelectedContactId] = useState<string>('1')
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('chats')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedContact = contacts.find(c => c.id === selectedContactId)
  const currentChat = chats[selectedContactId]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContactId) return

    // In a real app, you would update the chat state here
    setNewMessage('')
    
    // Simulate response (in real app, this would come from your chat service)
    setTimeout(() => {
      // Add response logic here
    }, 1000)
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

  const formatLastMessageTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes}m`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`
    if (minutes < 10080) return `${Math.floor(minutes / 1440)}d`
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const formatLastSeen = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const ContactList = () => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>New Group</DropdownMenuItem>
                <DropdownMenuItem>New Contact</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chats" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
            <TabsTrigger value="archived" className="text-xs">Archived</TabsTrigger>
            <TabsTrigger value="groups" className="text-xs">Groups</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Contact List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => {
                setSelectedContactId(contact.id)
                setIsMobileMenuOpen(false)
              }}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                selectedContactId === contact.id ? 'bg-muted' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {contact.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{contact.name}</h3>
                  <div className="flex items-center space-x-1">
                    {contact.lastMessageTime && (
                      <span className="text-xs text-muted-foreground">
                        {formatLastMessageTime(contact.lastMessageTime)}
                      </span>
                    )}
                    {contact.isPinned && (
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.isTyping ? (
                      <span className="text-blue-500 italic">typing...</span>
                    ) : (
                      contact.lastMessage
                    )}
                  </p>
                  {contact.unreadCount > 0 && (
                    <Badge className="h-5 min-w-[20px] text-xs rounded-full bg-blue-500">
                      {contact.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

  const ChatArea = () => (
    <div className="flex flex-col h-full">
      {selectedContact ? (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="h-8 w-8"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback>{selectedContact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h2 className="font-semibold">{selectedContact.name}</h2>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${selectedContact.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-xs text-muted-foreground">
                      {selectedContact.isOnline ? (
                        selectedContact.isTyping ? 'typing...' : 'Online'
                      ) : (
                        `Last seen ${formatLastSeen(selectedContact.lastSeen || new Date())}`
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Media & Files</DropdownMenuItem>
                    <DropdownMenuItem>Search in Chat</DropdownMenuItem>
                    <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                    <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Block Contact</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {currentChat?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {message.sender === 'contact' && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedContact.avatar} />
                        <AvatarFallback>{selectedContact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm break-words">{message.content}</p>
                      <div className={`flex items-center justify-between mt-1 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.sender === 'user' && (
                          <Badge variant="secondary" className="text-xs ml-2 h-4">
                            {message.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {selectedContact.isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end space-x-2 max-w-xs lg:max-w-md xl:max-w-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedContact.avatar} />
                      <AvatarFallback>{selectedContact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-end space-x-2">
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="pr-12 min-h-[40px]"
                />
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="icon"
                className="h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">Choose a contact to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-70 border-r">
        <ContactList />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-70">
          <ContactList />
        </SheetContent>
      </Sheet>

      {/* Chat Area */}
      <div className="flex-1">
        <ChatArea />
      </div>
    </div>
  )
}

export default CompleteChatUI