import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Trash2, X, ShoppingBag } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: string[];
}

interface OrderSidebarProps {
  cartItems?: CartItem[];
  subtotal?: number;
  tax?: number;
  deliveryFee?: number;
  total?: number;
  promoCode?: string;
  promoDiscount?: number;
  onRemoveItem?: (id: string) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onApplyPromo?: (code: string) => void;
  onConfirmOrder?: () => void;
}

const OrderSidebar = ({
  cartItems = [
    {
      id: "1",
      name: "Spicy Seafood Pasta",
      price: 18.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=200&q=80",
      options: ["Medium", "No Mussels", "Medium Spicy"],
    },
    {
      id: "2",
      name: "Garlic Bread",
      price: 4.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1619535860434-cf9b902a0a14?w=200&q=80",
    },
  ],
  subtotal = 23.98,
  tax = 2.4,
  deliveryFee = 3.99,
  total = 30.37,
  promoCode = "",
  promoDiscount = 0,
  onRemoveItem = () => {},
  onUpdateQuantity = () => {},
  onApplyPromo = () => {},
  onConfirmOrder = () => {},
}: OrderSidebarProps) => {
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setIsApplyingPromo(true);
    setPromoError("");

    // Simulate API call
    setTimeout(() => {
      if (promoInput.toUpperCase() === "DISHLY20") {
        onApplyPromo(promoInput);
        setPromoError("");
      } else {
        setPromoError("Invalid promo code");
      }
      setIsApplyingPromo(false);
    }, 1000);
  };

  return (
    <div className="w-full h-full bg-white border-l border-gray-200 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Your Order
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
          </span>
        </h2>
      </div>

      {/* Cart Items */}
      <div className="flex-grow overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingBag className="mx-auto h-12 w-12 mb-3 opacity-30" />
            <p>Your cart is empty</p>
            <p className="text-sm mt-1">
              Add some delicious dishes to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex border rounded-lg overflow-hidden"
              >
                {item.image && (
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-grow p-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {item.options && item.options.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500">
                      {item.options.join(" • ")}
                    </div>
                  )}
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center border rounded-full text-gray-500 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="mx-2 text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center border rounded-full text-gray-500 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promo Code */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            placeholder="Enter promo code"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={handleApplyPromo}
            disabled={isApplyingPromo}
            variant="outline"
          >
            {isApplyingPromo ? "Applying..." : "Apply"}
          </Button>
        </div>
        {promoError && (
          <p className="text-red-500 text-xs mt-1">{promoError}</p>
        )}
        {promoDiscount > 0 && (
          <div className="flex items-center justify-between mt-2 text-sm text-green-600">
            <span>Promo code {promoCode} applied!</span>
            <span>-${promoDiscount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          {promoDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${promoDiscount.toFixed(2)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Confirm Order Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={onConfirmOrder}
          disabled={cartItems.length === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          size="lg"
        >
          Confirm Order
        </Button>
        <p className="text-xs text-center text-gray-500 mt-2">
          By confirming your order, you agree to our Terms of Service and
          Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default OrderSidebar;
