import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData
} from 'firebase/firestore';
import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  child,
  query as dbQuery,
  orderByChild,
  limitToLast
} from 'firebase/database';
import { firestore, database } from './firebase';
import { UserRole } from './firebase';

// Firestore Operations
export const firestoreDB = {
  // Create or update a document
  setDocument: async (collectionName: string, docId: string, data: any): Promise<void> => {
    try {
      const docRef = doc(firestore, collectionName, docId);
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error(`Error setting document in ${collectionName}:`, error);
      throw error;
    }
  },

  // Get a document by ID
  getDocument: async (collectionName: string, docId: string): Promise<DocumentData | null> => {
    try {
      const docRef = doc(firestore, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  },

  // Get all documents from a collection
  getCollection: async (collectionName: string): Promise<DocumentData[]> => {
    try {
      console.log(`Attempting to get collection: ${collectionName}`);
      const collectionRef = collection(firestore, collectionName);
      const querySnapshot = await getDocs(collectionRef);

      console.log(`Collection ${collectionName} query returned ${querySnapshot.docs.length} documents`);

      // Log each document ID for debugging
      querySnapshot.docs.forEach(doc => {
        console.log(`Document ID in ${collectionName}: ${doc.id}`);
      });

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`Document data for ${doc.id}:`, data);
        return {
          id: doc.id,
          ...data
        };
      });
    } catch (error) {
      console.error(`Error getting collection ${collectionName}:`, error);
      throw error;
    }
  },

  // Query documents in a collection
  queryCollection: async (
    collectionName: string,
    fieldPath: string,
    operator: any,
    value: any
  ): Promise<DocumentData[]> => {
    try {
      const collectionRef = collection(firestore, collectionName);
      const q = query(collectionRef, where(fieldPath, operator, value));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error querying collection ${collectionName}:`, error);
      throw error;
    }
  },

  // Update a document
  updateDocument: async (collectionName: string, docId: string, data: any): Promise<void> => {
    try {
      const docRef = doc(firestore, collectionName, docId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  },

  // Delete a document
  deleteDocument: async (collectionName: string, docId: string): Promise<void> => {
    try {
      const docRef = doc(firestore, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }
};

// Realtime Database Operations
export const realtimeDB = {
  // Create or update data
  setData: async (path: string, data: any): Promise<void> => {
    try {
      const dbRef = ref(database, path);
      await set(dbRef, data);
    } catch (error) {
      console.error(`Error setting data at ${path}:`, error);
      throw error;
    }
  },

  // Get data
  getData: async (path: string): Promise<any> => {
    try {
      const dbRef = ref(database, path);
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting data from ${path}:`, error);
      throw error;
    }
  },

  // Update data
  updateData: async (path: string, data: any): Promise<void> => {
    try {
      const dbRef = ref(database, path);
      await update(dbRef, data);
    } catch (error) {
      console.error(`Error updating data at ${path}:`, error);
      throw error;
    }
  },

  // Delete data
  deleteData: async (path: string): Promise<void> => {
    try {
      const dbRef = ref(database, path);
      await remove(dbRef);
    } catch (error) {
      console.error(`Error deleting data at ${path}:`, error);
      throw error;
    }
  },

  // Push new data with auto-generated key
  pushData: async (path: string, data: any): Promise<string> => {
    try {
      const dbRef = ref(database, path);
      const newRef = push(dbRef);
      await set(newRef, data);
      return newRef.key || '';
    } catch (error) {
      console.error(`Error pushing data to ${path}:`, error);
      throw error;
    }
  }
};

// User-related database operations
export const userDB = {
  // Create or update a user profile in Firestore
  setUserProfile: async (userId: string, userData: any): Promise<void> => {
    return firestoreDB.setDocument('users', userId, userData);
  },

  // Get a user profile from Firestore
  getUserProfile: async (userId: string): Promise<DocumentData | null> => {
    return firestoreDB.getDocument('users', userId);
  },

  // Set user role in Firestore
  setUserRole: async (userId: string, role: UserRole): Promise<void> => {
    return firestoreDB.updateDocument('users', userId, { role });
  },

  // Get user role from Firestore
  getUserRole: async (userId: string): Promise<UserRole | null> => {
    const userData = await firestoreDB.getDocument('users', userId);
    return userData?.role || null;
  }
};

// Order-related database operations
export const orderDB = {
  // Create a new order
  createOrder: async (orderData: any): Promise<string> => {
    try {
      // Add to Realtime Database for real-time updates
      const orderId = await realtimeDB.pushData('orders', {
        ...orderData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });

      // Also store in Firestore for better querying
      await firestoreDB.setDocument('orders', orderId, {
        ...orderData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });

      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string): Promise<void> => {
    try {
      // Update in both databases
      await realtimeDB.updateData(`orders/${orderId}`, { status, updatedAt: new Date().toISOString() });
      await firestoreDB.updateDocument('orders', orderId, { status, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error(`Error updating order status for ${orderId}:`, error);
      throw error;
    }
  },

  // Get all orders
  getAllOrders: async (): Promise<DocumentData[]> => {
    return firestoreDB.getCollection('orders');
  },

  // Get orders by status
  getOrdersByStatus: async (status: string): Promise<DocumentData[]> => {
    return firestoreDB.queryCollection('orders', 'status', '==', status);
  }
};

// Inventory-related database operations
export const inventoryDB = {
  // Add or update inventory item
  setInventoryItem: async (itemId: string, itemData: any): Promise<void> => {
    return firestoreDB.setDocument('inventory', itemId, {
      ...itemData,
      updatedAt: new Date().toISOString()
    });
  },

  // Get all inventory items
  getAllInventoryItems: async (): Promise<DocumentData[]> => {
    return firestoreDB.getCollection('inventory');
  },

  // Get inventory items by category
  getInventoryItemsByCategory: async (category: string): Promise<DocumentData[]> => {
    return firestoreDB.queryCollection('inventory', 'category', '==', category);
  },

  // Update inventory item stock
  updateItemStock: async (itemId: string, newStock: number): Promise<void> => {
    return firestoreDB.updateDocument('inventory', itemId, {
      currentStock: newStock,
      updatedAt: new Date().toISOString()
    });
  }
};

// Menu-related database operations
export const menuDB = {
  // Add or update menu item
  setMenuItem: async (itemId: string, itemData: any): Promise<void> => {
    return firestoreDB.setDocument('products', itemId, {
      ...itemData,
      updatedAt: new Date().toISOString()
    });
  },

  // Get all menu items
  getAllMenuItems: async (): Promise<DocumentData[]> => {
    return firestoreDB.getCollection('products');
  },

  // Get menu items by restaurant
  getMenuItemsByRestaurant: async (restaurantId: string): Promise<DocumentData[]> => {
    return firestoreDB.queryCollection('products', 'restaurant_id', '==', restaurantId);
  },

  // Get menu items by category
  getMenuItemsByCategory: async (category: string): Promise<DocumentData[]> => {
    return firestoreDB.queryCollection('products', 'category', '==', category);
  },

  // Get menu items by restaurant and category
  getMenuItemsByRestaurantAndCategory: async (restaurantId: string, category: string): Promise<DocumentData[]> => {
    try {
      const collectionRef = collection(firestore, 'products');
      const q = query(
        collectionRef,
        where('restaurant_id', '==', restaurantId),
        where('category', '==', category)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting products for restaurant ${restaurantId} and category ${category}:`, error);
      return [];
    }
  },

  // Delete menu item
  deleteMenuItem: async (itemId: string): Promise<void> => {
    return firestoreDB.deleteDocument('products', itemId);
  }
};

// Shop-related database operations
export const shopDB = {
  // Add or update shop
  setShop: async (shopId: string, shopData: any): Promise<void> => {
    return firestoreDB.setDocument('restaurants', shopId, {
      ...shopData,
      updatedAt: new Date().toISOString()
    });
  },

  // Get all restaurants directly from the restaurants collection
  getAllRestaurants: async (): Promise<DocumentData[]> => {
    console.log("Getting all restaurants directly from restaurants collection");
    try {
      const restaurants = await firestoreDB.getCollection('restaurants');
      console.log(`Found ${restaurants.length} restaurants in collection`);
      return restaurants;
    } catch (error) {
      console.error("Error fetching restaurants collection:", error);
      return [];
    }
  },

  // Get all shops
  getAllShops: async (): Promise<DocumentData[]> => {
    const results: DocumentData[] = [];

    // First try to get from 'restaurants' collection (as seen in your Firestore)
    try {
      console.log("Fetching shops from 'restaurants' collection");

      // Try to get the specific restaurant we saw in Firebase
      try {
        console.log("Trying to get specific restaurant: 2N5qPT2UasAPyjTpDSUY");
        const specificRestaurant = await firestoreDB.getDocument('restaurants', '2N5qPT2UasAPyjTpDSUY');
        if (specificRestaurant) {
          console.log("Found specific restaurant:", specificRestaurant);
          results.push(specificRestaurant);
        }
      } catch (specificError) {
        console.error("Error fetching specific restaurant:", specificError);
      }

      // Also try to get all restaurants from the collection
      const restaurants = await firestoreDB.getCollection('restaurants');
      if (restaurants && restaurants.length > 0) {
        console.log(`Found ${restaurants.length} restaurants from collection query`);

        // Only add restaurants that aren't already in our results
        for (const restaurant of restaurants) {
          if (!results.some(r => r.id === restaurant.id)) {
            results.push(restaurant);
          }
        }
      }

      if (results.length > 0) {
        console.log(`Returning ${results.length} total restaurants`);
        return results;
      }
    } catch (error) {
      console.error("Error fetching from restaurants collection:", error);
    }

    // Fallback to 'shops' collection if no restaurants found
    try {
      console.log("Fallback: Fetching from 'shops' collection");
      const shops = await firestoreDB.getCollection('shops');
      return [...results, ...shops];
    } catch (error) {
      console.error("Error fetching from shops collection:", error);
      return results;
    }
  },

  // Get shop by ID
  getShopById: async (shopId: string): Promise<DocumentData | null> => {
    // Try restaurants collection first
    try {
      const restaurant = await firestoreDB.getDocument('restaurants', shopId);
      if (restaurant) return restaurant;
    } catch (error) {
      console.error(`Error fetching restaurant with ID ${shopId}:`, error);
    }

    // Fallback to shops collection
    return firestoreDB.getDocument('shops', shopId);
  },

  // Get shops by owner ID
  getShopsByOwnerId: async (ownerId: string): Promise<DocumentData[]> => {
    // Try restaurants collection first
    try {
      const restaurants = await firestoreDB.queryCollection('restaurants', 'ownerId', '==', ownerId);
      if (restaurants && restaurants.length > 0) return restaurants;
    } catch (error) {
      console.error(`Error fetching restaurants for owner ${ownerId}:`, error);
    }

    // Fallback to shops collection
    return firestoreDB.queryCollection('shops', 'ownerId', '==', ownerId);
  },

  // Get restaurant by reference
  getRestaurantByReference: async (restaurantRef: any): Promise<DocumentData | null> => {
    try {
      console.log("getRestaurantByReference called with:", restaurantRef);

      // If restaurantRef is a string (document path), convert it to a reference
      if (typeof restaurantRef === 'string') {
        console.log("Restaurant reference is a string");

        // Remove leading slash if present
        const cleanRef = restaurantRef.startsWith('/') ? restaurantRef.substring(1) : restaurantRef;
        console.log("Cleaned reference:", cleanRef);

        // If it's a full path like 'restaurants/123'
        if (cleanRef.includes('/')) {
          console.log("Restaurant reference is a path with /");
          const parts = cleanRef.split('/');
          const collectionName = parts[0];
          const docId = parts[1];
          console.log(`Fetching from collection: ${collectionName}, docId: ${docId}`);

          // Try to get the document
          try {
            const result = await firestoreDB.getDocument(collectionName, docId);
            console.log("Result from path lookup:", result);
            return result;
          } catch (error) {
            console.error(`Error fetching from ${collectionName}/${docId}:`, error);

            // If the collection name is not 'restaurants', try with 'restaurants'
            if (collectionName !== 'restaurants') {
              console.log(`Trying fallback to restaurants collection with ID: ${docId}`);
              const fallbackResult = await firestoreDB.getDocument('restaurants', docId);
              console.log("Result from fallback lookup:", fallbackResult);
              return fallbackResult;
            }
          }
        }

        // If it's just an ID, assume it's in the restaurants collection
        console.log(`Fetching from restaurants collection with ID: ${cleanRef}`);
        const result = await firestoreDB.getDocument('restaurants', cleanRef);
        console.log("Result from ID lookup:", result);
        return result;
      }

      // If it's already a reference, get the document
      console.log("Restaurant reference is a document reference object");
      const docSnap = await getDoc(restaurantRef);
      if (docSnap.exists()) {
        const result = { id: docSnap.id, ...docSnap.data() };
        console.log("Result from reference lookup:", result);
        return result;
      }

      console.log("No document exists at the reference");
      return null;
    } catch (error) {
      console.error('Error fetching restaurant by reference:', error);
      return null;
    }
  }
};

// Message-related database operations
export const messageDB = {
  // Create a new chat
  createChat: async (chatData: any): Promise<string> => {
    try {
      // Generate a new ID
      const chatId = Date.now().toString();

      // Add timestamp
      const chatWithTimestamp = {
        ...chatData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        unreadCount: 0
      };

      // Store in Firestore
      await firestoreDB.setDocument('chats', chatId, chatWithTimestamp);

      return chatId;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },

  // Get all chats for a restaurant
  getChatsByRestaurantId: async (restaurantId: string): Promise<DocumentData[]> => {
    try {
      const collectionRef = collection(firestore, 'chats');
      const q = query(
        collectionRef,
        where('restaurantId', '==', restaurantId),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting chats for restaurant ${restaurantId}:`, error);
      return [];
    }
  },

  // Get a specific chat
  getChat: async (chatId: string): Promise<DocumentData | null> => {
    return firestoreDB.getDocument('chats', chatId);
  },

  // Update chat metadata
  updateChat: async (chatId: string, data: any): Promise<void> => {
    return firestoreDB.updateDocument('chats', chatId, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  },

  // Send a message
  sendMessage: async (messageData: any): Promise<string> => {
    try {
      // Generate a message ID
      const messageId = Date.now().toString();

      // Add timestamp
      const messageWithTimestamp = {
        ...messageData,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      // Store in Firestore
      await firestoreDB.setDocument('messages', messageId, messageWithTimestamp);

      // Update the chat's last message info
      await messageDB.updateChat(messageData.chatId, {
        lastMessage: messageData.text,
        lastMessageTimestamp: new Date().toISOString(),
        lastMessageSender: messageData.sender,
        unreadCount: messageData.sender === 'vendor' ? 0 : 1 // If sent by vendor, mark as read
      });

      return messageId;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get messages for a chat
  getMessagesByChatId: async (chatId: string): Promise<DocumentData[]> => {
    try {
      const collectionRef = collection(firestore, 'messages');
      const q = query(
        collectionRef,
        where('chatId', '==', chatId),
        orderBy('timestamp', 'asc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting messages for chat ${chatId}:`, error);
      return [];
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (chatId: string): Promise<void> => {
    try {
      // Get all unread messages in this chat
      const collectionRef = collection(firestore, 'messages');
      const q = query(
        collectionRef,
        where('chatId', '==', chatId),
        where('isRead', '==', false),
        where('sender', '!=', 'vendor') // Only mark non-vendor messages as read
      );
      const querySnapshot = await getDocs(q);

      // Update each message
      const updatePromises = querySnapshot.docs.map(docSnapshot => {
        const docRef = doc(firestore, 'messages', docSnapshot.id);
        return updateDoc(docRef, { isRead: true });
      });

      await Promise.all(updatePromises);

      // Reset unread count in chat
      await messageDB.updateChat(chatId, { unreadCount: 0 });
    } catch (error) {
      console.error(`Error marking messages as read for chat ${chatId}:`, error);
      throw error;
    }
  }
};