"use client";
import React, { useEffect, useRef } from "react";
import { formatTime, getAvatarColor, getInitials } from "../../utils/helper";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SendHorizonal } from "lucide-react";
import { Badge } from "./ui/badge";

type Props = {
  messages:
    | {
        id: number;
        text: string;
        sender: string;
        timestamp?: string | Date;
        status?: string;
        avatar?: string;
        senderName?: string;
      }[]
    | any[];
  userId: string;
};

const Messages = ({ messages, userId }: Props) => {
  console.log(messages);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4">
      {/* {messages.map((msg) => (
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
            {msg.sender !== userId && (
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
                      msg.senderName , darkMode
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
                {/* {formatTime(msg.timestamp)} */}
      {/* </p>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} /> */}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages &&
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === userId || message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${
                    message.sender === userId || message.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {![ userId, "user" ].includes(message.sender) && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback>
                        {getInitials(message.senderName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                                          message.sender === userId || message.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm break-words">{message.text}</p>
                    <div
                      className={`flex items-center justify-between mt-1 ${
                        message.sender === userId || message.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.sender === userId || message.sender === "user" && (
                        <Badge variant="secondary" className="text-xs ml-2 h-4">
                          {message.status ? message.status : "don"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Typing Indicator */}
          {/* {selectedContact.isTyping && (
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
              )} */}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>
    </div>
  );
};

export default Messages;

