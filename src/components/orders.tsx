import React, { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Clock, Filter, Plus, Search } from "lucide-react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { useShop } from "../contexts/ShopContext";
import { Order as OrderType, OrderItem } from "../types/models";
import { formatCurrency, timeElapsed } from "../lib/utils";

const Orders = () => {
  const navigate = useNavigate();
  const { activeOrders, completedOrders, loadingOrders, refreshOrders } = useShop();

  // Debug: Log orders when they change
  useEffect(() => {
    console.log("Active Orders:", activeOrders);
    console.log("Completed Orders:", completedOrders);
  }, [activeOrders, completedOrders]);

  // Refresh orders when component mounts
  useEffect(() => {
    refreshOrders();

    // Debug: Check Firestore directly
    const checkFirestore = async () => {
      try {
        // Import Firestore functions
        const { collection, getDocs, query, where } = await import('firebase/firestore');
        const { firestore } = await import('../lib/firebase');

        console.log("Checking Firestore directly for orders...");

        // Query all orders
        const ordersRef = collection(firestore, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);

        console.log(`Found ${ordersSnapshot.size} total orders in Firestore`);

        // Log each order
        ordersSnapshot.forEach(doc => {
          console.log(`Order ${doc.id}:`, doc.data());
        });

        // Try to find the specific order we saw in Firebase
        const specificOrderRef = query(
          collection(firestore, 'orders'),
          where('restaurant.id', '==', '2N5qPT2UasAPyjTpDSUY')
        );

        const specificOrderSnapshot = await getDocs(specificOrderRef);
        console.log(`Found ${specificOrderSnapshot.size} orders for restaurant 2N5qPT2UasAPyjTpDSUY`);

        specificOrderSnapshot.forEach(doc => {
          console.log(`Restaurant order ${doc.id}:`, doc.data());
        });
      } catch (error) {
        console.error("Error checking Firestore:", error);
      }
    };

    checkFirestore();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              {activeOrders.filter(order => order.status === 'pending').length > 0 && (
                <Badge className="ml-2 bg-orange-100 text-orange-800">
                  {activeOrders.filter(order => order.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preparing" className="flex-1">
              Preparing
              {activeOrders.filter(order => order.status === 'preparing').length > 0 && (
                <Badge className="ml-2 bg-blue-100 text-blue-800">
                  {activeOrders.filter(order => order.status === 'preparing').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="ready" className="flex-1">
              Ready
              {activeOrders.filter(order => order.status === 'ready').length > 0 && (
                <Badge className="ml-2 bg-green-100 text-green-800">
                  {activeOrders.filter(order => order.status === 'ready').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Completed
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex-1">
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-4">
            {loadingOrders ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                  <p className="text-center mt-4 text-gray-500">Loading orders...</p>
                </CardContent>
              </Card>
            ) : !loadingOrders && activeOrders.filter(order => order.status === 'pending').length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>New Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No new orders at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              activeOrders
                .filter(order => order.status === 'pending')
                .filter(order =>
                  searchTerm === '' ||
                  order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map(order => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-bold text-lg">Order #{typeof order.id === 'string' ? order.id.slice(-4) : 'New'}</span>
                          <Badge className="ml-2 bg-orange-100 text-orange-800">
                            New
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {order.createdAt ? `Placed ${timeElapsed(order.createdAt)}` : 'Recently placed'}
                        </div>
                      </div>
                      <div className="text-lg font-bold">{formatCurrency(order.total)}</div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium">Items:</div>
                      <ul className="text-sm mt-1">
                        {order.items.map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>{formatCurrency(item.totalPrice)}</span>
                          </li>
                        ))}
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
                ))
            )}
          </TabsContent>

          <TabsContent value="preparing" className="space-y-4">
            {loadingOrders ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                  <p className="text-center mt-4 text-gray-500">Loading orders...</p>
                </CardContent>
              </Card>
            ) : !loadingOrders && activeOrders.filter(order => order.status === 'preparing').length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Preparing Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No orders are being prepared at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              activeOrders
                .filter(order => order.status === 'preparing')
                .filter(order =>
                  searchTerm === '' ||
                  order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map(order => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-bold text-lg">Order #{typeof order.id === 'string' ? order.id.slice(-4) : 'New'}</span>
                          <Badge className="ml-2 bg-blue-100 text-blue-800">
                            Preparing
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {order.createdAt ? `Placed ${timeElapsed(order.createdAt)}` : 'Recently placed'}
                        </div>
                      </div>
                      <div className="text-lg font-bold">{formatCurrency(order.total)}</div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium">Items:</div>
                      <ul className="text-sm mt-1">
                        {order.items.map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>{formatCurrency(item.totalPrice)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">
                          {order.updatedAt ? `Started ${timeElapsed(order.updatedAt)}` : 'Recently started'}
                        </span>
                      </div>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        Ready for Pickup
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </TabsContent>

          <TabsContent value="ready" className="space-y-4">
            {loadingOrders ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                  <p className="text-center mt-4 text-gray-500">Loading orders...</p>
                </CardContent>
              </Card>
            ) : !loadingOrders && activeOrders.filter(order => order.status === 'ready').length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Ready Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No orders are ready for pickup at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              activeOrders
                .filter(order => order.status === 'ready')
                .filter(order =>
                  searchTerm === '' ||
                  order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map(order => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-bold text-lg">Order #{typeof order.id === 'string' ? order.id.slice(-4) : 'New'}</span>
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            Ready
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {order.createdAt ? `Placed ${timeElapsed(order.createdAt)}` : 'Recently placed'}
                        </div>
                      </div>
                      <div className="text-lg font-bold">{formatCurrency(order.total)}</div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium">Items:</div>
                      <ul className="text-sm mt-1">
                        {order.items.map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>{formatCurrency(item.totalPrice)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">
                          {order.updatedAt ? `Ready for ${timeElapsed(order.updatedAt)}` : 'Just ready'}
                        </span>
                      </div>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">
                        Mark as Delivered
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {loadingOrders ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
                  </div>
                  <p className="text-center mt-4 text-gray-500">Loading orders...</p>
                </CardContent>
              </Card>
            ) : !loadingOrders && completedOrders.filter(order => order.status === 'completed').length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Completed Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No completed orders today yet.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {completedOrders
                      .filter(order => order.status === 'completed')
                      .filter(order =>
                        searchTerm === '' ||
                        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .slice(0, 5) // Show only the 5 most recent
                      .map(order => (
                        <div key={order.id} className="flex justify-between items-center p-3 border-b last:border-0">
                          <div>
                            <div className="font-medium">Order #{typeof order.id === 'string' ? order.id.slice(-4) : 'New'}</div>
                            <div className="text-sm text-gray-500">
                              {order.completedAt ? `Completed ${timeElapsed(order.completedAt)}` : 'Recently completed'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(order.total)}</div>
                            <div className="text-sm text-gray-500">{order.items.length} items</div>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {loadingOrders ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
                  </div>
                  <p className="text-center mt-4 text-gray-500">Loading orders...</p>
                </CardContent>
              </Card>
            ) : !loadingOrders && completedOrders.filter(order => order.status === 'cancelled').length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Cancelled Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">No cancelled orders today.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Cancelled Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {completedOrders
                      .filter(order => order.status === 'cancelled')
                      .filter(order =>
                        searchTerm === '' ||
                        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .slice(0, 5) // Show only the 5 most recent
                      .map(order => (
                        <div key={order.id} className="flex justify-between items-center p-3 border-b last:border-0">
                          <div>
                            <div className="font-medium">Order #{typeof order.id === 'string' ? order.id.slice(-4) : 'New'}</div>
                            <div className="text-sm text-gray-500">
                              {order.updatedAt ? `Cancelled ${timeElapsed(order.updatedAt)}` : 'Recently cancelled'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(order.total)}</div>
                            <div className="text-sm text-gray-500">{order.items.length} items</div>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </>
            )}
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
