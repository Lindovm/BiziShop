import { Suspense, useEffect, useState } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./components/dashboard";
import Orders from "./components/orders";
import Menu from "./components/menu";
import Analytics from "./components/analytics";
import Messages from "./components/messages";
import Settings from "./components/settings";
import Inventory from "./components/inventory";
import NotificationsPage from "./components/NotificationsPage";
import AddItemsScreen from "./components/AddItemsScreen";
import PaymentMethodScreen from "./components/PaymentMethodScreen";
import OrderConfirmationScreen from "./components/OrderConfirmationScreen";
import AuthenticationScreen from "./components/AuthenticationScreen";
import { supabase, getUserRole, hasAccess, UserRole } from "./lib/supabase";
import routes from "tempo-routes";

function App() {
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const role = await getUserRole();
          setUserRole(role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const role = await getUserRole();
          setUserRole(role);
        } else if (event === "SIGNED_OUT") {
          setUserRole(null);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Protected route component
  const ProtectedRoute = ({
    element,
    path,
  }: {
    element: JSX.Element;
    path: string;
  }) => {
    // If still loading, show loading indicator
    if (isLoading) {
      return <p>Loading...</p>;
    }

    // If no user or role, redirect to auth
    if (!userRole) {
      return <Navigate to="/auth" replace />;
    }

    // Check if user has access to this route
    if (!hasAccess(userRole, path)) {
      // Redirect based on role
      if (userRole === "cashier") {
        return <Navigate to="/orders" replace />;
      } else if (userRole === "manager") {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }

    return element;
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div>
        <Routes>
          <Route path="/auth" element={<AuthenticationScreen />} />
          <Route
            path="/"
            element={
              <Navigate to={userRole ? "/dashboard" : "/auth"} replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute element={<Dashboard />} path="/dashboard" />
            }
          />
          <Route
            path="/orders"
            element={<ProtectedRoute element={<Orders />} path="/orders" />}
          />
          <Route
            path="/menu"
            element={<ProtectedRoute element={<Menu />} path="/menu" />}
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute element={<Analytics />} path="/analytics" />
            }
          />
          <Route
            path="/messages"
            element={<ProtectedRoute element={<Messages />} path="/messages" />}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute element={<Settings />} path="/settings" />}
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute element={<Inventory />} path="/inventory" />
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute
                element={<NotificationsPage />}
                path="/notifications"
              />
            }
          />
          <Route
            path="/add-items"
            element={
              <ProtectedRoute element={<AddItemsScreen />} path="/add-items" />
            }
          />
          <Route
            path="/payment-method"
            element={
              <ProtectedRoute
                element={<PaymentMethodScreen />}
                path="/payment-method"
              />
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute
                element={<OrderConfirmationScreen />}
                path="/order-confirmation"
              />
            }
          />
        </Routes>
        {tempoRoutes}
      </div>
    </Suspense>
  );
}

export default App;
