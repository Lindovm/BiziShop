import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import {
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  Download,
  Edit,
  Filter,
  Package,
  Plus,
  RefreshCw,
  Search,
  Truck,
  Trash2,
} from "lucide-react";
import Layout from "./Layout";
import { inventoryDB, menuDB, firestoreDB } from "../lib/firebase-db";
import { InventoryItem, Product, Supplier } from "../types/models";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "../lib/firebase";

interface DisplayableInventoryItem extends InventoryItem {
  name: string;
  category: string;
}

interface DisplayableSupplier extends Supplier {
  lastOrder?: string;
  itemsSupplied: string[];
  contact?: string; // For backward compatibility
}

interface DeliveryItem {
  inventoryItemId: string;
  productId: string;
  quantity: number;
  unit: string;
  cost: number;
  totalCost: number;
}

interface Delivery {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'scheduled';
  items: DeliveryItem[];
  totalCost: number;
  notes?: string;
  restaurant_id: string;
  createdAt: string;
  updatedAt: string;
  // For backward compatibility with the UI
  supplier?: string;
  date?: string;
  time?: string;
}

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<DisplayableInventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<DisplayableSupplier[]>([]);
  const [upcomingDeliveries, setUpcomingDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch inventory items
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [rawInventoryItems, productsData] = await Promise.all([
          inventoryDB.getAllInventoryItems() as Promise<InventoryItem[]>,
          menuDB.getAllMenuItems() as Promise<Product[]>
        ]);

        const productsMap = new Map(productsData.map(p => [p.id, p]));

        const enrichedItems = rawInventoryItems.map(item => {
          const product = productsMap.get(item.productId);
          return {
            ...item,
            name: product?.name || item.productId || 'Unknown Product', // Fallback to productId if name not found
            category: product?.category || 'Unknown Category',
          };
        });
        setInventoryItems(enrichedItems);
        // Clear any previous error if data fetching is successful, even if empty
        setError(null); 
      } catch (err) {
        // Only set an error if it's a real error object
        if (err instanceof Error) {
          console.error("Failed to fetch inventory data:", err);
          setError(`Failed to load inventory data: ${err.message}. Please try again later.`);
        } else {
          console.error("An unknown error occurred while fetching inventory data:", err);
          setError("An unknown error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const suppliersRef = collection(firestore, 'suppliers');
        const suppliersQuery = query(suppliersRef, orderBy('name'));
        const suppliersSnapshot = await getDocs(suppliersQuery);

        const suppliersData = suppliersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unknown Supplier',
            contactPerson: data.contactPerson || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            notes: data.notes || '',
            lastOrder: data.lastOrder || 'N/A',
            itemsSupplied: data.itemsSupplied || [],
            restaurant_id: data.restaurant_id || '',
            contact: data.contactPerson || '', // For backward compatibility
          } as DisplayableSupplier;
        });

        setSuppliers(suppliersData);
        // setError(null); // Potentially clear error here too if suppliers load successfully
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
        // Optionally set an error specific to suppliers, or a general one if this is critical
        // For now, let's not set a page-wide error for supplier loading failure
        // setError("Failed to load supplier data."); 
      } finally {
        setLoading(false); // This might be called multiple times if all useEffects run
      }
    };

    fetchSuppliers();
  }, []);

  // Fetch upcoming deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const deliveriesRef = collection(firestore, 'deliveries');
        const deliveriesQuery = query(deliveriesRef, orderBy('expectedDeliveryDate'));
        const deliveriesSnapshot = await getDocs(deliveriesQuery);

        const deliveriesData = deliveriesSnapshot.docs.map(doc => {
          const data = doc.data();

          // Format the date and time from expectedDeliveryDate
          const deliveryDate = data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : new Date();
          const formattedDate = deliveryDate.toISOString().split('T')[0];
          const formattedTime = deliveryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return {
            id: doc.id,
            supplierId: data.supplierId || '',
            supplierName: data.supplierName || 'Unknown Supplier',
            orderDate: data.orderDate || '',
            expectedDeliveryDate: data.expectedDeliveryDate || '',
            status: data.status || 'pending',
            items: data.items || [],
            totalCost: data.totalCost || 0,
            notes: data.notes || '',
            restaurant_id: data.restaurant_id || '',
            createdAt: data.createdAt || '',
            updatedAt: data.updatedAt || '',
            // For backward compatibility with the UI
            supplier: data.supplierName || 'Unknown Supplier',
            date: formattedDate,
            time: formattedTime
          } as Delivery;
        });

        setUpcomingDeliveries(deliveriesData);
        // setError(null); // Potentially clear error here too
      } catch (err) {
        console.error("Failed to fetch deliveries:", err);
        // Optionally set an error specific to deliveries
        // setError("Failed to load delivery data.");
      } finally {
        setLoading(false); // This might be called multiple times
      }
    };

    fetchDeliveries();
  }, []);

  const filteredItems = inventoryItems
    .filter((item) => {
      if (!item) return false;
      if (showLowStockOnly) {
        return item.status === "low" || item.status === "out";
      }
      return true;
    })
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStockPercentage = (current: number, min: number) => {
    // Calculate a percentage where min stock is 25% and anything above 4x min stock is 100%
    const maxStock = min * 4;
    const percentage = (current / maxStock) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  const getStockColor = (status: 'ok' | 'low' | 'out') => { // Use the type from InventoryItem
    switch (status) {
      case "out": // Assuming 'critical' maps to 'out'
        return "bg-red-500";
      case "low":
        return "bg-yellow-500";
      default: // 'ok'
        return "bg-green-500";
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={
                  showLowStockOnly
                    ? "bg-orange-100 text-orange-800 border-orange-200"
                    : ""
                }
              >
                <AlertTriangle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 sm:ml-2">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="inventory" className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-full bg-white mb-4 p-1 rounded-lg min-w-[600px]">
              <TabsTrigger value="inventory" className="flex-1">
                Inventory
              </TabsTrigger>
              <TabsTrigger value="low-stock" className="flex-1">
                Low Stock
                <Badge className="ml-2 bg-red-100 text-red-800">
                  {inventoryItems.filter((item) => item && item.status !== "ok").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="flex-1">
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="deliveries" className="flex-1">
                <span className="hidden sm:inline">Upcoming </span>Deliveries
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex-1">
                Reports
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <CardTitle>Current Inventory</CardTitle>
                  <div className="flex space-x-2 w-full sm:w-auto justify-end">
                    <Button variant="outline" size="sm">
                      <ArrowUpDown className="h-4 w-4 sm:mr-2" />{" "}
                      <span className="hidden sm:inline">Sort</span>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 sm:mr-2" />{" "}
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading && <p className="text-center py-8">Loading inventory...</p>}
                {error && <p className="text-red-500 text-center py-8">{error}</p>}
                {!loading && !error && inventoryItems.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Inventory Items Yet</h3>
                    <p className="text-gray-500 mb-6">
                      It looks like you haven't added any inventory items.
                    </p>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="h-4 w-4 mr-2" /> Add Your First Item
                    </Button>
                  </div>
                )}
                {!loading && !error && inventoryItems.length > 0 && (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Item
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Category
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Stock Level
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Min. Stock
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Supplier
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Last Restocked
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div className="font-medium">{item.name}</div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className="font-normal">
                                  {item.category}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2">
                                  <div className="w-24">
                                    <Progress
                                      value={getStockPercentage(
                                        item.currentStock,
                                        item.minStock,
                                      )}
                                      className={getStockColor(item.status)}
                                    />
                                  </div>
                                  <span
                                    className={`text-sm ${item.status === "out" ? "text-red-600 font-medium" : item.status === "low" ? "text-yellow-600" : "text-gray-600"}`}
                                  >
                                    {item.currentStock} {item.unit}
                                  </span>
                                  {item.status === "out" && (
                                    <Badge className="bg-red-100 text-red-800 text-xs">
                                      Out of Stock
                                    </Badge>
                                  )}
                                  {item.status === "low" && (
                                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                      Low
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {item.minStock} {item.unit}
                              </td>
                              <td className="py-3 px-4 text-sm">{item.supplier || 'N/A'}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {item.lastRestocked || 'N/A'}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {filteredItems.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-lg overflow-hidden bg-white"
                        >
                          <div className="p-4 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <Badge
                                  variant="outline"
                                  className="font-normal mt-1"
                                >
                                  {item.category}
                                </Badge>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-500 mb-1">
                                Stock Level
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-full max-w-[120px]">
                                  <Progress
                                    value={getStockPercentage(
                                      item.currentStock,
                                      item.minStock,
                                    )}
                                    className={getStockColor(item.status)}
                                  />
                                </div>
                                <span
                                  className={`text-sm ${item.status === "out" ? "text-red-600 font-medium" : item.status === "low" ? "text-yellow-600" : "text-gray-600"}`}
                                >
                                  {item.currentStock} {item.unit}
                                </span>
                                {item.status === "out" && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">
                                    Out of Stock
                                  </Badge>
                                )}
                                {item.status === "low" && (
                                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                    Low
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <div className="font-medium text-gray-500">
                                  Min. Stock
                                </div>
                                <div>
                                  {item.minStock} {item.unit}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-gray-500">
                                  Last Restocked
                                </div>
                                <div>{item.lastRestocked || 'N/A'}</div>
                              </div>
                              <div className="col-span-2">
                                <div className="font-medium text-gray-500">
                                  Supplier
                                </div>
                                <div>{item.supplier || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="low-stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryItems
                    .filter((item) => item && item.status === "out") // Changed "critical" to "out"
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                              <span className="font-bold text-lg">
                                {item.name}
                              </span>
                              <Badge className="ml-2 bg-red-100 text-red-800">
                                Out of Stock
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Current stock:{" "}
                              <span className="font-medium text-red-600">
                                {item.currentStock} {item.unit}
                              </span>{" "}
                              (Minimum: {item.minStock} {item.unit})
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Reorder Now
                          </Button>
                        </div>
                      </div>
                    ))}

                  {inventoryItems
                    .filter((item) => item && item.status === "low")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                              <span className="font-bold text-lg">
                                {item.name}
                              </span>
                              <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                                Low
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Current stock:{" "}
                              <span className="font-medium text-yellow-600">
                                {item.currentStock} {item.unit}
                              </span>{" "}
                              (Minimum: {item.minStock} {item.unit})
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          >
                            Add to Order
                          </Button>
                        </div>
                      </div>
                    ))}

                  {inventoryItems.filter((item) => item && item.status !== "ok")
                    .length === 0 && (
                    <div className="text-center py-8">
                      <div className="bg-green-100 text-green-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                        <Package className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">
                        All Stock Levels are Good
                      </h3>
                      <p className="text-gray-500">
                        You have no low stock items at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {suppliers.map((supplier) => (
                <Card key={supplier.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{supplier.name}</h3>
                        <p className="text-sm text-gray-500">
                          {supplier.contact}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                        >
                          <Truck className="h-4 w-4 mr-2" /> Order
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="text-sm font-medium w-24">
                          Contact:
                        </span>
                        <span className="text-sm">{supplier.phone}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-sm font-medium w-24">Email:</span>
                        <span className="text-sm">{supplier.email}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-sm font-medium w-24">
                          Address:
                        </span>
                        <span className="text-sm">{supplier.address}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-sm font-medium w-24">
                          Last Order:
                        </span>
                        <span className="text-sm">{supplier.lastOrder}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-sm font-medium w-24">Items:</span>
                        <div className="flex flex-wrap gap-1">
                          {supplier.itemsSupplied.map((item, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Add New Supplier
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="deliveries" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <CardTitle>Upcoming Deliveries</CardTitle>
                  <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" /> Schedule Delivery
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeliveries.map((delivery) => (
                    <div
                      key={delivery.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 px-4 py-3 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex items-center">
                          <Truck className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="font-medium">
                            {delivery.supplier}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
                          <Badge
                            className={`
                              ${delivery.status === "confirmed" ? "bg-green-100 text-green-800" : ""}
                              ${delivery.status === "scheduled" ? "bg-blue-100 text-blue-800" : ""}
                              ${delivery.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                              w-fit
                            `}
                          >
                            {delivery.status.charAt(0).toUpperCase() +
                              delivery.status.slice(1)}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {delivery.date} at {delivery.time}
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-medium mb-2">Items:</h4>
                        <ul className="space-y-1">
                          {delivery.items && delivery.items.map((item, index) => (
                            <li
                              key={index}
                              className="text-sm flex items-center"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-400 mr-2"></span>
                              {`${item.quantity} ${item.unit} (${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.totalCost)})`}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 border-t flex flex-wrap justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50 flex-1 sm:flex-none"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Cancel
                        </Button>
                        {delivery.status === "pending" && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 flex-1 sm:flex-none"
                          >
                            Confirm
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">
                        Inventory usage chart would appear here
                      </p>
                      <p className="text-sm text-gray-400">
                        Showing consumption trends over time
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reorder Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">
                        Reorder frequency chart would appear here
                      </p>
                      <p className="text-sm text-gray-400">
                        Showing how often items need reordering
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Inventory;
