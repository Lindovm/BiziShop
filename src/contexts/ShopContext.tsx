import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  Category, 
  InventoryItem, 
  Order, 
  ShopSettings,
  Notification
} from '../types/models';
import { 
  firestoreDB, 
  menuDB, 
  inventoryDB, 
  orderDB 
} from '../lib/firebase-db';
import { useAuth } from './AuthContext';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

interface ShopContextType {
  // Products and categories
  products: Product[];
  categories: Category[];
  loadingProducts: boolean;
  loadingCategories: boolean;
  
  // Inventory
  inventoryItems: InventoryItem[];
  loadingInventory: boolean;
  
  // Orders
  activeOrders: Order[];
  completedOrders: Order[];
  loadingOrders: boolean;
  
  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;
  loadingNotifications: boolean;
  
  // Shop settings
  shopSettings: ShopSettings | null;
  loadingSettings: boolean;
  
  // Functions
  refreshProducts: () => Promise<void>;
  refreshInventory: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  updateShopSettings: (settings: Partial<ShopSettings>) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

interface ShopProviderProps {
  children: ReactNode;
}

export const ShopProvider: React.FC<ShopProviderProps> = ({ children }) => {
  const { currentUser, userRole } = useAuth();
  
  // State for products and categories
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // State for inventory
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(true);
  
  // State for orders
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  // State for notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  
  // State for shop settings
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Calculate unread notifications count
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Load products and categories
  useEffect(() => {
    if (!currentUser) return;
    
    const loadProductsAndCategories = async () => {
      try {
        setLoadingProducts(true);
        setLoadingCategories(true);
        
        // Set up real-time listener for products
        const productsQuery = query(
          collection(firestore, 'products'),
          where('isAvailable', '==', true),
          orderBy('name')
        );
        
        const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
          const productsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[];
          
          setProducts(productsData);
          setLoadingProducts(false);
        });
        
        // Set up real-time listener for categories
        const categoriesQuery = query(
          collection(firestore, 'categories'),
          orderBy('order')
        );
        
        const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
          const categoriesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Category[];
          
          setCategories(categoriesData);
          setLoadingCategories(false);
        });
        
        return () => {
          unsubscribeProducts();
          unsubscribeCategories();
        };
      } catch (error) {
        console.error('Error loading products and categories:', error);
        setLoadingProducts(false);
        setLoadingCategories(false);
      }
    };
    
    const cleanup = loadProductsAndCategories();
    return () => {
      if (cleanup) cleanup();
    };
  }, [currentUser]);

  // Load inventory items
  useEffect(() => {
    if (!currentUser || (userRole !== 'manager' && userRole !== 'owner')) return;
    
    const loadInventory = async () => {
      try {
        setLoadingInventory(true);
        
        // Set up real-time listener for inventory
        const inventoryQuery = query(
          collection(firestore, 'inventory'),
          orderBy('productId')
        );
        
        const unsubscribe = onSnapshot(inventoryQuery, (snapshot) => {
          const inventoryData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as InventoryItem[];
          
          setInventoryItems(inventoryData);
          setLoadingInventory(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error loading inventory:', error);
        setLoadingInventory(false);
      }
    };
    
    const unsubscribe = loadInventory();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser, userRole]);

  // Load orders
  useEffect(() => {
    if (!currentUser) return;
    
    const loadOrders = async () => {
      try {
        setLoadingOrders(true);
        
        // Set up real-time listener for active orders
        const activeOrdersQuery = query(
          collection(firestore, 'orders'),
          where('status', 'in', ['pending', 'preparing', 'ready']),
          orderBy('createdAt', 'desc')
        );
        
        const unsubscribeActive = onSnapshot(activeOrdersQuery, (snapshot) => {
          const activeOrdersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Order[];
          
          setActiveOrders(activeOrdersData);
        });
        
        // Set up real-time listener for completed orders (last 50)
        const completedOrdersQuery = query(
          collection(firestore, 'orders'),
          where('status', 'in', ['completed', 'cancelled']),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        
        const unsubscribeCompleted = onSnapshot(completedOrdersQuery, (snapshot) => {
          const completedOrdersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Order[];
          
          setCompletedOrders(completedOrdersData);
          setLoadingOrders(false);
        });
        
        return () => {
          unsubscribeActive();
          unsubscribeCompleted();
        };
      } catch (error) {
        console.error('Error loading orders:', error);
        setLoadingOrders(false);
      }
    };
    
    const cleanup = loadOrders();
    return () => {
      if (cleanup) cleanup();
    };
  }, [currentUser]);

  // Load notifications
  useEffect(() => {
    if (!currentUser) return;
    
    const loadNotifications = async () => {
      try {
        setLoadingNotifications(true);
        
        // Set up real-time listener for notifications
        const notificationsQuery = query(
          collection(firestore, 'notifications'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        
        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
          const notificationsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Notification[];
          
          setNotifications(notificationsData);
          setLoadingNotifications(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error loading notifications:', error);
        setLoadingNotifications(false);
      }
    };
    
    const unsubscribe = loadNotifications();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  // Load shop settings
  useEffect(() => {
    if (!currentUser) return;
    
    const loadShopSettings = async () => {
      try {
        setLoadingSettings(true);
        
        // Set up real-time listener for shop settings
        const settingsQuery = query(
          collection(firestore, 'settings'),
          limit(1)
        );
        
        const unsubscribe = onSnapshot(settingsQuery, (snapshot) => {
          if (!snapshot.empty) {
            const settingsData = {
              id: snapshot.docs[0].id,
              ...snapshot.docs[0].data()
            } as ShopSettings;
            
            setShopSettings(settingsData);
          } else {
            // Create default settings if none exist
            const defaultSettings: ShopSettings = {
              id: 'default',
              name: 'BiziShop',
              currency: 'USD',
              taxRate: 0.08
            };
            
            firestoreDB.setDocument('settings', 'default', defaultSettings);
            setShopSettings(defaultSettings);
          }
          
          setLoadingSettings(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error loading shop settings:', error);
        setLoadingSettings(false);
      }
    };
    
    const unsubscribe = loadShopSettings();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  // Function to refresh products
  const refreshProducts = async () => {
    try {
      setLoadingProducts(true);
      const productsData = await menuDB.getAllMenuItems();
      setProducts(productsData as Product[]);
    } catch (error) {
      console.error('Error refreshing products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Function to refresh inventory
  const refreshInventory = async () => {
    try {
      setLoadingInventory(true);
      const inventoryData = await inventoryDB.getAllInventoryItems();
      setInventoryItems(inventoryData as InventoryItem[]);
    } catch (error) {
      console.error('Error refreshing inventory:', error);
    } finally {
      setLoadingInventory(false);
    }
  };

  // Function to refresh orders
  const refreshOrders = async () => {
    try {
      setLoadingOrders(true);
      const ordersData = await orderDB.getAllOrders();
      
      const active = ordersData.filter(order => 
        ['pending', 'preparing', 'ready'].includes(order.status)
      ) as Order[];
      
      const completed = ordersData.filter(order => 
        ['completed', 'cancelled'].includes(order.status)
      ) as Order[];
      
      setActiveOrders(active);
      setCompletedOrders(completed);
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Function to refresh notifications
  const refreshNotifications = async () => {
    if (!currentUser) return;
    
    try {
      setLoadingNotifications(true);
      const notificationsQuery = query(
        collection(firestore, 'notifications'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const snapshot = await firestoreDB.getCollection('notifications');
      const notificationsData = snapshot.filter(
        notification => notification.userId === currentUser.uid
      ) as Notification[];
      
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Function to mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await firestoreDB.updateDocument('notifications', notificationId, {
        isRead: true
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Function to update shop settings
  const updateShopSettings = async (settings: Partial<ShopSettings>) => {
    if (!shopSettings) return;
    
    try {
      setLoadingSettings(true);
      const updatedSettings = {
        ...shopSettings,
        ...settings,
        updatedAt: new Date().toISOString()
      };
      
      await firestoreDB.setDocument('settings', shopSettings.id, updatedSettings);
      setShopSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating shop settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const value = {
    // Products and categories
    products,
    categories,
    loadingProducts,
    loadingCategories,
    
    // Inventory
    inventoryItems,
    loadingInventory,
    
    // Orders
    activeOrders,
    completedOrders,
    loadingOrders,
    
    // Notifications
    notifications,
    unreadNotificationsCount,
    loadingNotifications,
    
    // Shop settings
    shopSettings,
    loadingSettings,
    
    // Functions
    refreshProducts,
    refreshInventory,
    refreshOrders,
    refreshNotifications,
    markNotificationAsRead,
    updateShopSettings
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
