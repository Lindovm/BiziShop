import React from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PlusCircle } from "lucide-react";

interface PairingItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  onAddToCart?: (id: string) => void;
}

const PairingItem = ({
  id = "1",
  name = "Garlic Bread",
  description = "Freshly baked bread with garlic butter",
  price = 4.99,
  image = "https://images.unsplash.com/photo-1619535860434-cf9b902a0a14?w=300&q=80",
  onAddToCart = () => {},
}: PairingItemProps) => {
  return (
    <Card className="w-64 h-80 flex flex-col overflow-hidden bg-white shadow-md rounded-lg">
      <div className="h-40 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{description}</p>
        <div className="mt-auto flex justify-between items-center">
          <span className="font-medium">${price.toFixed(2)}</span>
          <Button
            size="sm"
            variant="ghost"
            className="p-0 h-8 w-8"
            onClick={() => onAddToCart(id)}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

interface RecommendedPairingsProps {
  title?: string;
  pairings?: PairingItemProps[];
  onAddToCart?: (id: string) => void;
}

const RecommendedPairings = ({
  title = "Recommended Pairings",
  pairings = [
    {
      id: "1",
      name: "Garlic Bread",
      description: "Freshly baked bread with garlic butter and herbs",
      price: 4.99,
      image:
        "https://images.unsplash.com/photo-1619535860434-cf9b902a0a14?w=300&q=80",
    },
    {
      id: "2",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with Caesar dressing and croutons",
      price: 6.99,
      image:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300&q=80",
    },
    {
      id: "3",
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee-soaked ladyfingers",
      price: 7.99,
      image:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&q=80",
    },
    {
      id: "4",
      name: "Sparkling Water",
      description: "Refreshing carbonated mineral water",
      price: 2.99,
      image:
        "https://images.unsplash.com/photo-1606168094336-48f555bb6f7a?w=300&q=80",
    },
  ],
  onAddToCart = () => {},
}: RecommendedPairingsProps) => {
  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4">
          {pairings.map((pairing) => (
            <PairingItem
              key={pairing.id}
              {...pairing}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedPairings;
