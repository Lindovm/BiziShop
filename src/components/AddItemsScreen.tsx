import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Plus, Minus, ArrowRight } from "lucide-react";
import { useShop } from "../contexts/ShopContext";
import { formatCurrency } from "../lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface OrderItem extends Product {
  quantity: number;
}

// We'll use real products from Firebase instead of mock data

const AddItemsScreen = () => {
  const navigate = useNavigate();
  const { products, loadingProducts } = useShop();
  const [searchQuery, setSearchQuery] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const filteredProducts = searchQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products;

  const addItemToOrder = (product: Product) => {
    setOrderItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id,
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeItemFromOrder = (productId: string) => {
    setOrderItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === productId,
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        if (updatedItems[existingItemIndex].quantity > 1) {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity - 1,
          };
          return updatedItems;
        } else {
          return prevItems.filter((item) => item.id !== productId);
        }
      }
      return prevItems;
    });
  };

  const getOrderTotal = () => {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const handleProceedToPayment = () => {
    // Pass the order items and total to the payment method screen
    navigate("/payment-method", {
      state: {
        orderItems,
        orderTotal: getOrderTotal(),
      },
    });
  };

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4 bg-gray-50">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Add Items to Order</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for items..."
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {loadingProducts ? (
            <Card className="col-span-3 bg-white p-6">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
                <p className="text-gray-500">Loading menu items...</p>
              </div>
            </Card>
          ) : filteredProducts.length === 0 ? (
            <Card className="col-span-3 bg-white p-6">
              <div className="text-center">
                <p className="text-gray-500 mb-4">
                  {searchQuery ? 'No items match your search.' : 'No menu items available.'}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                    className="mx-auto"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {product.imageUrl && (
                      <div className="h-24 w-24 flex-shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-gray-500">{formatCurrency(product.price)}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => addItemToOrder(product)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        {orderItems.find((item) => item.id === product.id) && (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => removeItemFromOrder(product.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium">
                              {orderItems.find((item) => item.id === product.id)
                                ?.quantity || 0}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {orderItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="w-full max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-gray-500">Items:</span>{" "}
                  <Badge className="bg-orange-500">
                    {orderItems.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}
                  </Badge>
                </div>
                <div className="text-xl font-bold">
                  {formatCurrency(getOrderTotal())}
                </div>
              </div>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AddItemsScreen;
