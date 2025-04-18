import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Clock, CreditCard, MapPin, Save, User } from "lucide-react";
import Layout from "./Layout";
import { Badge } from "./ui/badge";

const Settings = () => {
  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full bg-white mb-4 p-1 rounded-lg">
            <TabsTrigger value="profile" className="flex-1">
              Profile
            </TabsTrigger>
            <TabsTrigger value="business" className="flex-1">
              Business Details
            </TabsTrigger>
            <TabsTrigger value="hours" className="flex-1">
              Operating Hours
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex-1">
              Payment
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1">
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-500">
                    V
                  </div>
                  <Button variant="outline">Change Photo</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Victor" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Martinez" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="victor@tacotruck42.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional cards... */}
          </TabsContent>

          {/* Other tab contents... */}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
