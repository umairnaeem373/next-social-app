"use client";
import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
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

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState(false);
  const [contact, setContact] = useState({
    id: 1,
    name: "Sarah Wilson",
    avatar:
      "",
    lastMessage: "That sounds amazing! I'd love to...",
    timestamp: "10:36 AM",
    unread: 0,
    active: true,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! How's your day going?",
      sender: "other",
      timestamp: "10:30 AM",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      senderName: "Sarah Wilson",
    },
    {
      id: 2,
      text: "Pretty good! Just working on some new projects. How about you?",
      sender: "me",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      text: "Same here! I'm excited about the new design system we're implementing.",
      sender: "other",
      timestamp: "10:35 AM",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      senderName: "Sarah Wilson",
    },
    {
      id: 4,
      text: "That sounds amazing! I'd love to hear more about it sometime.",
      sender: "me",
      timestamp: "10:36 AM",
    },
  ]);

  const socket = io("http://localhost:8000");
  const userId = sender ? "umair" : "linda";
  const otherUserId = sender ? "linda" : "umair";

  useEffect(() => {
    // Fetch history
    // axios.get(`/api/messages/${otherUserId}`).then(res => setMessages(res.data));

    // Join private room
    socket.emit("joinRoom", { userId, otherUserId });

    // Receive message
    socket.on("receiveMessage", (msg) => {
      console.log(msg, "message...");
      setMessages((prev) => [
        ...prev,
        {
          id: +Date.now(),
          text: msg.message + msg.sender,
          sender: sender ? 'other' : 'me',
          timestamp: "10:38 AM",
        },
      ]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, otherUserId]);

  useEffect(() => {
    setSender(!sender);
    console.log(messages)
  }, [messages]);

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
      socket.emit("sendMessage", {
        sender: "umair",
        receiver: "linda",
        message,
      });
      setMessage("");
    }
  };

  const contacts = [
    {
      id: 1,
      name: "Sarah Wilson",
      avatar: "",
      lastMessage: "That sounds amazing! I'd love to...",
      timestamp: "10:36 AM",
      unread: 0,
      active: true,
    },
    {
      id: 2,
      name: "Mike Johnson",
      avatar: "", // No image available
      lastMessage: "Let's catch up tomorrow",
      timestamp: "9:15 AM",
      unread: 2,
      active: false,
    },
    {
      id: 3,
      name: "Team Design",
      avatar:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=40&h=40&fit=crop&crop=face",
      lastMessage: "New mockups are ready",
      timestamp: "Yesterday",
      unread: 5,
      active: false,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const lightColors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-gray-500",
    ];
    const darkColors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-indigo-600",
      "bg-yellow-600",
      "bg-red-600",
      "bg-gray-600",
    ];
    const colors = darkMode ? darkColors : lightColors;
    const index = name.length % colors.length;
    return colors[index];
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
      <div
        className={`
        w-80 border-r flex flex-col
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
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact, i) => (
            <div
              key={contact.id}
              className={`p-3 md:p-4 border-b cursor-pointer transition-colors ${
                contact.active
                  ? `border-l-4 border-l-blue-500 ${
                      darkMode ? "bg-gray-700/50" : "bg-blue-50"
                    }`
                  : `${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-700"
                        : "border-gray-50 hover:bg-gray-50"
                    }`
              }`}
              onClick={() => {
                setSidebarOpen(false);
                setContact(contact);
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {contact.avatar ? (
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${getAvatarColor(
                        contact.name
                      )} flex items-center justify-center text-white font-medium text-sm md:text-base`}
                    >
                      {getInitials(contact.name)}
                    </div>
                  )}
                  {contact.active && (
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
                      {contact.name}
                    </h3>
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {contact.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p
                      className={`text-xs md:text-sm truncate ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {contact.lastMessage}
                    </p>
                    {contact.unread > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 md:py-1 min-w-[18px] md:min-w-[20px] text-center">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {contact && (
        <div className="flex-1 flex flex-col md:ml-0">
          {/* Chat Header */}
          <div
            className={`border-b px-4 md:px-6 py-3 md:py-4 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className={`md:hidden p-2 rounded-lg transition-colors -ml-2 ${
                    darkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </button>
                {contact.avatar ? (
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${getAvatarColor(
                      contact.name
                    )} flex items-center justify-center text-white font-medium text-sm md:text-base`}
                  >
                    {getInitials(contact.name)}
                  </div>
                )}
                <div>
                  <h2
                    className={`font-medium text-sm md:text-base ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {contact.name}
                  </h2>
                  <p
                    className={`text-xs md:text-sm ${
                      contact.active ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    {contact.active ? "Active now" : "Last Seen"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <button
                  className={`p-1.5 md:p-2 rounded-lg transition-colors ${
                    darkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  className={`p-1.5 md:p-2 rounded-lg transition-colors ${
                    darkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Video className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  className={`p-1.5 md:p-2 rounded-lg transition-colors ${
                    darkMode
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-[85%] sm:max-w-xs md:max-w-md ${
                    msg.sender === "me"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {msg.sender === "other" && (
                    <div className="flex-shrink-0">
                      {msg.avatar ? (
                        <img
                          src={msg.avatar}
                          alt="Avatar"
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${getAvatarColor(
                            msg.senderName || "User"
                          )} flex items-center justify-center text-white font-medium text-xs md:text-sm`}
                        >
                          {getInitials(msg.senderName || "U")}
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <div
                      className={`px-3 md:px-4 py-2 rounded-2xl text-sm md:text-base ${
                        msg.sender === "me"
                          ? "bg-blue-500 text-white"
                          : darkMode
                          ? "bg-gray-700 text-white border border-gray-600"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="break-words">{msg.text}</p>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "me" ? "text-right" : "text-left"
                      } ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div
            className={`border-t p-3 md:p-4 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <button
                type="button"
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                  darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
                  placeholder="Type a message..."
                  className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 md:pr-12 text-sm md:text-base ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <button
                  type="button"
                  className={`absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 p-1 transition-colors ${
                    darkMode
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Smile className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="p-2 md:p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
