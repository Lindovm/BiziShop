import React, { useState } from "react";
import FeaturedDish from "./FeaturedDish";
import RecommendedPairings from "./RecommendedPairings";

interface MainContentProps {
  featuredDish?: {
    title?: string;
    description?: string;
    price?: number;
    image?: string;
    sizes?: Array<{ id: string; name: string; price: number }>;
    ingredients?: Array<{ id: string; name: string; removable: boolean }>;
    spiceLevels?: number;
    currentSpiceLevel?: number;
  };
  recommendedPairings?: {
    title?: string;
    pairings?: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      image: string;
    }>;
  };
}

const MainContent = ({
  featuredDish = {
    title: "Spicy Seafood Pasta",
    description:
      "A delicious blend of fresh seafood, al dente pasta, and our signature spicy tomato sauce. Garnished with fresh herbs and a squeeze of lemon.",
    price: 18.99,
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80",
    sizes: [
      { id: "small", name: "Small", price: 14.99 },
      { id: "medium", name: "Medium", price: 18.99 },
      { id: "large", name: "Large", price: 22.99 },
    ],
    ingredients: [
      { id: "pasta", name: "Pasta", removable: false },
      { id: "shrimp", name: "Shrimp", removable: true },
      { id: "calamari", name: "Calamari", removable: true },
      { id: "mussels", name: "Mussels", removable: true },
      { id: "tomato", name: "Tomato Sauce", removable: false },
      { id: "garlic", name: "Garlic", removable: true },
      { id: "herbs", name: "Fresh Herbs", removable: true },
      { id: "lemon", name: "Lemon", removable: true },
    ],
    spiceLevels: 5,
    currentSpiceLevel: 3,
  },
  recommendedPairings = {
    title: "Recommended Pairings",
    pairings: [
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
  },
}: MainContentProps) => {
  const [cartItems, setCartItems] = useState<string[]>([]);

  const handleAddToCart = (id: string) => {
    setCartItems((prev) => [...prev, id]);
    // In a real app, this would likely dispatch to a global state or context
    console.log(`Added item ${id} to cart`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white">
      <div className="space-y-8">
        {/* Featured Dish Section */}
        <FeaturedDish {...featuredDish} />

        {/* Recommended Pairings Section */}
        <RecommendedPairings
          title={recommendedPairings.title}
          pairings={recommendedPairings.pairings}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default MainContent;
