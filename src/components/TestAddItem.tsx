import React from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { Button } from './ui/button';

const TestAddItem = () => {
  const addTestItem = async () => {
    try {
      console.log("Starting test item creation...");
      
      // Create a simple test item
      const itemId = `test-${Date.now()}`;
      const testItem = {
        name: "Test Item",
        description: "This is a test item",
        price: 9.99,
        category: "uncategorized",
        isAvailable: true,
        restaurant_id: "2N5qPT2UasAPyjTpDSUY", // Use the known restaurant ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log("Test item data:", testItem);
      
      // Try to add it directly to Firestore
      const docRef = doc(firestore, 'products', itemId);
      await setDoc(docRef, testItem);
      
      console.log("Test item added successfully with ID:", itemId);
      alert("Test item added successfully!");
    } catch (error) {
      console.error("Error adding test item:", error);
      if (error instanceof Error) {
        alert(`Failed to add test item: ${error.message}`);
      } else {
        alert("Failed to add test item. Please try again.");
      }
    }
  };
  
  return (
    <div className="p-4">
      <Button onClick={addTestItem}>Add Test Item</Button>
    </div>
  );
};

export default TestAddItem;
