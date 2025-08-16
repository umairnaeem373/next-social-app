"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  MoreVertical,
  Search,
  Phone,
  Video,
  Paperclip,
  Smile,
  Menu,
  ArrowLeft,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Messages from "@/components/Messages";
import { User } from "../page";
import { getAvatarColor, getInitials } from "../../../utils/helper";

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [contact, setContact] = useState<User | any>({
    children: [],
    code: "",
    codeCreatedAt: "",
    createdAt: "",
    email: "",
    fullName: "",
    gender: "male",
    id: "",
    isBlock: false,
    isComplete: false,
    isDeleted: false,
    isVerified: false,
    password: "",
    passwordChangedRequest: false,
    phoneNum: "",
    role: "parent",
    updatedAt: "",
    __v: 0,
    _id: "",
  });
  const [userId] = useState("user-123");
  const [reciever, setReciever] = useState("1");

  const [messages, setMessages] = useState<any>([
    {
      id: "1",
      text: "Hey! How's your day going?",
      sender: "other",
      timestamp: "10:30 AM",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      senderName: "Sarah Wilson",
    },
    {
      id: "2",
      text: "Pretty good! Just working on some new projects. How about you?",
      sender: "me",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      text: "Same here! I'm excited about the new design system we're implementing.",
      sender: "other",
      timestamp: "10:35 AM",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      senderName: "Sarah Wilson",
    },
    {
      id: "4",
      text: "That sounds amazing! I'd love to hear more about it sometime.",
      sender: "me",
      timestamp: "10:36 AM",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const contacts = [
    {
      id: "1",
      fullName: "Sarah Wilson",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      lastMessage: "That sounds amazing! I'd love to...",
      createdAt: "2024-01-15T10:36:00Z",
      children: [],
      isVerified: true,
    },
    {
      id: "2",
      fullName: "Mike Johnson",
      avatar: null,
      lastMessage: "Let's catch up tomorrow",
      createdAt: "2024-01-15T09:15:00Z",
      children: [{}, {}], // 2 unread messages
      isVerified: false,
    },
    {
      id: "3",
      fullName: "Team Design",
      avatar:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=40&h=40&fit=crop&crop=face",
      lastMessage: "New mockups are ready",
      createdAt: "2024-01-14T15:30:00Z",
      children: [{}, {}, {}, {}, {}], // 5 unread messages
      isVerified: true,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div
      className={`flex h-screen relative ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Card
        className={`
        w-80 border-r flex flex-col rounded-none border-t-0 border-l-0 border-b-0
        fixed md:relative inset-y-0 left-0 z-30
        transform transition-transform duration-300 ease-in-out
        md:transform-none md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
      `}
      >
        {/* Sidebar Header */}
        <div
          className={`p-4 md:p-6 border-b ${
            darkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h1
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Messages
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className={
                  darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className={`md:hidden ${
                  darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <Input
              type="text"
              placeholder="Search conversations..."
              className={`pl-10 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {contacts &&
            contacts.map((c) => (
              <div
                key={c.id}
                className={`p-3 md:p-4 border-b cursor-pointer transition-colors ${
                  c.id === contact.id
                    ? 'border-l-4 border-l-blue-500 border-b-0'
                    : "border-gray-50 hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSidebarOpen(false);
                  setContact(c);
                  setReciever(c.id);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10 md:w-12 md:h-12">
                      <AvatarImage src={(c.avatar = "")} alt={c.fullName} />
                      <AvatarFallback
                        className={`${getAvatarColor(
                          c.fullName,
                          darkMode
                        )} text-white text-sm md:text-base`}
                      >
                        {getInitials(c.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    {c.isVerified && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-medium truncate text-sm md:text-base ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {c.fullName}
                      </h3>
                      <span
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {c.createdAt.split("T")[1].slice(0, 5)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p
                        className={`text-xs md:text-sm truncate ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {c.id}
                      </p>
                      {c.children.length > 0 && (
                        <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-0.5 md:py-1 min-w-[18px] md:min-w-[20px]">
                          {c.children.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Main Chat Area */}
      {contact.id && (
        <div className="flex-1 flex flex-col md:ml-0">
          {/* Chat Header */}
          <Card
            className={'border-b rounded-none border-t-0 border-l-0 border-r-0 px-4 md:px-6 py-3 md:py-4'}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className={'md:hidden -ml-2'}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <Avatar className="w-10 h-10 md:w-12 md:h-12">
                  <AvatarImage src={contact.avatar} alt={contact.fullName} />
                  <AvatarFallback
                    className={`${getAvatarColor(
                      contact.fullName,
                      darkMode
                    )} text-white text-sm md:text-base`}
                  >
                    {getInitials(contact.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2
                    className={`font-medium text-sm md:text-base ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {contact.fullName}
                  </h2>
                  <p
                    className={`text-xs md:text-sm ${
                      contact.isVerified ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    {contact.isVerified ? "Active now" : "Last Seen"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }
                >
                  <Video className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }
                >
                  <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Messages Area */}
          <Messages userId={userId} messages={messages} darkMode={darkMode} />

          {/* Message Input */}
          <Card
            className={`border-t rounded-none border-l-0 border-r-0 border-b-0 p-3 md:p-4 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className={`flex-shrink-0 ${
                  darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
                  placeholder="Type a message..."
                  className={`pr-10 md:pr-12 rounded-full ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 p-1 ${
                    darkMode
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Smile className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="p-2 md:p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full disabled:opacity-50 flex-shrink-0"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
