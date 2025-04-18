import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Minus, Plus, ChevronDown, ChevronUp } from "lucide-react";

interface FeaturedDishProps {
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  sizes?: Array<{ id: string; name: string; price: number }>;
  ingredients?: Array<{ id: string; name: string; removable: boolean }>;
  spiceLevels?: number;
  currentSpiceLevel?: number;
}

const FeaturedDish = ({
  title = "Spicy Seafood Pasta",
  description = "A delicious blend of fresh seafood, al dente pasta, and our signature spicy tomato sauce. Garnished with fresh herbs and a squeeze of lemon.",
  price = 18.99,
  image = "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80",
  sizes = [
    { id: "small", name: "Small", price: 14.99 },
    { id: "medium", name: "Medium", price: 18.99 },
    { id: "large", name: "Large", price: 22.99 },
  ],
  ingredients = [
    { id: "pasta", name: "Pasta", removable: false },
    { id: "shrimp", name: "Shrimp", removable: true },
    { id: "calamari", name: "Calamari", removable: true },
    { id: "mussels", name: "Mussels", removable: true },
    { id: "tomato", name: "Tomato Sauce", removable: false },
    { id: "garlic", name: "Garlic", removable: true },
    { id: "herbs", name: "Fresh Herbs", removable: true },
    { id: "lemon", name: "Lemon", removable: true },
  ],
  spiceLevels = 5,
  currentSpiceLevel = 3,
}: FeaturedDishProps) => {
  const [selectedSize, setSelectedSize] = useState(sizes[1].id);
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState(currentSpiceLevel);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(true);

  const handleIngredientToggle = (ingredientId: string) => {
    if (removedIngredients.includes(ingredientId)) {
      setRemovedIngredients(
        removedIngredients.filter((id) => id !== ingredientId),
      );
    } else {
      setRemovedIngredients([...removedIngredients, ingredientId]);
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const selectedSizeObj =
    sizes.find((size) => size.id === selectedSize) || sizes[0];
  const totalPrice = selectedSizeObj.price * quantity;

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Dish Image */}
      <div className="relative h-80 w-full">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-white text-2xl font-bold">{title}</h2>
          <p className="text-white/90 text-sm">{description}</p>
        </div>
      </div>

      {/* Dish Details */}
      <div className="p-6">
        {/* Size Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Size Options</h3>
          <RadioGroup
            value={selectedSize}
            onValueChange={setSelectedSize}
            className="flex gap-4"
          >
            {sizes.map((size) => (
              <div key={size.id} className="flex items-center space-x-2">
                <RadioGroupItem value={size.id} id={`size-${size.id}`} />
                <label
                  htmlFor={`size-${size.id}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {size.name} (${size.price.toFixed(2)})
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Quantity</h3>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="mx-4 text-lg font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Customization Section */}
        <div className="border rounded-lg overflow-hidden mb-6">
          <div
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => setIsCustomizationOpen(!isCustomizationOpen)}
          >
            <h3 className="text-lg font-semibold">Customize Your Dish</h3>
            {isCustomizationOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {isCustomizationOpen && (
            <div className="p-4">
              {/* Ingredients Toggle */}
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3">Ingredients</h4>
                <div className="grid grid-cols-2 gap-3">
                  {ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center">
                      <Switch
                        id={`ingredient-${ingredient.id}`}
                        checked={!removedIngredients.includes(ingredient.id)}
                        onCheckedChange={() => {
                          if (ingredient.removable) {
                            handleIngredientToggle(ingredient.id);
                          }
                        }}
                        disabled={!ingredient.removable}
                      />
                      <label
                        htmlFor={`ingredient-${ingredient.id}`}
                        className={`ml-2 text-sm ${!ingredient.removable ? "text-gray-500" : ""}`}
                      >
                        {ingredient.name}
                        {!ingredient.removable && " (Required)"}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spice Level */}
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3">Spice Level</h4>
                <div className="px-2">
                  <Slider
                    value={[spiceLevel]}
                    min={1}
                    max={spiceLevels}
                    step={1}
                    onValueChange={(value) => setSpiceLevel(value[0])}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>Mild</span>
                    <span>Medium</span>
                    <span>Hot</span>
                  </div>
                  <p className="text-center mt-2 text-sm font-medium">
                    Current:{" "}
                    {spiceLevel === 1
                      ? "Mild"
                      : spiceLevel === spiceLevels
                        ? "Hot"
                        : "Medium"}
                  </p>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <h4 className="text-md font-medium mb-3">
                  Special Instructions
                </h4>
                <Textarea
                  placeholder="Any special requests or allergies?"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">
            Total: ${totalPrice.toFixed(2)}
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedDish;
