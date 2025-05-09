import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import Layout from "./Layout";
import { useShop } from "../contexts/ShopContext";
import { formatCurrency } from "../lib/utils";

const Menu = () => {
  const { products, categories, loadingProducts, loadingCategories } = useShop();
  const [searchTerm, setSearchTerm] = useState("");

  // Memoized list of categories for display, including a synthetic "Uncategorized" tab if needed.
  const displayCategories = useMemo(() => {
    const originalCategories = categories || [];
    const hasUncategorizedProducts = products.some(
      (p) => !p.category || p.category === "uncategorized",
    );

    if (hasUncategorizedProducts) {
      const uncatCategoryExists = originalCategories.some(
        (c) => c.id === "uncategorized",
      );
      if (!uncatCategoryExists) {
        // Define a default order for categories if not present, and place "Uncategorized" last.
        const maxOrder = originalCategories.reduce((max, cat) => Math.max(max, cat.order || 0), 0);
        return [
          ...originalCategories,
          { id: "uncategorized", name: "Uncategorized", order: maxOrder + 1 },
        ];
      }
    }
    return originalCategories;
  }, [products, categories]);

  // Group products by category (can be kept if used elsewhere or for debugging)
  const productsByCategory = products.reduce((acc, product) => {
    const categoryKey = product.category || 'uncategorized';
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(product);
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
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          {/* Increased height of the TabsList container slightly */}
          <div className="w-full overflow-hidden h-14 flex items-center"> 
            <TabsList className="flex bg-white mb-4 p-1 rounded-lg overflow-x-auto whitespace-nowrap">
              <TabsTrigger value="all" className="px-4 py-2 text-sm font-medium">
                All Items
              </TabsTrigger>
              {loadingCategories && displayCategories.length === 0 ? (
                <TabsTrigger value="loading" className="px-4 py-2 text-sm font-medium" disabled>
                  Loading Categories...
                </TabsTrigger>
              ) : (
                displayCategories
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map(category => (
                    <TabsTrigger key={category.id} value={category.id} className="px-4 py-2 text-sm font-medium">
                      {category.name}
                    </TabsTrigger>
                  ))
              )}
            </TabsList>
          </div>

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
                  <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" /> Add First Item
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => {
                  const productCategoryObj = categories.find(c => c.id === product.category);
                  if (product.name === "Burger") { // Debug log for Burger
                    console.log("Burger Debug: product.category =", product.category);
                    console.log("Burger Debug: categories array =", JSON.stringify(categories));
                    console.log("Burger Debug: productCategoryObj found =", productCategoryObj);
                  }
                  return (
                    <Card key={product.id} className="overflow-hidden flex flex-col">
                      {product.imageUrl && (
                        <div className="h-36 w-full overflow-hidden"> {/* Adjusted height */}
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-center mb-1"> {/* Title and Price */}
                          <h3 className="font-bold text-lg truncate">{product.name}</h3>
                          <div className="text-lg font-bold whitespace-nowrap">{formatCurrency(product.price)}</div>
                        </div>
                        {product["Side or Main"] && ( /* Display "Side or Main" field value */
                          <Badge className="bg-amber-100 text-amber-800 self-start mb-2 px-2 py-0.5 text-xs">
                            {product["Side or Main"]}
                          </Badge>
                        )}
                        <p className="text-sm text-gray-500 mb-3 flex-grow"> {/* Description */}
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center mt-auto"> {/* Popular Badge and Actions */}
                          {product["Main Category"] === "Popular" && (
                            <Badge
                              variant="outline"
                              className="bg-white text-green-600 border-green-600 px-2 py-0.5 text-xs"
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
          {displayCategories
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(category => {
              const categoryProducts = products.filter(p => {
                if (category.id === "uncategorized") {
                  return !p.category || p.category === "uncategorized";
                }
                return p.category === category.id;
              });

              const filteredCategoryProducts = categoryProducts.filter(
                p =>
                  searchTerm === "" ||
                  p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.description.toLowerCase().includes(searchTerm.toLowerCase()),
              );

              return (
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
                  ) : filteredCategoryProducts.length === 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>No {category.name} Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-500">
                          {searchTerm ? 'No items match your search in this category.' : `No items in ${category.name} yet.`}
                        </p>
                        <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
                          <Plus className="h-4 w-4 mr-2" /> Add {category.name} Item
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCategoryProducts.map(product => (
                        // The 'category' variable here is from the .map(category => ...) loop
                        <Card key={product.id} className="overflow-hidden flex flex-col">
                          {product.imageUrl && (
                            <div className="h-36 w-full overflow-hidden"> {/* Adjusted height */}
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="p-4 flex flex-col flex-grow">
                            <div className="flex justify-between items-center mb-1"> {/* Title and Price */}
                              <h3 className="font-bold text-lg truncate">{product.name}</h3>
                              <div className="text-lg font-bold whitespace-nowrap">{formatCurrency(product.price)}</div>
                            </div>
                            {/* Display "Side or Main" field value */}
                            {product["Side or Main"] && (
                            <Badge className="bg-amber-100 text-amber-800 self-start mb-2 px-2 py-0.5 text-xs">
                              {product["Side or Main"]}
                            </Badge>
                            )}
                            <p className="text-sm text-gray-500 mb-3 flex-grow"> {/* Description */}
                              {product.description}
                            </p>
                            <div className="flex justify-between items-center mt-auto"> {/* Popular Badge and Actions */}
                              {product["Main Category"] === "Popular" && (
                                <Badge
                                  variant="outline"
                                  className="bg-white text-green-600 border-green-600 px-2 py-0.5 text-xs"
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
              );
            })}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Menu;
