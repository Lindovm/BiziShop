import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Store, MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { shopDB } from "../lib/firebase-db";
import { Restaurant } from "../types/models";
import Layout from "./Layout";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching all restaurants...");

        // First try to get directly from the restaurants collection
        try {
          console.log("Directly querying the restaurants collection...");
          const restaurantsCollection = await shopDB.getAllRestaurants();
          console.log("Direct restaurants collection query result:", restaurantsCollection);

          if (restaurantsCollection && restaurantsCollection.length > 0) {
            console.log(`Found ${restaurantsCollection.length} restaurants directly from collection`);
            setRestaurants(restaurantsCollection as Restaurant[]);
            setLoading(false);
            return;
          }
        } catch (directError) {
          console.error("Error directly querying restaurants collection:", directError);
        }

        // Fallback to getAllShops if direct query fails
        console.log("Falling back to getAllShops...");
        const restaurantsData = await shopDB.getAllShops();

        console.log("Restaurants fetched:", restaurantsData);

        if (!restaurantsData || restaurantsData.length === 0) {
          console.log("No restaurants found, creating a test restaurant");

          // Create a test restaurant if none exist
          const testRestaurant = {
            id: "test-restaurant-1",
            name: "Test Restaurant",
            address: "123 Test Street, Test City",
            phone: "123-456-7890",
            email: "test@restaurant.com",
            createdAt: new Date().toISOString()
          };

          setRestaurants([testRestaurant as Restaurant]);
        } else {
          setRestaurants(restaurantsData as Restaurant[]);
        }
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load restaurants. Please try again later.");

        // Add a test restaurant even on error
        const testRestaurant = {
          id: "test-restaurant-error",
          name: "Test Restaurant (Error Fallback)",
          address: "123 Test Street, Test City",
          phone: "123-456-7890",
          email: "test@restaurant.com",
          createdAt: new Date().toISOString()
        };

        setRestaurants([testRestaurant as Restaurant]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on search term
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Restaurants</h1>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={async () => {
              try {
                const testRestaurant = {
                  name: "Test Restaurant " + new Date().toLocaleTimeString(),
                  address: "123 Test Street, Test City",
                  phone: "123-456-7890",
                  email: "test@restaurant.com",
                  createdAt: new Date().toISOString()
                };

                const restaurantId = `test-restaurant-${Date.now()}`;
                await shopDB.setShop(restaurantId, testRestaurant);
                alert(`Test restaurant created with ID: ${restaurantId}`);
                window.location.reload();
              } catch (error) {
                console.error("Error creating test restaurant:", error);
                alert("Failed to create test restaurant");
              }
            }}
          >
            Create Test Restaurant
          </Button>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <Input
            placeholder="Search restaurants by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2">Loading restaurants...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-red-500">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Try Again
            </Button>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="py-12 text-center">
            <Store className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No restaurants match your search." : "No restaurants found."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
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
                      <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                      {restaurant.address && (
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" /> {restaurant.address}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {restaurant.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{restaurant.phone}</span>
                      </div>
                    )}
                    {restaurant.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{restaurant.email}</span>
                      </div>
                    )}
                    <div className="pt-2 flex justify-between items-center">
                      <Badge className="bg-orange-500">
                        ID: {restaurant.id.substring(0, 8)}...
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Copy restaurant ID to clipboard
                          navigator.clipboard.writeText(restaurant.id);
                          alert(`Restaurant ID copied: ${restaurant.id}`);
                        }}
                      >
                        Copy ID
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RestaurantList;
