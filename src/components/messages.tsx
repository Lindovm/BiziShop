import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, Send, User, Phone, Info, Loader2 } from "lucide-react";
import Layout from "./Layout";
import { useAuth } from "../contexts/AuthContext";
import { messageDB } from "../lib/firebase-db";
import { Chat, Message, MessageSenderType } from "../types/models";
import { format, formatDistanceToNow } from "date-fns";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from "../lib/firebase";

const Messages = () => {
  const { userProfile, userRestaurant } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get avatar initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();

      // If it's today, show the time
      if (date.toDateString() === now.toDateString()) {
        return format(date, 'h:mm a');
      }

      // If it's within the last week, show relative time
      if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
        return formatDistanceToNow(date, { addSuffix: false });
      }

      // Otherwise show the date
      return format(date, 'MMM d');
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return timestamp;
    }
  };

  // Get random color for avatar
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-100", "bg-green-100", "bg-yellow-100",
      "bg-purple-100", "bg-pink-100", "bg-indigo-100"
    ];

    // Use the first character of the name to determine color
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  // Load chats for the current restaurant
  useEffect(() => {
    if (!userRestaurant?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Set up real-time listener for chats
    const chatsRef = collection(firestore, 'chats');
    const q = query(
      chatsRef,
      where('restaurantId', '==', userRestaurant.id),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];

      setChats(chatData);

      // If we have chats and no active chat is selected, select the first one
      if (chatData.length > 0 && !activeChat) {
        setActiveChat(chatData[0].id);
      }

      setLoading(false);
    }, (error) => {
      console.error("Error fetching chats:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userRestaurant, activeChat]);

  // Load messages for the active chat
  useEffect(() => {
    if (!activeChat) return;

    setLoadingMessages(true);

    // Set up real-time listener for messages
    const messagesRef = collection(firestore, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', activeChat),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      setMessages(messageData);
      setLoadingMessages(false);

      // Mark messages as read
      messageDB.markMessagesAsRead(activeChat);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !userProfile) return;

    try {
      await messageDB.sendMessage({
        chatId: activeChat,
        sender: 'vendor' as MessageSenderType,
        senderId: userProfile.id,
        text: newMessage.trim(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle pressing Enter to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get active chat data
  const activeChatData = chats.find(chat => chat.id === activeChat);

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

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm mt-2">Messages from customers and support will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => {
                const avatar = chat.customerAvatar || getInitials(chat.customerName || 'Customer');
                const avatarColor = getAvatarColor(chat.customerName || 'Customer');

                return (
                  <div
                    key={chat.id}
                    className={`p-3 rounded-lg cursor-pointer ${activeChat === chat.id ? "bg-orange-50 border-l-4 border-orange-500" : "hover:bg-gray-50"}`}
                    onClick={() => setActiveChat(chat.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`h-10 w-10 rounded-full ${avatarColor} flex items-center justify-center text-sm font-medium mr-3`}
                      >
                        {avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium truncate">{chat.customerName || 'Customer'}</h3>
                          <span className="text-xs text-gray-500">
                            {chat.lastMessageTimestamp ? formatTimestamp(chat.lastMessageTimestamp) : ''}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500 truncate">
                            {chat.lastMessage || 'No messages yet'}
                          </p>
                          {chat.unreadCount > 0 && (
                            <Badge className="ml-2 bg-orange-500">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="w-2/3 pl-4 flex flex-col">
          {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <div className="mb-4">
                <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-medium text-center">Select a conversation</h3>
              </div>
              <p className="text-center max-w-md">
                Choose a conversation from the list to view messages
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div
                    className={`h-10 w-10 rounded-full ${getAvatarColor(activeChatData?.customerName || 'Customer')} flex items-center justify-center text-sm font-medium mr-3`}
                  >
                    {getInitials(activeChatData?.customerName || 'Customer')}
                  </div>
                  <div>
                    <h3 className="font-medium">{activeChatData?.customerName || 'Customer'}</h3>
                    {activeChatData?.orderId && (
                      <p className="text-xs text-gray-500">Order #{activeChatData.orderId}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No messages yet</p>
                    <p className="text-sm mt-2">Start the conversation by sending a message</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "vendor" ? "justify-start" : "justify-end"}`}
                      >
                        {message.sender === "vendor" && (
                          <div
                            className={`h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-medium mr-2`}
                          >
                            {userRestaurant ? getInitials(userRestaurant.name) : 'VS'}
                          </div>
                        )}
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === "vendor"
                              ? "bg-white border border-gray-200"
                              : "bg-orange-500 text-white"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${message.sender === "vendor" ? "text-gray-500" : "text-orange-100"}`}
                          >
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                        {message.sender !== "vendor" && (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium ml-2">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-200 rounded-l-lg py-2 px-4"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    className="rounded-l-none bg-orange-500 hover:bg-orange-600"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
