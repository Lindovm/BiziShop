import { firestoreDB } from './firebase-db';
import { Category } from '../types/models';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { firestore } from './firebase';

/**
 * Adds specific food categories to Firestore and removes all other categories
 */
export const addFoodCategories = async (): Promise<Category[]> => {
  try {
    // First, get all existing categories
    const categoriesSnapshot = await getDocs(collection(firestore, 'categories'));

    // Delete all existing categories
    console.log(`Removing ${categoriesSnapshot.size} existing categories...`);
    const deletePromises = categoriesSnapshot.docs.map(doc =>
      deleteDoc(doc.ref)
    );
    await Promise.all(deletePromises);
    console.log('All existing categories removed');

    // Food categories to add
    const categories = [
      {
        id: 'fruits',
        name: 'Fruits',
        description: 'Fresh and dried fruits',
        order: 1
      },
      {
        id: 'vegetables',
        name: 'Vegetables',
        description: 'Fresh and preserved vegetables',
        order: 2
      },
      {
        id: 'grains_cereals',
        name: 'Grains & Cereals',
        description: 'Rice, wheat, oats, and other grains',
        order: 3
      },
      {
        id: 'meat_poultry',
        name: 'Meat & Poultry',
        description: 'Beef, chicken, pork, and other meats',
        order: 4
      },
      {
        id: 'seafood',
        name: 'Seafood',
        description: 'Fish, shellfish, and other seafood',
        order: 5
      },
      {
        id: 'dairy_products',
        name: 'Dairy Products',
        description: 'Milk, cheese, yogurt, and other dairy items',
        order: 6
      },
      {
        id: 'legumes_pulses',
        name: 'Legumes & Pulses',
        description: 'Beans, lentils, and other legumes',
        order: 7
      },
      {
        id: 'nuts_seeds',
        name: 'Nuts & Seeds',
        description: 'Almonds, walnuts, sunflower seeds, and more',
        order: 8
      },
      {
        id: 'breads_bakery',
        name: 'Breads & Bakery Items',
        description: 'Bread, pastries, and baked goods',
        order: 9
      },
      {
        id: 'beverages_non_alcoholic',
        name: 'Beverages (non-alcoholic)',
        description: 'Coffee, tea, juices, and soft drinks',
        order: 10
      },
      {
        id: 'alcoholic_drinks',
        name: 'Alcoholic Drinks',
        description: 'Beer, wine, spirits, and cocktails',
        order: 11
      },
      {
        id: 'fats_oils',
        name: 'Fats & Oils',
        description: 'Cooking oils, butter, and other fats',
        order: 12
      },
      {
        id: 'snacks_sweets',
        name: 'Snacks & Sweets',
        description: 'Chips, candies, chocolates, and desserts',
        order: 13
      },
      {
        id: 'spices_herbs',
        name: 'Spices & Herbs',
        description: 'Seasonings, herbs, and spices',
        order: 14
      },
      {
        id: 'condiments_sauces',
        name: 'Condiments & Sauces',
        description: 'Ketchup, mustard, mayonnaise, and other sauces',
        order: 15
      }
    ];

    // Save each category to Firestore using direct Firestore API
    for (const category of categories) {
      // Use direct Firestore API to ensure categories are added
      await setDoc(doc(firestore, 'categories', category.id), category);
      console.log(`Added category: ${category.name}`);
    }

    console.log('Food categories added successfully');
    return categories as Category[];
  } catch (error) {
    console.error('Error adding food categories:', error);
    return [];
  }
};
