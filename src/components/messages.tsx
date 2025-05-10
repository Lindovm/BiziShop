import React, { useState, useEffect, useContext, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, Send, User, Phone, Info, MessageSquarePlus } from "lucide-react";
import Layout from "./Layout";
import { firestore } from "../lib/firebase"; // Assuming firestore is exported from firebase.ts
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext"; // Use the custom hook
import { Chat, Message as MessageType } from "../types/models"; // Import your types
import { Input } from "./ui/input"; // Using shadcn Input
import { ScrollArea } from "./ui/scroll-area"; // Using shadcn ScrollArea

// Helper to format Firestore Timestamps
const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return "";
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (typeof timestamp === 'string') { // Fallback for string dates if any
    return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
  }
  return "Invalid Date";
};

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser, userProfile } = useAuth(); // Get current user and profile from useAuth
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Fetch chats for the current user
  useEffect(() => {
    if (!currentUser?.uid) return;

    const chatsRef = collection(firestore, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", currentUser.uid),
      orderBy("lastMessageTimestamp", "desc"),
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const fetchedChats: Chat[] = [];
      for (const document of querySnapshot.docs) {
        const chatData = document.data() as Chat;
        // Attempt to get participant names and avatars
        // This is a simplified version; in a real app, you might fetch user profiles
        const participantDetails: { [userId: string]: { name: string; avatar: string } } = {};
        let chatDisplayName = "Chat";
        let chatDisplayAvatar = "??";

        for (const participantId of chatData.participants) {
          if (participantId !== currentUser.uid) {
            // Try to get other participant's info
            try {
              const userDocRef = doc(firestore, "users", participantId);
              const userDocSnap = await getDoc(userDocRef);
              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                participantDetails[participantId] = {
                  name: userData?.name || "Unknown User",
                  avatar: (userData?.name || "UU").substring(0, 2).toUpperCase(),
                };
                chatDisplayName = userData?.name || "Unknown User";
                chatDisplayAvatar = (userData?.name || "UU").substring(0, 2).toUpperCase();
              } else {
                 participantDetails[participantId] = { name: "Unknown User", avatar: "UU" };
              }
            } catch (e) {
              console.error("Error fetching participant user data:", e);
              participantDetails[participantId] = { name: "Error User", avatar: "ER" };
            }
          }
        }
         // If it's a chat with self or only one other known participant
        if (chatData.participants.length === 1 || Object.keys(participantDetails).length === 0) {
            chatDisplayName = currentUser.displayName || "My Notes"; // Or some other default
            chatDisplayAvatar = (currentUser.displayName || "ME").substring(0,2).toUpperCase();
        }


        fetchedChats.push({
          ...chatData,
          id: document.id,
          name: chatData.name || chatDisplayName, // Use fetched name or default
          // @ts-ignore
          avatar: chatData.participantAvatars?.[chatData.participants.find(p => p !== currentUser.uid) || currentUser.uid] || chatDisplayAvatar,
        });
      }
      setChats(fetchedChats);
      if (fetchedChats.length > 0 && !activeChatId) {
        setActiveChatId(fetchedChats[0].id);
      }
    });

    return () => unsubscribe();
  }, [currentUser, activeChatId]); // Added activeChatId to dependencies to ensure re-fetch if it changes externally

  // Fetch messages for the active chat
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(firestore, "chats", activeChatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages: MessageType[] = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as MessageType),
        id: doc.id,
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [activeChatId]);

  const handleSendMessage = async () => {
    if (!newMessageText.trim() || !activeChatId || !currentUser?.uid || !userProfile) return;

    const messagesRef = collection(firestore, "chats", activeChatId, "messages");
    const chatDocRef = doc(firestore, "chats", activeChatId);

    try {
      await addDoc(messagesRef, {
        text: newMessageText,
        timestamp: serverTimestamp(),
        userId: currentUser.uid, // Sender's ID
        sender: userProfile.name || currentUser.displayName || "User", // Use profile name if available
        read: false,
      });

      await updateDoc(chatDocRef, {
        lastMessageText: newMessageText,
        lastMessageTimestamp: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Optionally, update unread counts for other participants here
      });

      setNewMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error (e.g., show a toast notification)
    }
  };
  
  // Placeholder for creating a new chat - more complex logic needed
  const handleCreateNewChat = async () => {
    // This is a simplified example. You'd need a UI to select users to chat with.
    // For now, let's imagine we are creating a chat with a predefined "support" user or another user.
    if (!currentUser?.uid || !userProfile) return;

    // Example: const otherUserId = "supportUserId"; // ID of the user to chat with
    // You would typically get this from a user selection UI
    alert("Creating new chat feature is a placeholder. More UI/UX needed to select participants.");
    // const newChatRef = collection(firestore, "chats");
    // try {
    //   const chatDoc = await addDoc(newChatRef, {
    //     participants: [currentUser.uid, otherUserId], // Current user and the other participant
    //     participantNames: {
    //       [currentUser.uid]: userProfile.name || currentUser.displayName || "Me",
    //       [otherUserId]: "Support Team", // Or fetch their actual name
    //     },
    //     participantAvatars: {
    //        [currentUser.uid]: (userProfile.name || currentUser.displayName || "ME").substring(0,2).toUpperCase(),
    //        [otherUserId]: "ST",
    //     },
    //     createdAt: serverTimestamp(),
    //     updatedAt: serverTimestamp(),
    //     lastMessageTimestamp: serverTimestamp(),
    //     lastMessageText: "Chat started",
    //   });
    //   setActiveChatId(chatDoc.id);
    // } catch (error) {
    //   console.error("Error creating new chat:", error);
    // }
  };


  const activeChatData = chats.find((chat) => chat.id === activeChatId);

  const filteredChats = chats.filter(chat => 
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessageText?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine avatar details for the chat header
  let headerAvatar = "??";
  let headerName = "Select a Chat";
  let orderInfo = ""; // Placeholder for order info if available in chat data

  if (activeChatData && currentUser) {
    const otherParticipantId = activeChatData.participants.find(p => p !== currentUser.uid);
    if (otherParticipantId && activeChatData.participantNames && activeChatData.participantAvatars) {
      headerName = activeChatData.participantNames[otherParticipantId] || activeChatData.name || "Chat";
      headerAvatar = activeChatData.participantAvatars[otherParticipantId] || (headerName.substring(0,2).toUpperCase());
    } else { // Chat with self or if participant details are missing
      headerName = activeChatData.name || userProfile?.name || currentUser.displayName || "My Chat";
      // Try to get current user's avatar from participantAvatars, then fallback
      headerAvatar = activeChatData.participantAvatars?.[currentUser.uid] || (headerName.substring(0,2).toUpperCase());
    }
    if (activeChatData.orderId) {
        orderInfo = `Order #${activeChatData.orderId}`;
    }
  }


  return (
    <Layout>
      <div className="w-full h-[calc(100vh-8rem)] max-w-7xl mx-auto p-4 flex">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 pr-4 flex flex-col overflow-y-hidden">
          <div className="mb-4 p-1">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Messages</h1>
                <Button variant="ghost" size="icon" onClick={handleCreateNewChat} title="Start new chat">
                    <MessageSquarePlus className="h-5 w-5" />
                </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-grow">
            <div className="space-y-2 pr-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 rounded-lg cursor-pointer ${activeChatId === chat.id ? "bg-orange-50 border-l-4 border-orange-500" : "hover:bg-gray-50"}`}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <div className="flex items-center">
                    <div
                      className={`h-10 w-10 rounded-full ${ chat.id === "4" ? "bg-orange-100" : chat.id === "3" ? "bg-purple-100" : chat.id === "2" ? "bg-green-100" : "bg-blue-100" } flex items-center justify-center text-sm font-medium mr-3`}
                    >
                      {/* @ts-ignore */}
                      {chat.avatar || chat.name?.substring(0, 2).toUpperCase() || "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500">
                            {chat.lastMessageTimestamp ? formatTimestamp(chat.lastMessageTimestamp) : ""}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 truncate">
                          {chat.lastMessageText}
                        </p>
                        {chat.unreadCount && chat.unreadCount > 0 && (
                          <Badge className="ml-2 bg-orange-500">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea> {/* Closed ScrollArea for chat list */}
        </div>

        {/* Chat Window */}
        {activeChatId && activeChatData ? (
          <div className="w-2/3 pl-4 flex flex-col h-full"> {/* Added h-full */}
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div
                  className={`h-10 w-10 rounded-full ${ activeChatData.id === "4" ? "bg-orange-100" : activeChatData.id === "3" ? "bg-purple-100" : activeChatData.id === "2" ? "bg-green-100" : "bg-blue-100" } flex items-center justify-center text-sm font-medium mr-3`}
                >
                  {headerAvatar}
                </div>
                <div>
                  <h3 className="font-medium">{headerName}</h3>
                  {orderInfo && <p className="text-xs text-gray-500">{orderInfo}</p>}
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
            <ScrollArea className="flex-1 p-4"> {/* Removed space-y-4 from ScrollArea, apply to inner div */}
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex mb-3 ${message.userId === currentUser?.uid ? "justify-end" : "justify-start"}`}
                  >
                    {message.userId !== currentUser?.uid && (
                      <div
                        className={`h-8 w-8 rounded-full ${ activeChatData.id === "4" ? "bg-orange-100" : activeChatData.id === "3" ? "bg-purple-100" : activeChatData.id === "2" ? "bg-green-100" : "bg-blue-100" } flex items-center justify-center text-xs font-medium mr-2 self-end`}
                      >
                        {headerAvatar} {/* Use headerAvatar which is determined for the other participant */}
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                        message.userId === currentUser?.uid
                          ? "bg-orange-500 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${message.userId === currentUser?.uid ? "text-orange-100 text-right" : "text-gray-500 text-left"}`}
                      >
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                    {message.userId === currentUser?.uid && (
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium ml-2 self-end">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea> {/* Closed ScrollArea for messages */}

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 mt-auto"> {/* Added mt-auto to push to bottom */}
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-l-lg py-2 px-4 focus-visible:ring-orange-500"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                />
                <Button type="submit" className="rounded-l-none bg-orange-500 hover:bg-orange-600">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-2/3 pl-4 flex flex-col items-center justify-center text-gray-500 h-full"> {/* Added h-full */}
            <MessageSquarePlus className="h-16 w-16 mb-4" />
            <p className="text-xl">Select a conversation or start a new one.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Messages;
