import React, { useState, useEffect, useContext } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  X,
  Bell,
  ShoppingBag,
  MessageSquare,
  AlertTriangle,
  CheckCircle2, // For delivery confirmed, if needed
} from "lucide-react";
import {
  Notification,
  SpecificNotificationType,
} from "../types/models";
import { firestore as db } from "../lib/firebase"; // Corrected import
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext"; // Correctly import and use the hook

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to format time (simplified)
const formatTimeAgo = (timestamp: any): string => {
  if (!timestamp) return "";
  const now = new Date();
  let date: Date;

  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else if (typeof timestamp === 'number') { // Assuming it's a Unix timestamp in milliseconds
    date = new Date(timestamp);
  } else {
    return "Invalid date";
  }

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  
  if (seconds < 10) return "just now";
  
  return `${Math.floor(seconds)} seconds ago`;
};


const NotificationSidebar = ({
  isOpen = false,
  onClose = () => {},
}: NotificationSidebarProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useAuth(); // Use the useAuth hook

  useEffect(() => {
    if (!currentUser || !isOpen) {
      // Do not fetch if user is not logged in or sidebar is closed
      // Optionally, clear notifications if sidebar is closed and re-fetch on open
      // setNotifications([]); 
      return;
    }
    setLoading(true);

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", currentUser.uid), // Fetch notifications for the current user
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedNotifications: Notification[] = [];
        querySnapshot.forEach((doc) => {
          fetchedNotifications.push({
            id: doc.id,
            ...doc.data(),
          } as Notification);
        });
        setNotifications(fetchedNotifications);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
        // Handle error appropriately, e.g., show a toast message
      }
    );

    return () => unsubscribe(); // Cleanup listener on component unmount or when currentUser/isOpen changes
  }, [currentUser, isOpen]); // Re-run effect if currentUser or isOpen changes

  const getNotificationIcon = (type: SpecificNotificationType) => {
    // Based on the UI image provided
    switch (type) {
      case "ORDER_RECEIVED":
        return <ShoppingBag className="h-5 w-5 text-orange-500" />;
      case "LOW_STOCK_ALERT":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />; // UI shows a more orange-yellow
      case "NEW_MESSAGE":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "DELIVERY_CONFIRMED": // UI shows a green bag/checkmark
        return <CheckCircle2 className="h-5 w-5 text-green-500" />; // Using CheckCircle2 for a confirmed look
      case "ORDER_COMPLETED":
        return <ShoppingBag className="h-5 w-5 text-orange-500" />; // Similar to ORDER_RECEIVED
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (!currentUser) return;
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) return;

    const batch = writeBatch(db);
    unreadNotifications.forEach(notification => {
      const notificationRef = doc(db, "notifications", notification.id);
      batch.update(notificationRef, { isRead: true });
    });

    try {
      await batch.commit();
      // Optionally, update local state immediately or rely on onSnapshot to refresh
      // setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Handle error (e.g., show toast)
    }
  };


  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-orange-500">{unreadCount}</Badge>
              )}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          )}
          {!loading && notifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bell className="mx-auto h-12 w-12 mb-3 opacity-30" />
              <p>No new notifications</p>
            </div>
          )}
          {!loading &&
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-3 ${!notification.isRead ? "border-l-4 border-orange-500 bg-orange-50/50" : "bg-white"}`}
                // Add onClick handler for navigation if notification.link exists
                onClick={() => {
                  if (notification.link) {
                    // Handle navigation, e.g., router.push(notification.link)
                    console.log("Navigate to:", notification.link);
                  }
                  // Optionally mark as read on click
                  // markAsRead(notification.id); 
                }}
              >
                <div className="flex">
                  <div className="mr-3 pt-1"> {/* Added pt-1 for better icon alignment */}
                    {getNotificationIcon(notification.specificType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-medium ${!notification.isRead ? "font-semibold text-slate-800" : "text-slate-700"}`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap pl-2">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" className="w-full" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            Mark All as Read
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSidebar;
