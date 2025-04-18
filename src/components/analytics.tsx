import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  BarChart2,
  Calendar,
  DollarSign,
  Download,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Layout from "./Layout";

const Analytics = () => {
  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button className="px-3 py-1.5 bg-orange-500 text-white font-medium">
                Today
              </button>
              <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100">
                Week
              </button>
              <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100">
                Month
              </button>
              <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100">
                Year
              </button>
            </div>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Orders
                </h3>
                <ShoppingBag className="h-5 w-5 text-orange-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">1,248</div>
                <div className="flex items-center text-xs text-green-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Revenue
                </h3>
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">$24,389</div>
                <div className="flex items-center text-xs text-green-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+8% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">
                  Avg. Rating
                </h3>
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">4.8</div>
                <div className="flex items-center text-xs text-green-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+0.2 from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Customers
                </h3>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">512</div>
                <div className="flex items-center text-xs text-green-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+24 new this month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="w-full bg-white mb-4 p-1 rounded-lg">
            <TabsTrigger value="sales" className="flex-1">
              Sales
            </TabsTrigger>
            <TabsTrigger value="items" className="flex-1">
              Popular Items
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex-1">
              Customer Insights
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex-1">
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  {/* Sales Chart Placeholder */}
                  <div className="h-full w-full bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">
                        Sales chart visualization would appear here
                      </p>
                      <p className="text-sm text-gray-400">
                        Showing daily sales for the current month
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">
                      Avg. Order Value
                    </div>
                    <div className="text-xl font-bold">$19.54</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Conversion Rate</div>
                    <div className="text-xl font-bold">68%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">
                      Repeat Customers
                    </div>
                    <div className="text-xl font-bold">42%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tab contents... */}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;
