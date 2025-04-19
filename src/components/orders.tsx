import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Clock, Filter, Plus, Search } from "lucide-react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Orders</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg w-64"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="new" className="w-full">
          <TabsList className="w-full bg-white mb-4 p-1 rounded-lg">
            <TabsTrigger value="new" className="flex-1">
              New
              <Badge className="ml-2 bg-orange-100 text-orange-800">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="preparing" className="flex-1">
              Preparing
              <Badge className="ml-2 bg-blue-100 text-blue-800">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="ready" className="flex-1">
              Ready
              <Badge className="ml-2 bg-green-100 text-green-800">1</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Completed
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex-1">
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-4">
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

            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="font-bold text-lg">Order #1043</span>
                    <Badge className="ml-2 bg-orange-100 text-orange-800">
                      New
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Placed 2 minutes ago
                  </div>
                </div>
                <div className="text-lg font-bold">$32.50</div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-medium">Items:</div>
                <ul className="text-sm mt-1">
                  <li className="flex justify-between">
                    <span>1x Nachos Supreme</span>
                    <span>$12.50</span>
                  </li>
                  <li className="flex justify-between">
                    <span>2x Chicken Burritos</span>
                    <span>$18.00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>1x Soda</span>
                    <span>$2.00</span>
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
          </TabsContent>

          <TabsContent value="preparing" className="space-y-4">
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
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-500">
                    Started 5 min ago
                  </span>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  Ready for Pickup
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ready" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="font-bold text-lg">Order #1040</span>
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      Ready
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Placed 25 minutes ago
                  </div>
                </div>
                <div className="text-lg font-bold">$22.99</div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-medium">Items:</div>
                <ul className="text-sm mt-1">
                  <li className="flex justify-between">
                    <span>1x Taco Combo</span>
                    <span>$15.99</span>
                  </li>
                  <li className="flex justify-between">
                    <span>1x Churros</span>
                    <span>$4.00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>1x Mexican Coke</span>
                    <span>$3.00</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-500">Ready for 3 min</span>
                </div>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  Mark as Delivered
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No completed orders today yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cancelled Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No cancelled orders today.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => navigate("/add-items")}
          size="icon"
          className="h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </Layout>
  );
};

export default Orders;
