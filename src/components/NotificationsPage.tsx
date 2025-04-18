import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Bell,
  ShoppingBag,
  MessageSquare,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "./Layout";

const NotificationsPage = () => {
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
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link to="/" className="mr-4 md:hidden">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold flex items-center">
              <Bell className="mr-2 h-6 w-6" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-orange-500">{unreadCount}</Badge>
              )}
            </h1>
          </div>
          <Button variant="outline">Mark All as Read</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="mx-auto h-12 w-12 mb-3 opacity-30" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${!notification.read ? "border-l-4 border-orange-500" : ""}`}
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
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
