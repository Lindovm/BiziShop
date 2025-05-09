import { firestoreDB } from './firebase-db';

/**
 * Creates food categories in Firestore if they don't exist
 */
export const createTestCategories = async () => {
  try {
    // Check if categories already exist
    const existingCategories = await firestoreDB.getCollection('categories');

    if (existingCategories.length === 0) {
      console.log('No categories found, creating food categories...');

      // Create food categories
      const categories = [
        {
          id: 'appetizers',
          name: 'Appetizers',
          description: 'Starters and small plates',
          order: 1
        },
        {
          id: 'main_courses',
          name: 'Main Courses',
          description: 'Main dishes and entrees',
          order: 2
        },
        {
          id: 'burgers',
          name: 'Burgers',
          description: 'Gourmet burgers and sandwiches',
          order: 3
        },
        {
          id: 'pizzas',
          name: 'Pizzas',
          description: 'Traditional and specialty pizzas',
          order: 4
        },
        {
          id: 'pasta',
          name: 'Pasta',
          description: 'Italian pasta dishes',
          order: 5
        },
        {
          id: 'seafood',
          name: 'Seafood',
          description: 'Fresh seafood dishes',
          order: 6
        },
        {
          id: 'salads',
          name: 'Salads',
          description: 'Fresh and healthy salads',
          order: 7
        },
        {
          id: 'sides',
          name: 'Side Dishes',
          description: 'Complementary side dishes',
          order: 8
        },
        {
          id: 'desserts',
          name: 'Desserts',
          description: 'Sweet treats and desserts',
          order: 9
        },
        {
          id: 'beverages',
          name: 'Beverages',
          description: 'Drinks and refreshments',
          order: 10
        },
        {
          id: 'specials',
          name: 'Chef Specials',
          description: 'Special dishes of the day',
          order: 11
        }
      ];

      // Save each category to Firestore
      for (const category of categories) {
        await firestoreDB.setDocument('categories', category.id, category);
      }

      console.log('Food categories created successfully');
      return categories;
    } else {
      console.log(`Found ${existingCategories.length} existing categories`);
      return existingCategories;
    }
  } catch (error) {
    console.error('Error creating food categories:', error);
    return [];
  }
};
