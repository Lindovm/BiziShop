import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { firebaseAuth, getUserRole, UserRole } from '../lib/firebase';
import { userDB } from '../lib/firebase-db';
import { User } from '../types/models';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
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
  const [isLoading, setIsLoading] = useState(true);

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
          } else {
            // If no profile exists, create a basic one
            const role = await getUserRole();
            const newProfile = {
              id: user.uid,
              name: user.displayName || 'User',
              email: user.email || '',
              role: role,
              createdAt: new Date().toISOString()
            };
            await userDB.setUserProfile(user.uid, newProfile);
            setUserProfile(newProfile as User);
            setUserRole(role);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          const role = await getUserRole();
          setUserRole(role);
        }
      } else {
        setUserProfile(null);
        setUserRole(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);

      // Immediately fetch the user profile to ensure we have the role
      if (userCredential.user) {
        try {
          const profile = await userDB.getUserProfile(userCredential.user.uid);
          if (profile) {
            setUserProfile(profile as User);
            setUserRole(profile.role as UserRole);
          }
        } catch (profileError) {
          console.error("Error fetching user profile after sign-in:", profileError);
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

  const signUp = async (email: string, password: string, name: string, role: UserRole = 'cashier') => {
    try {
      setIsLoading(true);
      const { user } = await firebaseAuth.signUp({
        email,
        password,
        metadata: { role }
      });

      if (user) {
        // Create user profile in Firestore
        const newProfile = {
          id: user.uid,
          name,
          email,
          role,
          createdAt: new Date().toISOString()
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
      throw new Error('No authenticated user');
    }

    try {
      setIsLoading(true);
      const updatedProfile = {
        ...userProfile,
        ...data,
        updatedAt: new Date().toISOString()
      };

      await userDB.setUserProfile(currentUser.uid, updatedProfile);
      setUserProfile(updatedProfile);

      // Update role in state if it was changed
      if (data.role && data.role !== userRole) {
        setUserRole(data.role);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    userRole,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
