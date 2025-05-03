import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Clock, CreditCard, MapPin, Save, User, Store, Loader2 } from "lucide-react";
import Layout from "./Layout";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { User as UserType, Restaurant } from "../types/models";
import { shopDB } from "../lib/firebase-db";

const Settings = () => {
  const { userProfile, updateUserProfile, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loadingRestaurant, setLoadingRestaurant] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // Initialize form data when userProfile is loaded
  useEffect(() => {
    if (userProfile) {
      console.log("User profile loaded:", userProfile);
      console.log("All user profile fields:", Object.keys(userProfile));

      // Check all possible restaurant ID field names
      const restaurantId =
        userProfile.restaurant_id ||
        userProfile.restaurantId ||
        userProfile.restaurants_id;

      console.log("Restaurant ID found:", restaurantId);

      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        address: userProfile.address || ""
      });

      // Fetch restaurant data if any restaurant ID field exists
      if (restaurantId) {
        console.log("Fetching restaurant data for:", restaurantId);
        fetchRestaurantData(restaurantId);
      } else {
        console.log("No restaurant ID field found in user profile");
      }
    }
  }, [userProfile]);

  // Fetch restaurant data using the restaurant_id reference
  const fetchRestaurantData = async (restaurantRef: any) => {
    try {
      setLoadingRestaurant(true);
      console.log("Fetching restaurant with reference:", restaurantRef);

      // If the reference is undefined or null, log and return
      if (!restaurantRef) {
        console.log("Restaurant reference is null or undefined");
        setRestaurant(null);
        setLoadingRestaurant(false);
        return;
      }

      const restaurantData = await shopDB.getRestaurantByReference(restaurantRef);
      console.log("Restaurant data result:", restaurantData);

      if (restaurantData) {
        console.log("Setting restaurant data:", restaurantData);
        setRestaurant(restaurantData as Restaurant);
      } else {
        console.log("No restaurant found with the given reference");
        setRestaurant(null);
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      setRestaurant(null);
    } finally {
      setLoadingRestaurant(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Update user profile
      await updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get first letter of name for avatar
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2">Loading profile...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Link to="/restaurants">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Store className="h-4 w-4 mr-2" /> View All Restaurants
            </Button>
          </Link>
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
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-500">
                      {getInitial(userProfile?.name || "")}
                    </div>
                    <Button type="button" variant="outline">Change Photo</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Restaurant Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Information</CardTitle>
                <CardDescription>
                  The restaurant you are associated with
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRestaurant ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                    <span className="ml-2">Loading restaurant information...</span>
                  </div>
                ) : restaurant ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      {restaurant.logo_url ? (
                        <img
                          src={restaurant.logo_url}
                          alt={restaurant.name}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-orange-100 rounded-md flex items-center justify-center">
                          <Store className="h-8 w-8 text-orange-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                        {restaurant.address && (
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" /> {restaurant.address}
                          </p>
                        )}
                      </div>
                    </div>

                    {restaurant.phone && (
                      <div className="text-sm">
                        <span className="font-medium">Phone:</span> {restaurant.phone}
                      </div>
                    )}

                    {restaurant.email && (
                      <div className="text-sm">
                        <span className="font-medium">Email:</span> {restaurant.email}
                      </div>
                    )}

                    <div className="text-sm">
                      <span className="font-medium">Role:</span>{" "}
                      <Badge className="bg-orange-500">
                        {userProfile?.role.charAt(0).toUpperCase() + userProfile?.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <Store className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      You are not associated with any restaurant.
                    </p>
                    <div className="flex flex-col space-y-2 mt-4">
                      {userProfile?.role === "owner" && (
                        <Button className="bg-orange-500 hover:bg-orange-600">
                          Create Restaurant
                        </Button>
                      )}
                      <Link to="/restaurants">
                        <Button variant="outline" className="w-full">
                          <Store className="h-4 w-4 mr-2" /> Browse All Restaurants
                        </Button>
                      </Link>
                    </div>

                    {/* Test buttons for development only */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Developer Options</p>
                      <div className="flex flex-col space-y-2">
                        <Link to="/restaurants">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            <Store className="h-4 w-4 mr-2" /> View All Restaurants
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              // Use a known restaurant ID from your Firestore
                              const testRestaurantId = '2N5qPT2UasAPyjTpDSUY'; // This is the ID we see in Firebase

                              // Create a dropdown to select the format of the restaurant_id
                              const format = window.prompt(
                                'Select restaurant_id format:\n1. Full path (restaurants/ID)\n2. Document ID only\n3. Full path with leading slash (/restaurants/ID)\n4. All formats (recommended)\nEnter 1, 2, 3, or 4:',
                                '4'
                              );

                              if (format === '4') {
                                // Set all formats to ensure compatibility
                                console.log(`Setting all restaurant ID formats`);
                                await updateUserProfile({
                                  restaurant_id: `restaurants/${testRestaurantId}`,
                                  restaurantId: `restaurants/${testRestaurantId}`,
                                  restaurants_id: `/restaurants/${testRestaurantId}`
                                });
                              } else {
                                let restaurant_id;
                                if (format === '1') {
                                  restaurant_id = `restaurants/${testRestaurantId}`;
                                } else if (format === '2') {
                                  restaurant_id = testRestaurantId;
                                } else if (format === '3') {
                                  restaurant_id = `/restaurants/${testRestaurantId}`;
                                } else {
                                  // Default to full path
                                  restaurant_id = `restaurants/${testRestaurantId}`;
                                }

                                console.log(`Setting restaurant_id to: ${restaurant_id}`);
                                await updateUserProfile({
                                  restaurant_id: restaurant_id
                                });
                              }

                              alert('User linked to test restaurant. Refresh the page to see changes.');
                            } catch (error) {
                              console.error('Error linking to test restaurant:', error);
                              alert('Failed to link to test restaurant.');
                            }
                          }}
                        >
                          Link to Test Restaurant
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log("Current user profile:", userProfile);
                            alert('User profile logged to console. Press F12 to view.');
                          }}
                        >
                          Show User Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tab contents... */}
          <TabsContent value="business" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>
                  Manage your restaurant's business information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 py-8 text-center">
                  Business details management will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
                <CardDescription>
                  Set your restaurant's operating hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 py-8 text-center">
                  Operating hours management will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>
                  Manage payment methods and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 py-8 text-center">
                  Payment settings will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 py-8 text-center">
                  Notification preferences will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
