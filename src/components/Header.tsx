import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, ShoppingCart, Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { cn } from "../lib/utils";

interface HeaderProps {
  logo?: string;
  categories?: Array<{
    id: string;
    name: string;
    subcategories?: Array<{ id: string; name: string }>;
  }>;
  cartItemCount?: number;
  onCartClick?: () => void;
  onCategoryClick?: (categoryId: string) => void;
  onSearchSubmit?: (searchTerm: string) => void;
}

const Header = ({
  logo = "Dishly",
  categories = [
    {
      id: "main-dishes",
      name: "Main Dishes",
      subcategories: [
        { id: "pasta", name: "Pasta" },
        { id: "pizza", name: "Pizza" },
        { id: "burgers", name: "Burgers" },
      ],
    },
    {
      id: "vegan",
      name: "Vegan",
      subcategories: [
        { id: "salads", name: "Salads" },
        { id: "bowls", name: "Bowls" },
        { id: "plant-based", name: "Plant-Based" },
      ],
    },
    {
      id: "desserts",
      name: "Desserts",
      subcategories: [
        { id: "cakes", name: "Cakes" },
        { id: "ice-cream", name: "Ice Cream" },
        { id: "pastries", name: "Pastries" },
      ],
    },
    {
      id: "drinks",
      name: "Drinks",
      subcategories: [
        { id: "coffee", name: "Coffee" },
        { id: "smoothies", name: "Smoothies" },
        { id: "cocktails", name: "Cocktails" },
      ],
    },
  ],
  cartItemCount = 0,
  onCartClick = () => {},
  onCategoryClick = () => {},
  onSearchSubmit = () => {},
}: HeaderProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchTerm);
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Mobile Menu Button (visible on small screens) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Logo */}
        <div className="flex items-center">
          <a
            href="/"
            className="text-2xl font-bold text-orange-500 flex items-center"
          >
            {typeof logo === "string" ? (
              logo
            ) : (
              <img src={logo} alt="Dishly" className="h-10" />
            )}
          </a>
        </div>

        {/* Navigation (hidden on mobile) */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {categories.map((category) => (
              <NavigationMenuItem key={category.id}>
                {category.subcategories ? (
                  <>
                    <NavigationMenuTrigger
                      onClick={() => onCategoryClick(category.id)}
                    >
                      {category.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {category.subcategories.map((subcategory) => (
                          <li key={subcategory.id}>
                            <NavigationMenuLink asChild>
                              <a
                                href={`#${subcategory.id}`}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                )}
                                onClick={() => onCategoryClick(subcategory.id)}
                              >
                                <div className="text-sm font-medium leading-none">
                                  {subcategory.name}
                                </div>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <a
                      href={`#${category.id}`}
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      )}
                      onClick={() => onCategoryClick(category.id)}
                    >
                      {category.name}
                    </a>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search and Cart */}
        <div className="flex items-center gap-4">
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden md:block"
          >
            <Input
              type="search"
              placeholder="Search dishes..."
              className="w-[200px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onCartClick}
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
