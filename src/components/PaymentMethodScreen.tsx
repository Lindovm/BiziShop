import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Wallet,
  Banknote,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const PaymentMethodScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("credit_card");

  // In a real app, this would come from a global state or context
  // For now, we'll assume the order total is passed via location state
  const orderTotal = location.state?.orderTotal || 0;
  const orderItems = location.state?.orderItems || [];

  const paymentMethods: PaymentMethod[] = [
    {
      id: "credit_card",
      name: "Credit Card",
      icon: <CreditCard className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "cash",
      name: "Cash",
      icon: <Banknote className="h-5 w-5 text-green-500" />,
    },
    {
      id: "digital_wallet",
      name: "Digital Wallet",
      icon: <Wallet className="h-5 w-5 text-purple-500" />,
    },
  ];

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleProceedToConfirmation = () => {
    navigate("/order-confirmation", {
      state: {
        orderItems,
        orderTotal,
        paymentMethod: paymentMethods.find(
          (method) => method.id === selectedPaymentMethod,
        ),
      },
    });
  };

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4 bg-gray-50">
        <div className="mb-6">
          <Button variant="ghost" className="mb-2" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Items
          </Button>
          <h1 className="text-2xl font-bold">Select Payment Method</h1>
          <p className="text-gray-500">
            Choose how you would like to pay for this order
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <RadioGroup
            value={selectedPaymentMethod}
            onValueChange={setSelectedPaymentMethod}
            className="space-y-3"
          >
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`bg-white cursor-pointer ${selectedPaymentMethod === method.id ? "border-2 border-orange-500" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label
                      htmlFor={method.id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {method.icon}
                      </div>
                      <span className="font-medium">{method.name}</span>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>

        {selectedPaymentMethod === "credit_card" && (
          <Card className="bg-white mb-8">
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Credit Card Details</h3>
              <p className="text-gray-500 text-sm">
                In a real application, this would contain credit card input
                fields. For this demo, we'll skip the actual payment processing.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-500">Order Total:</div>
              <div className="text-xl font-bold">${orderTotal.toFixed(2)}</div>
            </div>
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handleProceedToConfirmation}
            >
              Proceed to Confirmation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentMethodScreen;
