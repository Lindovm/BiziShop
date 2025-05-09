import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Edit, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import Layout from "./Layout";
import { useShop } from "../contexts/ShopContext";
import { formatCurrency } from "../lib/utils";
import AddItemForm from "./AddItemForm";
import { Badge } from "./ui/badge";

const Menu = () => {
  const { products, loadingProducts, refreshProducts } = useShop();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Effect to refresh products when component mounts
  useEffect(() => {
    handleRefresh();
  }, []);

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshProducts();
      console.log("Products refreshed:", products);
    } catch (error) {
      console.error("Error refreshing products:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

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
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => setIsAddItemDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {loadingProducts ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
                <p className="text-center mt-4 text-gray-500">Loading menu items...</p>
                <p className="text-center mt-2 text-xs text-gray-400">
                  {products.length > 0
                    ? `Found ${products.length} items in memory, refreshing from database...`
                    : 'Fetching items from database...'}
                </p>
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
              {filteredProducts.map(product => (
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
        </div>
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
