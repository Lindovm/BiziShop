import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import Layout from "./Layout";

const Menu = () => {
  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg w-64"
              />
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full bg-white mb-4 p-1 rounded-lg">
            <TabsTrigger value="all" className="flex-1">
              All Items
            </TabsTrigger>
            <TabsTrigger value="mains" className="flex-1">
              Main Dishes
            </TabsTrigger>
            <TabsTrigger value="sides" className="flex-1">
              Sides
            </TabsTrigger>
            <TabsTrigger value="drinks" className="flex-1">
              Drinks
            </TabsTrigger>
            <TabsTrigger value="desserts" className="flex-1">
              Desserts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Menu Item Card 1 */}
              <Card className="overflow-hidden">
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&q=80"
                    alt="Beef Taco"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">Beef Tacos</h3>
                      <Badge className="bg-orange-100 text-orange-800 mt-1">
                        Main Dish
                      </Badge>
                    </div>
                    <div className="text-lg font-bold">$6.00</div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Corn tortilla, seasoned beef, lettuce, cheese, and pico de
                    gallo.
                  </p>
                  <div className="flex justify-between">
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      Popular
                    </Badge>
                    <div className="space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Menu Item Card 2 */}
              <Card className="overflow-hidden">
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&q=80"
                    alt="Chicken Quesadilla"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">Chicken Quesadilla</h3>
                      <Badge className="bg-orange-100 text-orange-800 mt-1">
                        Main Dish
                      </Badge>
                    </div>
                    <div className="text-lg font-bold">$8.99</div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Flour tortilla filled with grilled chicken, melted cheese,
                    and sautéed peppers.
                  </p>
                  <div className="flex justify-between">
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      Popular
                    </Badge>
                    <div className="space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional menu items... */}
            </div>
          </TabsContent>

          {/* Other tab contents... */}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Menu;
