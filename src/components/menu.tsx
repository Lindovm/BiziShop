import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Edit, Plus, Search, Trash2, List } from "lucide-react";
import Layout from "./Layout";
import { useShop } from "../contexts/ShopContext";
import { formatCurrency } from "../lib/utils";
import AddItemForm from "./AddItemForm";
import { addFoodCategories } from "../lib/add-food-categories";
import TestAddItem from "./TestAddItem";

const Menu = () => {
  const { products, categories, loadingProducts, loadingCategories, refreshProducts, refreshCategories } = useShop();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isAddingCategories, setIsAddingCategories] = useState(false);

  // Function to add food categories
  const handleAddFoodCategories = async () => {
    try {
      setIsAddingCategories(true);
      await addFoodCategories();
      await refreshCategories();
      alert("Categories have been reset to the specified food categories!");
    } catch (error) {
      console.error("Error adding food categories:", error);
      alert("Failed to reset categories. Please try again.");
    } finally {
      setIsAddingCategories(false);
    }
  };

  // Add categories when component mounts
  useEffect(() => {
    handleAddFoodCategories();
  }, []);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  // Filter products based on search term
  const filteredProducts = searchTerm
    ? products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => setIsAddItemDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
        </div>

        {/* Test component for direct Firestore access */}
        <div className="mb-4">
          <TestAddItem />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full bg-white mb-4 p-1 rounded-lg">
            <TabsTrigger value="all" className="flex-1">
              All Items
            </TabsTrigger>
            {loadingCategories ? (
              <TabsTrigger value="loading" className="flex-1" disabled>
                Loading...
              </TabsTrigger>
            ) : (
              categories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="flex-1">
                  {category.name}
                </TabsTrigger>
              ))
            )}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loadingProducts ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                  <p className="text-center mt-4 text-gray-500">Loading menu items...</p>
                </CardContent>
              </Card>
            ) : filteredProducts.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    {searchTerm ? 'No items match your search.' : 'No menu items have been added yet.'}
                  </p>
                  <Button
                    className="mt-4 bg-orange-500 hover:bg-orange-600"
                    onClick={() => setIsAddItemDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add First Item
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => {
                  const category = categories.find(c => c.id === product.category);
                  return (
                    <Card key={product.id} className="overflow-hidden">
                      {product.imageUrl && (
                        <div className="h-40 w-full overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            {category && (
                              <Badge className="bg-orange-100 text-orange-800 mt-1">
                                {category.name}
                              </Badge>
                            )}
                          </div>
                          <div className="text-lg font-bold">{formatCurrency(product.price)}</div>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          {product.description}
                        </p>
                        <div className="flex justify-between">
                          {product.popular && (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-600"
                            >
                              Popular
                            </Badge>
                          )}
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
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Category-specific tabs */}
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              {loadingProducts ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                    <p className="text-center mt-4 text-gray-500">Loading menu items...</p>
                  </CardContent>
                </Card>
              ) : products.filter(p => p.category === category.id).length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No {category.name} Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">No items in this category yet.</p>
                    <Button
                      className="mt-4 bg-orange-500 hover:bg-orange-600"
                      onClick={() => setIsAddItemDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add {category.name} Item
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products
                    .filter(p => p.category === category.id)
                    .filter(p =>
                      searchTerm === '' ||
                      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.description.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(product => (
                      <Card key={product.id} className="overflow-hidden">
                        {product.imageUrl && (
                          <div className="h-40 w-full overflow-hidden">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-lg">{product.name}</h3>
                              <Badge className="bg-orange-100 text-orange-800 mt-1">
                                {category.name}
                              </Badge>
                            </div>
                            <div className="text-lg font-bold">{formatCurrency(product.price)}</div>
                          </div>
                          <p className="text-sm text-gray-500 mb-4">
                            {product.description}
                          </p>
                          <div className="flex justify-between">
                            {product.popular && (
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                              >
                                Popular
                              </Badge>
                            )}
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
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Add Item Dialog */}
      <AddItemForm
        open={isAddItemDialogOpen}
        onOpenChange={setIsAddItemDialogOpen}
        onSuccess={refreshProducts}
      />
    </Layout>
  );
};

export default Menu;
