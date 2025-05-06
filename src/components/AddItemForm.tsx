import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../contexts/AuthContext";
import { menuDB } from "../lib/firebase-db";
import { uploadImage } from "../lib/storage-utils";
import { Image as ImageIcon } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../lib/firebase";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  price: z.string().min(1, { message: "Price is required" }), // Changed to string to avoid parsing issues
  isAvailable: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface AddItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { userRestaurant } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      isAvailable: true,
    },
  });

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    console.log("Form data submitted:", data);

    if (!userRestaurant?.id) {
      alert("No restaurant found. Please set up your restaurant first.");
      return;
    }

    console.log("Restaurant ID:", userRestaurant.id);

    try {
      setIsSubmitting(true);

      // Create a new item ID
      const itemId = Date.now().toString();
      console.log("Generated item ID:", itemId);

      // Upload image if one was selected
      let imageUrl = "";
      if (imageFile) {
        try {
          console.log("Uploading image...");
          // Upload to Firebase Storage
          imageUrl = await uploadImage(imageFile, `products/${userRestaurant.id}`);
          console.log("Image uploaded successfully:", imageUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Please try again.");
          setIsSubmitting(false);
          return;
        }
      } else {
        console.log("No image to upload");
      }

      // Convert price to number for storage
      const numericPrice = parseFloat(data.price);
      if (isNaN(numericPrice)) {
        console.error("Invalid price format:", data.price);
        alert("Please enter a valid price (e.g., 9.99)");
        setIsSubmitting(false);
        return;
      }

      // Prepare the item data
      // Ensure restaurant_id is in the correct format
      const restaurantId = userRestaurant.id;
      console.log(`Using restaurant ID for new item: ${restaurantId}`);

      const itemData = {
        name: data.name,
        description: data.description,
        price: numericPrice,
        isAvailable: data.isAvailable,
        category: "uncategorized", // Add a default category
        imageUrl,
        // Store restaurant_id in the format that matches what we see in Firebase
        restaurant_id: restaurantId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Prepared item data:", itemData);

      // Save to Firebase directly using Firestore API
      try {
        console.log("Saving to Firestore...");
        const docRef = doc(firestore, 'products', itemId);
        await setDoc(docRef, itemData);
        console.log("Item saved successfully with ID:", itemId);

        // Show success message
        alert("Menu item added successfully!");

        // Reset the form and image state
        form.reset();
        setImageFile(null);
        setImagePreview(null);
        setUploadProgress(0);

        // Close the dialog
        onOpenChange(false);

        // Call the success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } catch (saveError) {
        console.error("Error saving with direct Firestore API:", saveError);

        // Check for permission errors
        const errorMessage = saveError instanceof Error ? saveError.message : String(saveError);
        if (errorMessage.includes("permission") || errorMessage.includes("unauthorized")) {
          alert("Permission denied. You don't have access to add menu items. Please contact your administrator.");
        } else if (saveError instanceof Error) {
          alert(`Failed to save item: ${saveError.message}`);
        } else {
          alert("Failed to save item. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      // Show more detailed error message
      if (error instanceof Error) {
        alert(`Failed to add menu item: ${error.message}`);
      } else {
        alert("Failed to add menu item. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new item to your menu.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Chicken Burger" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price Field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price*</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="9.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Delicious chicken burger with lettuce, tomato, and special sauce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

              {/* Availability Field */}
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Available</FormLabel>
                      <FormDescription>
                        Make this item available on the menu
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <FormLabel>Item Image</FormLabel>
              <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md border-gray-300 hover:border-gray-400 transition-colors">
                {imagePreview ? (
                  <div className="relative w-full max-w-xs">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <ImageIcon className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Drag and drop an image, or click to browse
                    </p>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Select Image
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemForm;
