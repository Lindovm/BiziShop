import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
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
import routes from "tempo-routes";

function App() {
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/add-items" element={<AddItemsScreen />} />
          <Route path="/payment-method" element={<PaymentMethodScreen />} />
          <Route
            path="/order-confirmation"
            element={<OrderConfirmationScreen />}
          />
        </Routes>
        {tempoRoutes}
      </div>
    </Suspense>
  );
}

export default App;
