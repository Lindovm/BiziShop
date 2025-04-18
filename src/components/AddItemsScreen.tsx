import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Plus, Minus, ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface OrderItem extends Product {
  quantity: number;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Beef Taco",
    price: 6.0,
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=100&q=80",
  },
  {
    id: "2",
    name: "Chicken Quesadilla",
    price: 8.99,
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=100&q=80",
  },
  {
    id: "3",
    name: "Loaded Nachos",
    price: 10.5,
    image:
      "https://images.unsplash.com/photo-1562059390-a761a084768e?w=100&q=80",
  },
  {
    id: "4",
    name: "Veggie Burrito",
    price: 9.5,
    image:
      "https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=100&q=80",
  },
  {
    id: "5",
    name: "Chips & Guacamole",
    price: 5.0,
    image:
      "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=100&q=80",
  },
  {
    id: "6",
    name: "Horchata",
    price: 3.99,
    image:
      "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=100&q=80",
  },
];

const AddItemsScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const filteredProducts = searchQuery
    ? mockProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : mockProducts;

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
          {filteredProducts.map((product) => (
            <Card key={product.id} className="bg-white overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  {product.image && (
                    <div className="h-24 w-24 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-gray-500">${product.price.toFixed(2)}</p>
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
          ))}
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
                  ${getOrderTotal().toFixed(2)}
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
