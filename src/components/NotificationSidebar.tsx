import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  X,
  Bell,
  ShoppingBag,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSidebar = ({
  isOpen = false,
  onClose = () => {},
}: NotificationSidebarProps) => {
  const notifications = [
    {
      id: "1",
      title: "New Order Received",
      message: "Order #1045 has been placed and is waiting for confirmation.",
      time: "2 minutes ago",
      type: "order",
      read: false,
    },
    {
      id: "2",
      title: "Low Stock Alert",
      message: "Flour Tortillas are running low. Current stock: 2 pieces.",
      time: "15 minutes ago",
      type: "inventory",
      read: false,
    },
    {
      id: "3",
      title: "New Message",
      message: "John Smith has a question about their order #1042.",
      time: "30 minutes ago",
      type: "message",
      read: false,
    },
    {
      id: "4",
      title: "Delivery Confirmed",
      message:
        "Local Meats delivery has been confirmed for tomorrow at 8:30 AM.",
      time: "1 hour ago",
      type: "delivery",
      read: true,
    },
    {
      id: "5",
      title: "Order Completed",
      message: "Order #1039 has been delivered and marked as complete.",
      time: "2 hours ago",
      type: "order",
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-5 w-5 text-orange-500" />;
      case "inventory":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "delivery":
        return <ShoppingBag className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="mx-auto h-12 w-12 mb-3 opacity-30" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-3 ${!notification.read ? "border-l-4 border-orange-500" : ""}`}
              >
                <div className="flex">
                  <div className="mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-medium ${!notification.read ? "font-semibold" : ""}`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" className="w-full">
            Mark All as Read
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSidebar;
