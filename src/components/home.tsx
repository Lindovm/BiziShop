import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import Layout from "./Layout";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  ShoppingBag,
  Utensils,
  BarChart2,
  Search,
  User,
  Clock,
  DollarSign,
  Star,
  MapPin,
  Calendar,
  MessageSquare,
  Package,
} from "lucide-react";

function Home() {
  return (
    <Layout>
      <div className="px-4 md:px-6 py-4">
        {/* Shop Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-xl">
                TT
              </div>
              <div>
                <h1 className="text-xl font-bold">Taco Truck #42</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Downtown Food Park</span>
                </div>
              </div>
            </div>
            <Badge className={`${true ? "bg-green-500" : "bg-gray-500"}`}>
              {true ? "Open" : "Closed"}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Clock className="h-4 w-4 mr-1" />
            <span>Today's Hours: 11:00 AM - 8:00 PM</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">
                  Today's Orders
                </h3>
                <ShoppingBag className="h-5 w-5 text-orange-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">24</div>
                <div className="text-xs text-green-500">
                  +12% from yesterday
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">$486</div>
                <div className="text-xs text-green-500">+8% from yesterday</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-xs text-gray-500">32 new reviews</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Prep Time</h3>
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">12m</div>
                <div className="text-xs text-red-500">+2m from average</div>
              </div>
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
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="font-bold text-lg">Order #1042</span>
                    <Badge className="ml-2 bg-orange-100 text-orange-800">
                      New
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Placed 5 minutes ago
                  </div>
                </div>
                <div className="text-lg font-bold">$24.99</div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-medium">Items:</div>
                <ul className="text-sm mt-1">
                  <li className="flex justify-between">
                    <span>2x Beef Tacos</span>
                    <span>$12.00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>1x Chicken Quesadilla</span>
                    <span>$8.99</span>
                  </li>
                  <li className="flex justify-between">
                    <span>1x Horchata</span>
                    <span>$3.99</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Decline
                  </Button>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600">
                    Accept
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="font-bold text-lg">Order #1041</span>
                    <Badge className="ml-2 bg-blue-100 text-blue-800">
                      Preparing
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Placed 15 minutes ago
                  </div>
                </div>
                <div className="text-lg font-bold">$18.50</div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-medium">Items:</div>
                <ul className="text-sm mt-1">
                  <li className="flex justify-between">
                    <span>1x Veggie Burrito</span>
                    <span>$10.50</span>
                  </li>
                  <li className="flex justify-between">
                    <span>1x Chips & Guacamole</span>
                    <span>$5.00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>1x Agua Fresca</span>
                    <span>$3.00</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  Ready for Pickup
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <h3 className="font-medium mb-4">
                  Top Selling Items This Week
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
                      <img
                        src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=100&q=80"
                        alt="Beef Taco"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Beef Tacos</span>
                        <span className="text-sm text-gray-500">86 sold</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: "80%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
                      <img
                        src="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=100&q=80"
                        alt="Quesadilla"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Chicken Quesadilla</span>
                        <span className="text-sm text-gray-500">64 sold</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
                      <img
                        src="https://images.unsplash.com/photo-1562059390-a761a084768e?w=100&q=80"
                        alt="Nachos"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Loaded Nachos</span>
                        <span className="text-sm text-gray-500">42 sold</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: "40%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                <Link to="/menu">
                  <Button variant="link" className="text-orange-500 p-0 h-auto">
                    View All Menu Items
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Today's Schedule</h3>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-500">June 22, 2023</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-3 flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div className="h-16 w-0.5 bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">11:00 AM</div>
                    <div className="font-medium">Open for Business</div>
                    <div className="text-xs text-gray-500">
                      Downtown Food Park
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-3 flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div className="h-16 w-0.5 bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">2:00 PM</div>
                    <div className="font-medium">Inventory Restock</div>
                    <div className="text-xs text-gray-500">
                      Delivery from supplier
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-3 flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                    <div className="h-16 w-0.5 bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">5:00 PM</div>
                    <div className="font-medium">Evening Rush</div>
                    <div className="text-xs text-gray-500">
                      Prepare additional items
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-3 flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">8:00 PM</div>
                    <div className="font-medium">Close</div>
                    <div className="text-xs text-gray-500">
                      Clean up and inventory count
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="font-medium mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <Link to="/menu">
              <Button
                variant="outline"
                className="w-full h-auto py-3 flex flex-col items-center justify-center border-dashed"
              >
                <Utensils className="h-5 w-5 mb-1" />
                <span>Add Menu Item</span>
              </Button>
            </Link>
            <Link to="/settings">
              <Button
                variant="outline"
                className="w-full h-auto py-3 flex flex-col items-center justify-center border-dashed"
              >
                <Clock className="h-5 w-5 mb-1" />
                <span>Update Hours</span>
              </Button>
            </Link>
            <Link to="/messages">
              <Button
                variant="outline"
                className="w-full h-auto py-3 flex flex-col items-center justify-center border-dashed"
              >
                <MessageSquare className="h-5 w-5 mb-1" />
                <span>Customer Messages</span>
              </Button>
            </Link>
            <Link to="/analytics">
              <Button
                variant="outline"
                className="w-full h-auto py-3 flex flex-col items-center justify-center border-dashed"
              >
                <BarChart2 className="h-5 w-5 mb-1" />
                <span>View Reports</span>
              </Button>
            </Link>
            <Link to="/inventory">
              <Button
                variant="outline"
                className="w-full h-auto py-3 flex flex-col items-center justify-center border-dashed"
              >
                <Package className="h-5 w-5 mb-1" />
                <span>Manage Inventory</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
