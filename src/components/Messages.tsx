'use client'
import React, { useEffect, useRef } from "react";
import { getAvatarColor, getInitials } from "../../utils/helper";




import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { SendHorizonal } from 'lucide-react';

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

// Define the shape of a message object for TypeScript
interface Message {
  sender: 'user' | 'ai';
  text: string;
}

// Main App component
// export default function App() {
//   // State to hold the chat messages
//   const [messages, setMessages] = useState<Message[]>([
//     { sender: 'ai', text: 'Hello! How can I help you today?' },
//     { sender: 'user', text: 'Tell me about the weather.' },
//     { sender: 'ai', text: "I can't access real-time weather information, but I can tell you that the sun is shining somewhere!" },
//     { sender: 'user', text: 'That\'s great to know!' },
//   ]);

//   // State to hold the current input text
//   const [newMessage, setNewMessage] = useState('');

//   // Ref for the scroll area to enable auto-scrolling
//   const scrollAreaRef = useRef<HTMLDivElement>(null);

//   // Function to handle sending a new message
//   const handleSendMessage = () => {
//     // Check if the input is not empty or just whitespace
//     if (newMessage.trim() === '') {
//       return;
//     }
    
//     // Add the new message from the user to the messages array
//     setMessages(prevMessages => [...prevMessages, { sender: 'user', text: newMessage }]);
    
//     // Simulate a response from the AI
//     // In a real application, you would make an API call here.
//     setTimeout(() => {
//       setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: 'Thanks for your message! I\'m currently set to be a friendly chat companion.' }]);
//     }, 1000); // 1-second delay for a more realistic feel

//     // Clear the input field after sending
//     setNewMessage('');
//   };

//   // Effect to automatically scroll to the bottom of the chat when new messages are added
//   useEffect(() => {
//     if (scrollAreaRef.current) {
//       scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
//       <Card className="w-full max-w-lg h-[90vh] flex flex-col rounded-xl shadow-lg dark:bg-gray-800">
//         <CardHeader className="bg-gray-50 dark:bg-gray-700 rounded-t-xl px-6 py-4 border-b dark:border-gray-600">
//           <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">AI Chat</CardTitle>
//         </CardHeader>

//         {/* The main chat messages area, with ScrollArea for overflow */}
//         <CardContent className="flex-1 overflow-hidden p-0">
//           <ScrollArea className="h-full w-full p-4" ref={scrollAreaRef}>
//             <div className="flex flex-col gap-4">
//               {messages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   {/* AI Avatar */}
//                   {message.sender === 'ai' && (
//                     <Avatar>
//                       <AvatarImage src="/placeholder-avatar.png" />
//                       <AvatarFallback className="bg-blue-500 text-white rounded-full font-semibold">AI</AvatarFallback>
//                     </Avatar>
//                   )}
                  
//                   {/* Message bubble */}
//                   <div
//                     className={`rounded-3xl px-4 py-2 max-w-[80%] md:max-w-[70%] lg:max-w-[60%] shadow-sm ${
//                       message.sender === 'user'
//                         ? 'bg-blue-600 text-white self-end'
//                         : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
//                     }`}
//                   >
//                     {message.text}
//                   </div>
                  
//                   {/* User Avatar */}
//                   {message.sender === 'user' && (
//                     <Avatar>
//                       <AvatarImage src="/placeholder-avatar.png" />
//                       <AvatarFallback className="bg-purple-500 text-white rounded-full font-semibold">U</AvatarFallback>
//                     </Avatar>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//         </CardContent>

//         <Separator className="dark:bg-gray-600" />

//         {/* Input area */}
//         <CardFooter className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
//           <Input
//             className="flex-1 rounded-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
//             placeholder="Type your message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={(e) => {
//               if (e.key === 'Enter') {
//                 handleSendMessage();
//               }
//             }}
//           />
//           <Button
//             className="ml-2 rounded-full h-10 w-10 flex-shrink-0"
//             onClick={handleSendMessage}
//             disabled={!newMessage.trim()}
//           >
//             <SendHorizonal className="h-5 w-5" />
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

