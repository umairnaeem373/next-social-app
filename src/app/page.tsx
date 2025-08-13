"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
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
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import Messages from "./signup/components/Messages";
import { getAvatarColor, getInitials } from "../../utils/helper";

export default function ChatApp() {
  useAuthRedirect();

  interface User {
    children: string[]; // Array of child IDs
    code: string;
    codeCreatedAt: string; // ISO date string
    createdAt: string; // ISO date string
    email: string;
    fullName: string;
    gender: "male" | "female" | "other";
    id: string;
    isBlock: boolean;
    isComplete: boolean;
    isDeleted: boolean;
    isVerified: boolean;
    password: string; // Hashed password
    passwordChangedRequest: boolean;
    phoneNum: string;
    role: "parent" | "child" | "admin";
    updatedAt: string; // ISO date string
    avatar?: string;
    __v: number;
    _id: string;
  }

  const [message, setMessage] = useState("");
  const [reciever, setReciever] = useState("");
  const [userId, setUserId] = useState("");
  const [contact, setContact] = useState<User>({
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

  const [contacts, setContacts] = useState<User[]>([]);

  const socket = io("http://localhost:8000");

  console.log('user:',userId,'reciever',reciever,)

  const getUsers = useCallback(async () => {
    interface decodeType {
      _id: string;
    }

    try {
      const token = localStorage.getItem("accessToken");
      let decode: decodeType | null = null;
      if (token) {
        decode = jwtDecode(token) as decodeType;
        setUserId(decode._id);
      }
      const response = await axios.get("http://localhost:8000/api/v1/users/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setContacts(response.data);

      console.log(response.data.map((e: any) => e));
      if (!response.data) {
        throw new Error("Fetching failed");
      }
    } catch (error) {
      error instanceof Error && console.log(error);
    }
  }, []);

  useEffect(() => {
    // Fetch Users
    getUsers();

    // Join private room
    socket.emit("joinRoom", { userId, otherUserId: reciever });

    // Receive message
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 3,
          text: msg.message,
          sender: msg.sender,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, reciever]);

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
        sender: userId,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      socket.emit("sendMessage", {
        sender: userId,
        reciever,
        message,
      });
      setMessage("");
    }
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
          {contacts &&
            contacts.map((c) => (
              <div
                key={c.id}
                className={`p-3 md:p-4 border-b cursor-pointer transition-colors ${
                  c.id === contact.id
                    ? `border-l-4 border-l-blue-500 border-b-0 ${
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
                  setContact(c);
                  setReciever(c.id);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt={c.fullName}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${getAvatarColor(
                          c.fullName || "User"
                        )} flex items-center justify-center text-white font-medium text-sm md:text-base`}
                      >
                        {getInitials(c.fullName || "User")}
                      </div>
                    )}
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
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 md:py-1 min-w-[18px] md:min-w-[20px] text-center">
                          {c.children.length}
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
      {contact.id && (
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
                    alt={contact.fullName}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${getAvatarColor(
                      contact.fullName
                    )} flex items-center justify-center text-white font-medium text-sm md:text-base`}
                  >
                    {getInitials(contact.fullName)}
                  </div>
                )}
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
          <Messages userId={userId} messages={messages} darkMode={darkMode} />

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
