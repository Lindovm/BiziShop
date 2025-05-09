import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Utensils,
  BarChart2,
  Search,
  Clock,
  DollarSign,
  Star,
  MapPin,
  Calendar,
  MessageSquare,
  Plus,
  User,
  Loader2, // Added Loader2
  Store, // Added Store for placeholder
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // Added useAuth
import { Restaurant, Order, Review, Product } from "../types/models"; // Added Review type, Product type
import { shopDB, orderDB, reviewDB, menuDB } from "../lib/firebase-db"; // Added reviewDB, menuDB

const Dashboard = () => {
  const navigate = useNavigate();
  const { userProfile, isLoading: authLoading } = useAuth(); // Get userProfile and authLoading
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);

  // State for dashboard stats
  const [dailyStatsLoading, setDailyStatsLoading] = useState(true);
  const [todayOrdersCount, setTodayOrdersCount] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [yesterdayOrdersCount, setYesterdayOrdersCount] = useState(0);
  const [yesterdayRevenue, setYesterdayRevenue] = useState(0);
  const [statsError, setStatsError] = useState<string | null>(null);

  // State for review stats
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // State for prep time stats
  const [prepTimeLoading, setPrepTimeLoading] = useState(true);
  const [currentAveragePrepTime, setCurrentAveragePrepTime] = useState(0); // in minutes
  const [previousAveragePrepTime, setPreviousAveragePrepTime] = useState(0); // in minutes
  const [prepTimeError, setPrepTimeError] = useState<string | null>(null);

  // State for orders in the "New Orders" tab
  const [newOrdersLoading, setNewOrdersLoading] = useState(true);
  const [displayableOrders, setDisplayableOrders] = useState<Order[]>([]);
  const [newOrdersError, setNewOrdersError] = useState<string | null>(null);

  // State for popular items
  const [popularItemsLoading, setPopularItemsLoading] = useState(true);
  const [popularItems, setPopularItems] = useState<any[]>([]); // Define a more specific type later
  const [popularItemsError, setPopularItemsError] = useState<string | null>(null);

  // State for schedule tab
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleEvents, setScheduleEvents] = useState<any[]>([]); // Define a more specific type later
  const [scheduleDateDisplay, setScheduleDateDisplay] = useState<string>("");


  useEffect(() => {
    if (userProfile) {
      const restaurantId = userProfile.restaurant_id;

      if (restaurantId) {
        fetchRestaurantData(restaurantId);
      } else {
        setLoadingRestaurant(false);
        setRestaurant(null);
      }
    } else if (!authLoading) {
      // If userProfile is null and auth is not loading, means no user or no profile
      setLoadingRestaurant(false);
      setRestaurant(null);
    }
  }, [userProfile, authLoading]);

  const fetchRestaurantData = async (restaurantRef: any) => {
    setLoadingRestaurant(true);
    try {
      const restaurantData =
        await shopDB.getRestaurantByReference(restaurantRef);
      if (restaurantData) {
        setRestaurant(restaurantData as Restaurant);
      } else {
        setRestaurant(null);
      }
    } catch (error) {
      console.error("Error fetching restaurant data for dashboard:", error);
      setRestaurant(null);
    } finally {
      setLoadingRestaurant(false);
    }
  };

  const handleNewOrderClick = () => {
    navigate("/add-items");
  };

  // Fetch and process orders for dashboard stats (including prep times and popular items)
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!restaurant) {
        setDailyStatsLoading(false);
        setPrepTimeLoading(false);
        setNewOrdersLoading(false);
        setPopularItemsLoading(false);
        return;
      }

      setDailyStatsLoading(true);
      setPrepTimeLoading(true);
      setNewOrdersLoading(true);
      setPopularItemsLoading(true);
      setStatsError(null);
      setPrepTimeError(null);
      setNewOrdersError(null);
      setPopularItemsError(null);

      try {
        const allOrders = (await orderDB.getAllOrders()) as Order[];
        const menuItemsData = await menuDB.getAllMenuItems(); 
        const menuItemsMap = new Map(menuItemsData.map(item => [item.id, item as Product]));

        const filteredOrders = allOrders.filter(
          (order) => order.status === 'pending' || order.status === 'preparing'
        ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setDisplayableOrders(filteredOrders);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0,0,0,0);
        
        let ctOrders = 0, ctRevenue = 0, cyOrders = 0, cyRevenue = 0;
        let tCompleted = 0, tPrepTime = 0, yCompleted = 0, yPrepTime = 0;
        const salesCounter: { [productId: string]: { name: string; quantity: number; imageUrl?: string } } = {};

        allOrders.forEach((order) => {
          const orderDate = new Date(order.createdAt);
          const orderDateDayStart = new Date(orderDate).setHours(0,0,0,0);

          if (typeof order.total === 'number') {
            if (orderDateDayStart === today.getTime()) {
              ctOrders++;
              ctRevenue += order.total;
              if (order.status === 'completed' && order.completedAt) {
                const prepTime = new Date(order.completedAt).getTime() - new Date(order.createdAt).getTime();
                if (prepTime > 0) { tPrepTime += prepTime; tCompleted++; }
              }
            } else if (orderDateDayStart === yesterday.getTime()) {
              cyOrders++;
              cyRevenue += order.total;
              if (order.status === 'completed' && order.completedAt) {
                const prepTime = new Date(order.completedAt).getTime() - new Date(order.createdAt).getTime();
                if (prepTime > 0) { yPrepTime += prepTime; yCompleted++; }
              }
            }
          }
          if (order.status === 'completed' && orderDate >= sevenDaysAgo) {
            order.items.forEach(item => {
              const menuItemDetails = menuItemsMap.get(item.productId);
              salesCounter[item.productId] = {
                name: menuItemDetails?.name || item.name || 'Unknown Item',
                quantity: (salesCounter[item.productId]?.quantity || 0) + item.quantity,
                imageUrl: menuItemDetails?.imageUrl || 'https://via.placeholder.com/100',
              };
            });
          }
        });
        
        setTodayOrdersCount(ctOrders);
        setTodayRevenue(ctRevenue);
        setYesterdayOrdersCount(cyOrders);
        setYesterdayRevenue(cyRevenue);
        setCurrentAveragePrepTime(tCompleted > 0 ? (tPrepTime / tCompleted / 60000) : 0);
        setPreviousAveragePrepTime(yCompleted > 0 ? (yPrepTime / yCompleted / 60000) : 0);
        setPopularItems(Object.entries(salesCounter).map(([id, data]) => ({ id, ...data })).sort((a,b) => b.quantity - a.quantity).slice(0,3));
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setTodayOrdersCount(0); setTodayRevenue(0); setYesterdayOrdersCount(0); setYesterdayRevenue(0);
        setCurrentAveragePrepTime(0); setPreviousAveragePrepTime(0); setPopularItems([]);
        setStatsError(null); setPrepTimeError(null); setNewOrdersError(null); setPopularItemsError(null);
      } finally {
        setDailyStatsLoading(false); setPrepTimeLoading(false); setNewOrdersLoading(false); setPopularItemsLoading(false);
      }
    };

    if (!loadingRestaurant && restaurant) {
      fetchDashboardData();
    } else if (!loadingRestaurant && !restaurant) {
      setDailyStatsLoading(false); setPrepTimeLoading(false); setNewOrdersLoading(false); setPopularItemsLoading(false);
      setTodayOrdersCount(0); setTodayRevenue(0); setYesterdayOrdersCount(0); setYesterdayRevenue(0);
      setCurrentAveragePrepTime(0); setPreviousAveragePrepTime(0); setDisplayableOrders([]); setPopularItems([]);
      setStatsError(null); setPrepTimeError(null); setNewOrdersError(null); setPopularItemsError(null);
    }
  }, [restaurant, loadingRestaurant, userProfile]);

  // Fetch and process reviews for dashboard stats
  useEffect(() => {
    const fetchReviewStats = async () => {
      if (!restaurant || !restaurant.id) { setReviewsLoading(false); return; }
      setReviewsLoading(true); setReviewsError(null);
      try {
        const reviews = (await reviewDB.getReviewsByRestaurantId(restaurant.id)) as Review[];
        if (reviews && reviews.length > 0) {
          const sumOfRatings = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
          setAverageRating(sumOfRatings / reviews.length); setTotalReviews(reviews.length);
        } else {
          setAverageRating(0); setTotalReviews(0);
        }
      } catch (error) {
        console.error("Error fetching review stats:", error);
        setAverageRating(0); setTotalReviews(0); setReviewsError(null);
      } finally {
        setReviewsLoading(false);
      }
    };
    if (!loadingRestaurant && restaurant) { fetchReviewStats(); }
    else if (!loadingRestaurant && !restaurant) { setReviewsLoading(false); setAverageRating(0); setTotalReviews(0); setReviewsError(null); }
  }, [restaurant, loadingRestaurant]);

  // Process schedule data
  useEffect(() => {
    setScheduleLoading(true);
    const today = new Date();
    setScheduleDateDisplay(today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
    const newEvents: any[] = [];
    const now = new Date();

    if (restaurant && typeof restaurant.operating_hours === 'string') {
      const parts = restaurant.operating_hours.split(" - ");
      if (parts.length === 2) {
        const [openTimeStr, closeTimeStr] = parts;
        const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
        const openMatch = openTimeStr.match(timeRegex);
        const closeMatch = closeTimeStr.match(timeRegex);

        if (openMatch && closeMatch) {
          let openH = parseInt(openMatch[1]);
          const openM = parseInt(openMatch[2]);
          const openP = openMatch[3].toUpperCase();
          if (openP === "PM" && openH !== 12) openH += 12;
          if (openP === "AM" && openH === 12) openH = 0;

          let closeH = parseInt(closeMatch[1]);
          const closeM = parseInt(closeMatch[2]);
          const closeP = closeMatch[3].toUpperCase();
          if (closeP === "PM" && closeH !== 12) closeH += 12;
          if (closeP === "AM" && closeH === 12) closeH = 0;

          const openDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), openH, openM);
          const closeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), closeH, closeM);

          newEvents.push({ time: openDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), title: "Open for Business", description: restaurant.name || "Your Restaurant", completed: now >= openDate });
          newEvents.push({ time: "2:00 PM", title: "Inventory Restock", description: "Delivery from supplier", completed: now.getHours() >= 14 && now.getHours() < 17 }); 
          newEvents.push({ time: "5:00 PM", title: "Evening Rush", description: "Prepare additional items", completed: now.getHours() >= 17 && now.getHours() < 20 }); 
          newEvents.push({ time: closeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), title: "Close", description: "Clean up and inventory count", completed: now >= closeDate });
        }
      }
    }
    if (newEvents.length === 0) { 
        newEvents.push({ time: "11:00 AM", title: "Open for Business", description: "Default Hours", completed: now.getHours() >= 11 });
        newEvents.push({ time: "2:00 PM", title: "Inventory Restock", description: "Delivery from supplier", completed: now.getHours() >= 14 });
        newEvents.push({ time: "5:00 PM", title: "Evening Rush", description: "Prepare additional items", completed: false });
        newEvents.push({ time: "8:00 PM", title: "Close", description: "Clean up and inventory count", completed: false });
    }
    
    newEvents.sort((a, b) => {
        const timeToDate = (timeStr: string) => {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
            if (period?.toUpperCase() === 'AM' && hours === 12) hours = 0; 
            const d = new Date(today); 
            d.setHours(hours, minutes, 0, 0);
            return d;
        };
        return timeToDate(a.time).getTime() - timeToDate(b.time).getTime();
    });

    setScheduleEvents(newEvents);
    setScheduleLoading(false);
  }, [restaurant]);
  
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) {
      if (current > 0) return "+100%";
      return "N/A";
    }
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(0)}%`;
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4 relative">
        {/* Shop Info */}
        {loadingRestaurant || authLoading ? (
          <Card className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <CardContent className="p-4 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              <span className="ml-2">Loading restaurant details...</span>
            </CardContent>
          </Card>
        ) : restaurant ? (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                {restaurant.logo_url ? (
                  <img
                    src={restaurant.logo_url}
                    alt={restaurant.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-xl">
                    {restaurant.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold">{restaurant.name}</h1>
                  {restaurant.address && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {typeof restaurant.address === "string"
                          ? restaurant.address
                          : typeof restaurant.address === "object" &&
                              restaurant.address !== null
                            ? `${restaurant.address.street || ""}, ${
                                restaurant.address.city || ""
                              }`.replace(/^, |, $/g, "")
                            : "N/A"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Badge
                className={`${
                  restaurant.is_open === undefined
                    ? true 
                    : restaurant.is_open
                      ? "bg-green-500"
                      : "bg-gray-500"
                }`}
              >
                {restaurant.is_open === undefined
                  ? "Open" 
                  : restaurant.is_open
                    ? "Open"
                    : "Closed"}
              </Badge>
            </div>
            {restaurant.operating_hours && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  Today's Hours:{" "}
                  {typeof restaurant.operating_hours === "string"
                    ? restaurant.operating_hours
                    : "Not set"}
                </span>
              </div>
            )}
          </div>
        ) : (
          <Card className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <CardContent className="p-4 text-center text-gray-500">
              <Store className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              No restaurant associated with your profile.
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Today's Orders Card */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">
                  Today's Orders
                </h3>
                <Calendar className="h-5 w-5 text-orange-500" />
              </div>
              {dailyStatsLoading ? (
                <div className="mt-2">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                </div>
              ) : statsError ? (
                <div className="mt-2 text-xs text-red-500">{statsError}</div>
              ) : (
                <div className="mt-2">
                  <div className="text-2xl font-bold">{todayOrdersCount}</div>
                  <div className={`text-xs ${yesterdayOrdersCount === 0 && todayOrdersCount > 0 ? 'text-green-500' : (todayOrdersCount >= yesterdayOrdersCount ? 'text-green-500' : 'text-red-500')}`}>
                    {calculatePercentageChange(todayOrdersCount, yesterdayOrdersCount)} from yesterday
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue Card */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              {dailyStatsLoading ? (
                <div className="mt-2">
                  <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                </div>
              ) : statsError ? (
                <div className="mt-2 text-xs text-red-500">{statsError}</div>
              ) : (
                <div className="mt-2">
                  <div className="text-2xl font-bold">{formatCurrency(todayRevenue)}</div>
                  <div className={`text-xs ${yesterdayRevenue === 0 && todayRevenue > 0 ? 'text-green-500' : (todayRevenue >= yesterdayRevenue ? 'text-green-500' : 'text-red-500')}`}>
                    {calculatePercentageChange(todayRevenue, yesterdayRevenue)} from yesterday
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rating Card */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              {reviewsLoading ? (
                 <div className="mt-2">
                    <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
                 </div>
              ) : reviewsError ? (
                <div className="mt-2 text-xs text-red-500">{reviewsError}</div>
              ) : (
                <div className="mt-2">
                  <div className="text-2xl font-bold">{averageRating > 0 ? averageRating.toFixed(1) : '0.0'}</div>
                  <div className="text-xs text-gray-500">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prep Time Card */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Prep Time</h3>
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              {prepTimeLoading ? (
                <div className="mt-2">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              ) : prepTimeError ? (
                <div className="mt-2 text-xs text-red-500">{prepTimeError}</div>
              ) : (
                <div className="mt-2">
                  <div className="text-2xl font-bold">
                    {currentAveragePrepTime > 0 ? `${currentAveragePrepTime.toFixed(0)}m` : '0m'}
                  </div>
                  {previousAveragePrepTime > 0 && currentAveragePrepTime > 0 && (
                    <div className={`text-xs ${currentAveragePrepTime >= previousAveragePrepTime ? 'text-red-500' : 'text-green-500'}`}>
                      {`${currentAveragePrepTime - previousAveragePrepTime >= 0 ? '+' : ''}${(currentAveragePrepTime - previousAveragePrepTime).toFixed(0)}m from average`}
                    </div>
                  )}
                  {(previousAveragePrepTime === 0 && currentAveragePrepTime > 0) && (
                     <div className="text-xs text-gray-500">No prior data</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Main Content */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="w-full bg-white mb-4 p-1 rounded-lg">
            <TabsTrigger value="orders" className="flex-1">
              New Orders
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex-1">
              Popular Items
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex-1">
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {newOrdersLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <span className="ml-2">Loading new orders...</span>
              </div>
            ) : newOrdersError ? (
              <div className="text-center text-red-500 p-4">{newOrdersError}</div>
            ) : displayableOrders.length === 0 ? (
              <div className="text-center text-gray-500 p-8">
                No new orders at the moment.
              </div>
            ) : (
              displayableOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${
                    order.status === "pending"
                      ? "border-orange-500"
                      : "border-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="font-bold text-lg">
                          Order #{order.id.substring(0, 6)}
                        </span>
                        <Badge
                          className={`ml-2 ${
                            order.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status === "pending" ? "New" : "Preparing"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Placed {formatTimeAgo(order.createdAt)}
                      </div>
                    </div>
                    <div className="text-lg font-bold">
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-medium">Items:</div>
                    <ul className="text-sm mt-1">
                      {order.items.map((item) => (
                        <li key={item.id || item.productId} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>{formatCurrency(item.totalPrice)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                      View Details
                    </Button>
                    <div className="space-x-2">
                      {order.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Accept
                          </Button>
                        </>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Ready for Pickup
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            {popularItemsLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <span className="ml-2">Loading popular items...</span>
              </div>
            ) : popularItemsError ? (
              <div className="text-center text-red-500 p-4">{popularItemsError}</div>
            ) : popularItems.length === 0 ? (
              <div className="text-center text-gray-500 p-8">
                No sales data available for popular items this week.
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <h3 className="font-medium mb-4">
                    Top Selling Items This Week
                  </h3>
                  <div className="space-y-4">
                    {popularItems.map((item, index) => {
                      const maxQuantity = popularItems[0]?.quantity || 1;
                      const percentage = (item.quantity / maxQuantity) * 100;
                      return (
                        <div key={item.id} className="flex items-center">
                          <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
                            <img
                              src={item.imageUrl || "https://via.placeholder.com/100"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm text-gray-500">
                                {item.quantity} sold
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                  <Button variant="link" className="text-orange-500 p-0 h-auto" onClick={() => navigate('/menu')}>
                    View All Menu Items
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            {scheduleLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <span className="ml-2">Loading schedule...</span>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Today's Schedule</h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">{scheduleDateDisplay}</span>
                  </div>
                </div>

                {scheduleEvents.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">No schedule information available.</div>
                ) : (
                    <div className="space-y-4">
                    {scheduleEvents.map((event, index) => (
                        <div key={index} className="flex">
                        <div className="mr-3 flex flex-col items-center">
                            {event.completed ? (
                            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                            </div>
                            ) : (
                            <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                            )}
                            {index < scheduleEvents.length - 1 && (
                            <div className="h-16 w-0.5 bg-gray-200 my-1"></div>
                            )}
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">{event.time}</div>
                            <div className="font-medium">{event.title}</div>
                            {event.description && (
                            <div className="text-xs text-gray-500">
                                {event.description}
                            </div>
                            )}
                        </div>
                        </div>
                    ))}
                    </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleNewOrderClick}
          size="lg"
          className="h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg flex items-center justify-center p-0"
          aria-label="Create new order"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>
    </Layout>
  );
};

export default Dashboard;
