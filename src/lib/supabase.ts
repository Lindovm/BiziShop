import { createClient } from "@supabase/supabase-js";

// Check if Supabase credentials are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// User roles
export type UserRole = "cashier" | "manager" | "owner";

// Role-based access control
export const roleAccess = {
  cashier: [
    "/orders",
    "/menu",
    "/messages",
    "/settings",
    "/add-items",
    "/payment-method",
    "/order-confirmation",
    "/notifications",
  ],
  manager: [
    "/dashboard",
    "/orders",
    "/menu",
    "/inventory",
    "/messages",
    "/settings",
    "/add-items",
    "/payment-method",
    "/order-confirmation",
    "/notifications",
  ],
  owner: [
    "/dashboard",
    "/orders",
    "/menu",
    "/analytics",
    "/inventory",
    "/messages",
    "/settings",
    "/add-items",
    "/payment-method",
    "/order-confirmation",
    "/notifications",
  ],
};

// Helper function to check if a user has access to a specific route
export const hasAccess = (role: UserRole, path: string): boolean => {
  // Always allow access to authentication screen and root path
  if (path === "/auth" || path === "/") return true;

  // Check if the role has access to the path
  return roleAccess[role]?.includes(path) || false;
};

// Create a mock client if credentials are not available
let supabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Mock implementation that doesn't throw errors
  supabaseClient = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
      upsert: () => ({ data: null, error: null }),
    }),
    auth: {
      signUp: (data: any) => {
        console.log("Mock sign up", data);
        return Promise.resolve({
          data: {
            user: {
              id: "mock-user-id",
              email: data.email,
              user_metadata: data.options?.data,
            },
          },
          error: null,
        });
      },
      signIn: (data: any) => {
        console.log("Mock sign in", data);
        return Promise.resolve({
          data: {
            user: {
              id: "mock-user-id",
              email: data.email,
              user_metadata: data.options?.data,
            },
          },
          error: null,
        });
      },
      signInWithPassword: (data: any) => {
        console.log("Mock sign in with password", data);
        // For demo purposes, we'll simulate a successful login
        const role = localStorage.getItem("userRole") || "cashier";
        return Promise.resolve({
          data: {
            user: {
              id: "mock-user-id",
              email: data.email,
              user_metadata: { role },
            },
          },
          error: null,
        });
      },
      signOut: () => {
        // Clear all auth-related data from localStorage
        localStorage.removeItem("userRole");
        localStorage.removeItem("supabase.auth.token");

        // Clear any session storage items that might be related to auth
        sessionStorage.clear();

        return Promise.resolve({ error: null });
      },
      onAuthStateChange: (callback: any) => {
        // Simulate an auth state change event
        const role = localStorage.getItem("userRole");
        if (role) {
          callback("SIGNED_IN", {
            user: {
              id: "mock-user-id",
              email: `demo-${role}@example.com`,
              user_metadata: { role },
            },
          });
        }
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      getUser: () => {
        const role = localStorage.getItem("userRole");
        if (role) {
          return Promise.resolve({
            data: {
              user: {
                id: "mock-user-id",
                email: `demo-${role}@example.com`,
                user_metadata: { role },
              },
            },
            error: null,
          });
        }
        return Promise.resolve({ data: { user: null }, error: null });
      },
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        download: () => Promise.resolve({ data: null, error: null }),
        remove: () => Promise.resolve({ data: null, error: null }),
        list: () => Promise.resolve({ data: [], error: null }),
      }),
    },
  };
  console.warn("Supabase credentials not found. Using mock implementation.");
}

export const supabase = supabaseClient;

// Helper function to get the current user's role
export const getUserRole = async (): Promise<UserRole> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;

    const role =
      data.user?.user_metadata?.role || localStorage.getItem("userRole");
    return (role as UserRole) || "cashier";
  } catch (error) {
    console.error("Error getting user role:", error);
    return (localStorage.getItem("userRole") as UserRole) || "cashier";
  }
};
