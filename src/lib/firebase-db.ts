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
      const collectionRef = collection(firestore, collectionName);
      const querySnapshot = await getDocs(collectionRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
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
    return firestoreDB.setDocument('menu', itemId, {
      ...itemData,
      updatedAt: new Date().toISOString()
    });
  },

  // Get all menu items
  getAllMenuItems: async (): Promise<DocumentData[]> => {
    return firestoreDB.getCollection('menu');
  },

  // Get menu items by category
  getMenuItemsByCategory: async (category: string): Promise<DocumentData[]> => {
    return firestoreDB.queryCollection('menu', 'category', '==', category);
  },

  // Delete menu item
  deleteMenuItem: async (itemId: string): Promise<void> => {
    return firestoreDB.deleteDocument('menu', itemId);
  }
};
