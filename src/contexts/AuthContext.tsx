import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User as FirebaseUser } from "firebase/auth";
import { firebaseAuth, getUserRole, UserRole } from "../lib/firebase";
import { userDB, shopDB } from "../lib/firebase-db";
import { User, Restaurant } from "../types/models";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  userRole: UserRole | null;
  userRestaurant: Restaurant | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role?: UserRole,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  refreshUserRestaurant: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userRestaurant, setUserRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch restaurant data based on user profile
  const fetchUserRestaurant = async (profile: User) => {
    try {
      // Check for restaurant_id in different possible formats
      const restaurantId =
        profile.restaurant_id || profile.restaurantId || profile.restaurants_id;

      console.log("Fetching restaurant with ID:", restaurantId || "fallback restaurant");
      const restaurant = await shopDB.getRestaurantByReference(restaurantId);
      console.log("Fetched restaurant:", restaurant);

      if (restaurant) {
        setUserRestaurant(restaurant as Restaurant);

        // If we got a restaurant but the user doesn't have a restaurant_id, update their profile
        if (!restaurantId && profile && restaurant.id) {
          console.log("Updating user profile with restaurant ID:", restaurant.id);
          try {
            const updatedProfile = {
              ...profile,
              restaurant_id: `restaurants/${restaurant.id}`,
              restaurantId: `restaurants/${restaurant.id}`,
              restaurants_id: `/restaurants/${restaurant.id}`,
              updatedAt: new Date().toISOString(),
            };

            await userDB.setUserProfile(profile.id, updatedProfile);
            setUserProfile(updatedProfile as User);
            console.log("User profile updated with restaurant ID");
          } catch (updateError) {
            console.error("Error updating user profile with restaurant ID:", updateError);
          }
        }
      } else {
        console.log("No restaurant found with the given reference, trying to get any restaurant");

        // Try to get any restaurant as a fallback
        try {
          const restaurants = await shopDB.getAllRestaurants();
          if (restaurants && restaurants.length > 0) {
            const firstRestaurant = restaurants[0];
            console.log("Using first restaurant as fallback:", firstRestaurant);
            setUserRestaurant(firstRestaurant as Restaurant);

            // Update user profile with this restaurant
            const updatedProfile = {
              ...profile,
              restaurant_id: `restaurants/${firstRestaurant.id}`,
              restaurantId: `restaurants/${firstRestaurant.id}`,
              restaurants_id: `/restaurants/${firstRestaurant.id}`,
              updatedAt: new Date().toISOString(),
            };

            await userDB.setUserProfile(profile.id, updatedProfile);
            setUserProfile(updatedProfile as User);
            console.log("User profile updated with fallback restaurant ID");
          } else {
            console.log("No restaurants found in database");
            setUserRestaurant(null);
          }
        } catch (fallbackError) {
          console.error("Error getting fallback restaurant:", fallbackError);
          setUserRestaurant(null);
        }
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);

      // Try to get any restaurant as a fallback after error
      try {
        console.log("Trying to get any restaurant as fallback after error");
        const restaurants = await shopDB.getAllRestaurants();
        if (restaurants && restaurants.length > 0) {
          const firstRestaurant = restaurants[0];
          console.log("Using first restaurant as fallback after error:", firstRestaurant);
          setUserRestaurant(firstRestaurant as Restaurant);

          // Update user profile with this restaurant
          const updatedProfile = {
            ...profile,
            restaurant_id: `restaurants/${firstRestaurant.id}`,
            restaurantId: `restaurants/${firstRestaurant.id}`,
            restaurants_id: `/restaurants/${firstRestaurant.id}`,
            updatedAt: new Date().toISOString(),
          };

          await userDB.setUserProfile(profile.id, updatedProfile);
          setUserProfile(updatedProfile as User);
          console.log("User profile updated with fallback restaurant ID after error");
        } else {
          setUserRestaurant(null);
        }
      } catch (fallbackError) {
        console.error("Error getting fallback restaurant after error:", fallbackError);
        setUserRestaurant(null);
      }
    }
  };

  // Function to refresh user restaurant data
  const refreshUserRestaurant = async () => {
    if (userProfile) {
      await fetchUserRestaurant(userProfile);
    }
  };

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Get user profile from Firestore
          const profile = await userDB.getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile as User);
            setUserRole(profile.role as UserRole);

            // Fetch associated restaurant
            await fetchUserRestaurant(profile as User);
          } else {
            // If no profile exists, create a basic one
            const role = await getUserRole();
            const newProfile = {
              id: user.uid,
              name: user.displayName || "User",
              email: user.email || "",
              role: role,
              createdAt: new Date().toISOString(),
            };
            await userDB.setUserProfile(user.uid, newProfile);
            setUserProfile(newProfile as User);
            setUserRole(role);
            setUserRestaurant(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          const role = await getUserRole();
          setUserRole(role);
          setUserRestaurant(null);
        }
      } else {
        setUserProfile(null);
        setUserRole(null);
        setUserRestaurant(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(
        email,
        password,
      );

      // Immediately fetch the user profile to ensure we have the role
      if (userCredential.user) {
        try {
          const profile = await userDB.getUserProfile(userCredential.user.uid);
          if (profile) {
            setUserProfile(profile as User);
            setUserRole(profile.role as UserRole);
          }
        } catch (profileError) {
          console.error(
            "Error fetching user profile after sign-in:",
            profileError,
          );
        }
      }

      return userCredential;
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error; // Re-throw to be caught by the component
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole = "cashier",
  ) => {
    try {
      setIsLoading(true);
      const { user } = await firebaseAuth.signUp({
        email,
        password,
        metadata: { role },
      });

      if (user) {
        // Create user profile in Firestore
        const newProfile = {
          id: user.uid,
          name,
          email,
          role,
          createdAt: new Date().toISOString(),
        };

        await userDB.setUserProfile(user.uid, newProfile);

        // Set the user role in state immediately
        setUserRole(role);
        setUserProfile(newProfile as User);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await firebaseAuth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser || !userProfile) {
      throw new Error("No authenticated user");
    }

    try {
      setIsLoading(true);
      const updatedProfile = {
        ...userProfile,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await userDB.setUserProfile(currentUser.uid, updatedProfile);
      setUserProfile(updatedProfile);

      // Update role in state if it was changed
      if (data.role && data.role !== userRole) {
        setUserRole(data.role);
      }

      // If restaurant_id was updated, fetch the new restaurant
      if (data.restaurant_id || data.restaurantId || data.restaurants_id) {
        await fetchUserRestaurant(updatedProfile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    userRole,
    userRestaurant,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    refreshUserRestaurant,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
