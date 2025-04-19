import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Check, Printer, Share } from "lucide-react";
import { getUserRole } from "../lib/supabase";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const OrderConfirmationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get order data from location state
  const orderItems = location.state?.orderItems || [];
  const orderTotal = location.state?.orderTotal || 0;
  const paymentMethod = location.state?.paymentMethod || {
    id: "",
    name: "Not specified",
  };

  // Generate a random order number
  const orderNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;

  const handleBackToDashboard = async () => {
    const role = await getUserRole();
    if (role === "cashier") {
      navigate("/orders");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4 bg-gray-50">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-2"
            onClick={handleBackToDashboard}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Order Confirmation</h1>
            <Badge className="bg-green-500">Confirmed</Badge>
          </div>
        </div>

        <Card className="bg-white mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-center flex-col mb-6">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold mb-1">
                Order {orderNumber} Confirmed!
              </h2>
              <p className="text-gray-500">Thank you for your order</p>
            </div>

            <div className="border-t border-b border-gray-100 py-4 mb-4">
              <h3 className="font-medium mb-3">Order Details</h3>
              <div className="space-y-3">
                {orderItems.map((item: OrderItem) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">
                        {item.quantity}x
                      </span>
                      <span>{item.name}</span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Subtotal</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Tax</span>
                <span>${(orderTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>Total</span>
                <span>${(orderTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium">{paymentMethod.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-3 mb-6">
          <Button variant="outline" className="flex-1">
            <Printer className="mr-2 h-4 w-4" /> Print Receipt
          </Button>
          <Button variant="outline" className="flex-1">
            <Share className="mr-2 h-4 w-4" /> Share Order
          </Button>
        </div>

        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 mb-4"
          onClick={handleBackToDashboard}
        >
          Return to Home
        </Button>
      </div>
    </Layout>
  );
};

export default OrderConfirmationScreen;
