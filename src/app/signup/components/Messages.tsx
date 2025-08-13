'use client'
import React, { useEffect, useRef } from "react";
import { getAvatarColor, getInitials } from "../../../../utils/helper";

type Props = {
  messages: {
    id: number;
    text: string;
    sender: string;
    timestamp: string;
    avatar?: string;
    senderName?: string;
  }[];
  userId : string
  darkMode: boolean;
};

const Messages = ({ messages, darkMode , userId }: Props) => {
    console.log(userId , messages)
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id+Date.now()}
          className={`flex ${
            msg.sender === userId ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`flex items-end space-x-2 max-w-[85%] sm:max-w-xs md:max-w-md ${
              msg.sender === userId ? "flex-row-reverse space-x-reverse" : ""
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
                      msg.senderName || "User" , darkMode
                    )} flex items-center justify-center text-white font-medium text-xs md:text-sm`}
                  >
                    {getInitials(msg.senderName || "New User")}
                  </div>
                )}
              </div>
            )}
            <div>
              <div
                className={`px-3 md:px-4 py-2 rounded-2xl text-sm md:text-base ${
                  msg.sender === userId
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
                  msg.sender === userId ? "text-right" : "text-left"
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
  );
};

export default Messages;
