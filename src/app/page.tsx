"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
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
} from "lucide-react";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import Messages from "../components/Messages";
import { getAvatarColor, getInitials, safeLocalStorage } from "../../utils/helper";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export interface User {
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

export default function ChatApp() {
  useAuthRedirect();

  const [message, setMessage] = useState("");
  const [receiver, setreceiver] = useState("");
  const [userId, setUserId] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [contacts, setContacts] = useState<User[]>([]);
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
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! How's your day going?",
      sender: "other",
      timestamp: new Date(),
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      senderName: "Sarah Wilson",
    },
    {
      id: 2,
      text: "Pretty good! Just working on some new projects. How about you?",
      sender: "user",
      timestamp: new Date(),
    },
    {
      id: 3,
      text: "Same here! I'm excited about the new design system we're implementing.",
      sender: "other",
      timestamp: new Date(),
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      senderName: "Sarah Wilson",
    },
    {
      id: 4,
      text: "That sounds amazing! I'd love to hear more about it sometime.",
      sender: "user",
      timestamp: new Date(),
    },
  ]);

const token = safeLocalStorage.getItem("accessToken");

  const socket = io("http://localhost:8000", {
    auth: {
      token
    },
  });

  const getUsers = useCallback(async () => {
    interface decodeType {
      _id: string;
    }

    try {
      if (token) {
        const decode: decodeType = jwtDecode(token) as decodeType;
        setUserId(decode._id);
      }

      const response = await axios.get("http://localhost:8000/api/v1/users/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setContacts(response.data);

      if (!response.data) {
        throw new Error("Fetching failed");
      }
    } catch (error) {
      error instanceof Error && console.log(error);
    }
  }, []);



  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);

      if (userId && receiver) {
        console.log("Joining Room");
        socket.emit("joinRoom", { userId, otherUserId: receiver });
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    // Event listeners
    socket.on("receiveMessage", (msg) => {
      console.log(msg, "message received");
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random() * 1000,
          text: msg.message,
          sender: msg.sender,
          timestamp: new Date(),
        },
      ]);
    });

    socket.on("showTyping", ({ sender }) => {
      console.log(sender, "started typing");
      setTypingUser(sender);
    });

    socket.on("hideTyping", () => {
      console.log("typing stopped");
      setTypingUser(null);
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
      socket.off("showTyping");
      socket.off("hideTyping");
    };
  }, [userId, receiver]);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!socket.connected) {
      socket.connect();
    }

    setMessage(e.target.value);

    socket.emit("typing", { sender: userId, receiver });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { sender: userId, receiver });
    }, 1500);
  };

  const handleSendMessage = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault();

    if (!socket.connected) {
      socket.connect();
    }

    console.log(socket.connected, "dend");

    if (message.trim()) {
      socket.emit("sendMessage", {
        sender: userId,
        receiver,
        message,
      });
      setMessage("");
    }
  };

  return (
    <div className={"flex h-screen relative"}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
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
      `}
      >
        {/* Sidebar Header */}
        <div className={"p-4 md:p-6 border-b"}>
          <div className="flex items-center justify-between mb-4">
            <h1 className={"text-xl font-semibold "}>Messages</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className={"md:hidden p-2 rounded-lg transition-colors"}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search
              className={
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              }
            />
            <Input
              type="text"
              placeholder="Search conversations..."
              className={"w-full pl-10 pr-4 py-2 border rounded-lg text-sm"}
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 && (
            <div className="flex m-2 rounded justify-center items-center space-x-2">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          )}
          {contacts &&
            contacts.map((c) => (
              <div
                key={c.id}
                className={`p-3 md:p-4 rounded cursor-pointer mx-2 transition-colors ${
                  c.id === contact.id
                    ? "border-l-4 bg-muted border-l-blue-500 border-b-0"
                    : "hover:bg-muted"
                }`}
                onClick={() => {
                  setSidebarOpen(false);
                  setContact(c);
                  setreceiver(c.id);
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
                          c.fullName
                        )} flex items-center justify-center text-white font-medium text-sm md:text-base`}
                      >
                        {getInitials(c.fullName)}
                      </div>
                    )}
                    {c.isVerified && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className={"font-medium truncate text-sm md:text-base"}
                      >
                        {c.fullName}
                      </h3>
                      <span className={"text-xs"}>
                        {c.createdAt.split("T")[1].slice(0, 5)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className={"text-xs md:text-sm truncate"}>{c.id}</p>
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

      <button onClick={() => setSidebarOpen(!sidebarOpen)}>SHOW</button>
      {contact.id && (
        <div className="flex-1 flex flex-col md:ml-0">
          {/* Chat Header */}
          <div className={"border-b px-4 md:px-6 py-3 md:py-4"}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className={"md:hidden p-2 rounded-lg transition-colors -ml-2"}
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
                  <h2 className={"font-medium text-sm md:text-base"}>
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
                <button className={"p-1.5 md:p-2 rounded-lg transition-colors"}>
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button className={"p-1.5 md:p-2 rounded-lg transition-colors"}>
                  <Video className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button className={"p-1.5 md:p-2 rounded-lg transition-colors"}>
                  <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <Messages
            typingUser={typingUser}
            userId={userId}
            messages={messages}
          />

          {/* Message Input */}
          <div className={"border-t p-3 md:p-4"}>
            <div className="flex items-center space-x-2 md:space-x-3">
              <button
                type="button"
                className={"p-2 rounded-lg transition-colors flex-shrink-0"}
              >
                <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={handleChange}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
                  placeholder="Type a message..."
                  className={
                    "w-full px-3 md:px-4 py-2 md:py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 md:pr-12 text-sm md:text-base"
                  }
                />
                <button
                  type="button"
                  className={
                    "absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 p-1 transition-colors"
                  }
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
