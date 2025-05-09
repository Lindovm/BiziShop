import { firestoreDB } from './firebase-db';
import { createTestCategories } from './create-test-categories';
import { Category } from '../types/models';

/**
 * Ensures categories exist in the database and returns them
 * This function will create categories if none exist
 */
export const ensureCategories = async (): Promise<Category[]> => {
  try {
    // First, check if categories already exist in Firestore
    const existingCategories = await firestoreDB.getCollection('categories');
    
    if (existingCategories.length > 0) {
      console.log(`Found ${existingCategories.length} existing categories`);
      return existingCategories as Category[];
    }
    
    // If no categories exist, create them
    console.log('No categories found, creating them...');
    const newCategories = await createTestCategories();
    return newCategories as Category[];
  } catch (error) {
    console.error('Error ensuring categories exist:', error);
    return [];
  }
};

/**
 * Gets all categories from Firestore
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const categories = await firestoreDB.getCollection('categories');
    return categories as Category[];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

/**
 * Adds a new category to Firestore
 */
export const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  try {
    // Generate a unique ID for the category
    const id = Date.now().toString();
    
    // Create the category object
    const newCategory: Category = {
      id,
      ...category
    };
    
    // Save to Firestore
    await firestoreDB.setDocument('categories', id, newCategory);
    
    return id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

/**
 * Updates an existing category in Firestore
 */
export const updateCategory = async (id: string, data: Partial<Category>): Promise<void> => {
  try {
    await firestoreDB.updateDocument('categories', id, data);
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a category from Firestore
 */
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await firestoreDB.deleteDocument('categories', id);
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
};
