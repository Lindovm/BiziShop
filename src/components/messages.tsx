import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, Send, User, Phone, Info } from "lucide-react";
import Layout from "./Layout";

const Messages = () => {
  const [activeChat, setActiveChat] = useState("1");

  const chats = [
    {
      id: "1",
      name: "John Smith",
      lastMessage: "I'd like to modify my order please",
      time: "10:32 AM",
      unread: 2,
      avatar: "JS",
      avatarColor: "bg-blue-100",
      messages: [
        {
          id: "1",
          sender: "customer",
          text: "Hi, I just placed an order #1042 but I'd like to modify it.",
          time: "10:30 AM",
        },
        {
          id: "2",
          sender: "customer",
          text: "I'd like to remove the onions from my tacos and add extra cheese if possible.",
          time: "10:32 AM",
        },
      ],
    },
    {
      id: "2",
      name: "Maria Garcia",
      lastMessage: "What time will my order be ready?",
      time: "9:45 AM",
      unread: 0,
      avatar: "MG",
      avatarColor: "bg-green-100",
      messages: [
        {
          id: "1",
          sender: "customer",
          text: "Hello, I placed order #1039 about 20 minutes ago.",
          time: "9:40 AM",
        },
        {
          id: "2",
          sender: "vendor",
          text: "Hi Maria, we're working on your order now. It should be ready in about 10 minutes.",
          time: "9:42 AM",
        },
        {
          id: "3",
          sender: "customer",
          text: "What time will my order be ready?",
          time: "9:45 AM",
        },
      ],
    },
    {
      id: "3",
      name: "David Lee",
      lastMessage: "Thanks for the quick service!",
      time: "Yesterday",
      unread: 0,
      avatar: "DL",
      avatarColor: "bg-purple-100",
      messages: [
        {
          id: "1",
          sender: "customer",
          text: "Just picked up my order. Everything looks great!",
          time: "Yesterday",
        },
        {
          id: "2",
          sender: "customer",
          text: "Thanks for the quick service!",
          time: "Yesterday",
        },
        {
          id: "3",
          sender: "vendor",
          text: "You're welcome, David! Enjoy your meal and please visit us again soon.",
          time: "Yesterday",
        },
      ],
    },
    {
      id: "4",
      name: "Bizibyte Support",
      lastMessage: "How can we help you today?",
      time: "2 days ago",
      unread: 0,
      avatar: "BS",
      avatarColor: "bg-orange-100",
      messages: [
        {
          id: "1",
          sender: "support",
          text: "Hello! This is Bizibyte Support. How can we help you today?",
          time: "2 days ago",
        },
      ],
    },
  ];

  const activeMessages =
    chats.find((chat) => chat.id === activeChat)?.messages || [];
  const activeChatData = chats.find((chat) => chat.id === activeChat);

  return (
    <Layout>
      <div className="w-full h-[calc(100vh-8rem)] max-w-7xl mx-auto p-4 flex">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 pr-4 overflow-y-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg cursor-pointer ${activeChat === chat.id ? "bg-orange-50 border-l-4 border-orange-500" : "hover:bg-gray-50"}`}
                onClick={() => setActiveChat(chat.id)}
              >
                <div className="flex items-center">
                  <div
                    className={`h-10 w-10 rounded-full ${chat.avatarColor} flex items-center justify-center text-sm font-medium mr-3`}
                  >
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <Badge className="ml-2 bg-orange-500">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="w-2/3 pl-4 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div
                className={`h-10 w-10 rounded-full ${activeChatData?.avatarColor} flex items-center justify-center text-sm font-medium mr-3`}
              >
                {activeChatData?.avatar}
              </div>
              <div>
                <h3 className="font-medium">{activeChatData?.name}</h3>
                <p className="text-xs text-gray-500">Order #1042</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "vendor" || message.sender === "support" ? "justify-start" : "justify-end"}`}
              >
                {(message.sender === "vendor" ||
                  message.sender === "support") && (
                  <div
                    className={`h-8 w-8 rounded-full ${activeChatData?.avatarColor} flex items-center justify-center text-xs font-medium mr-2`}
                  >
                    {activeChatData?.avatar}
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "vendor" || message.sender === "support"
                      ? "bg-white border border-gray-200"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${message.sender === "vendor" || message.sender === "support" ? "text-gray-500" : "text-orange-100"}`}
                  >
                    {message.time}
                  </p>
                </div>
                {message.sender === "customer" && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium ml-2">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 rounded-l-lg py-2 px-4"
              />
              <Button className="rounded-l-none bg-orange-500 hover:bg-orange-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
