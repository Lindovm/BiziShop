import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home as HomeIcon,
  ShoppingBag,
  Utensils,
  BarChart2,
  MessageSquare,
  Settings,
  Bell,
  Menu,
  X,
  Package,
  LogOut,
} from "lucide-react";
import { supabase, getUserRole, UserRole, hasAccess } from "../lib/supabase";
import { Badge } from "./ui/badge";
import NotificationSidebar from "./NotificationSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("cashier");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole();
      setUserRole(role);
    };

    fetchUserRole();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNotificationClick = () => {
    // On mobile, navigate to notifications page
    if (window.innerWidth < 640) {
      navigate("/notifications");
    } else {
      // On desktop, open the sidebar
      setIsNotificationsOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear role from localStorage
      localStorage.removeItem("userRole");
      // Redirect to auth page
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-orange-500 font-bold">
                b
              </div>
              <span className="text-lg hidden md:flex items-center">
                <span className="font-light">.izi</span>
                <span className="font-bold">Shop</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative" onClick={handleNotificationClick}>
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-white hover:text-orange-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
      {/* Notification Sidebar (only visible on desktop) */}
      <NotificationSidebar
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white h-full w-64 p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  b
                </div>
                <span className="text-lg flex items-center">
                  <span className="font-light">.izi</span>
                  <span className="font-bold">Shop</span>
                </span>
              </div>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              {(userRole === "manager" || userRole === "owner") && (
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 p-2 ${isActive("/dashboard") ? "bg-orange-100 text-orange-500" : "hover:bg-gray-100"} rounded-lg`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              )}
              <Link
                to="/orders"
                className={`flex items-center space-x-2 p-2 ${isActive("/orders") ? "bg-orange-100 text-orange-500" : "hover:bg-gray-100"} rounded-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Orders</span>
              </Link>
              <Link
                to="/menu"
                className={`flex items-center space-x-2 p-2 ${isActive("/menu") ? "bg-orange-100 text-orange-500" : "hover:bg-gray-100"} rounded-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Utensils className="h-5 w-5" />
                <span>Menu</span>
              </Link>
              {userRole === "owner" && (
                <Link
                  to="/analytics"
                  className={`flex items-center space-x-2 p-2 ${isActive("/analytics") ? "bg-orange-100 text-orange-500" : "hover:bg-gray-100"} rounded-lg`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart2 className="h-5 w-5" />
                  <span>Analytics</span>
                </Link>
              )}
              {(userRole === "manager" || userRole === "owner") && (
                <Link
                  to="/inventory"
                  className={`flex items-center space-x-2 p-2 ${isActive("/inventory") ? "bg-orange-100 text-orange-500" : "hover:bg-gray-100"} rounded-lg`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="h-5 w-5" />
                  <span>Inventory</span>
                </Link>
              )}
              <Link
                to="/messages"
                className={`flex items-center space-x-2 p-2 ${isActive("/messages") ? "bg-orange-100 text-orange-500" : "hover:bg-gray-100"} rounded-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
              </Link>
              <Link
                to="/settings"
                className={`flex items-center space-x-2 p-2 ${isActive("/settings") ? "bg-orange-100 text-orange-500" : "hover:bg-gray-100"} rounded-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              <button
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg text-red-500 w-full"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Navigation */}
      <div className="hidden md:flex bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex space-x-6">
          {(userRole === "manager" || userRole === "owner") && (
            <Link
              to="/dashboard"
              className={`flex items-center justify-center space-x-1 ${isActive("/dashboard") ? "text-orange-500 font-medium" : "text-gray-600 hover:text-orange-500"}`}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          )}
          <Link
            to="/orders"
            className={`flex items-center justify-center space-x-1 ${isActive("/orders") ? "text-orange-500 font-medium" : "text-gray-600 hover:text-orange-500"}`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Orders</span>
          </Link>
          <Link
            to="/menu"
            className={`flex items-center justify-center space-x-1 ${isActive("/menu") ? "text-orange-500 font-medium" : "text-gray-600 hover:text-orange-500"}`}
          >
            <Utensils className="h-5 w-5" />
            <span>Menu</span>
          </Link>
          {userRole === "owner" && (
            <Link
              to="/analytics"
              className={`flex items-center justify-center space-x-1 ${isActive("/analytics") ? "text-orange-500 font-medium" : "text-gray-600 hover:text-orange-500"}`}
            >
              <BarChart2 className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
          )}
          {(userRole === "manager" || userRole === "owner") && (
            <Link
              to="/inventory"
              className={`flex items-center justify-center space-x-1 ${isActive("/inventory") ? "text-orange-500 font-medium" : "text-gray-600 hover:text-orange-500"}`}
            >
              <Package className="h-5 w-5" />
              <span>Inventory</span>
            </Link>
          )}
          <Link
            to="/messages"
            className={`flex items-center justify-center space-x-1 ${isActive("/messages") ? "text-orange-500 font-medium" : "text-gray-600 hover:text-orange-500"}`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
            <Badge className="ml-1 bg-red-500">2</Badge>
          </Link>
          <Link
            to="/settings"
            className={`flex items-center justify-center space-x-1 ${isActive("/settings") ? "text-orange-500 font-medium" : "text-gray-600 hover:text-orange-500"}`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50" style={{ WebkitOverflowScrolling: 'touch' }}>{children}</main>
    </div>
  );
};

export default Layout;
