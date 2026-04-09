import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Clock,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { supabase } from "./lib/supabase";
import { cn, formatPrice } from "./lib/utils";
import { Product, Order } from "./lib/types";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  is_admin: boolean;
  created_at: string;
}

type Tab = "overview" | "products" | "orders" | "users" | "settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!supabase) return;

      // Fetch Products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*, profiles(full_name, email)")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch Users
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      image: formData.get("image") as string,
      description: formData.get("description") as string,
      is_new: formData.get("is_new") === "on",
      is_sale: formData.get("is_sale") === "on",
      stock_quantity: parseInt(formData.get("stock_quantity") as string) || 0,
      discount_percentage:
        parseInt(formData.get("discount_percentage") as string) || 0,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
      }

      await fetchData();
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "bg-green-500/10 text-green-500",
    },
    {
      label: "Total Orders",
      value: orders.length.toString(),
      icon: ShoppingBag,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Total Products",
      value: products.length.toString(),
      icon: Package,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      label: "Total Users",
      value: users.length.toString(),
      icon: Users,
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  const SidebarItem = ({
    tab,
    icon: Icon,
    label,
  }: {
    tab: Tab;
    icon: any;
    label: string;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={cn(
        "w-full flex items-center space-x-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all",
        activeTab === tab
          ? "bg-white text-black border-r-4 border-red-600"
          : "text-gray-400 hover:text-white hover:bg-white/5",
      )}
    >
      <Icon size={18} />
      {isSidebarOpen && <span>{label}</span>}
    </button>
  );

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex pt-20">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-20 bottom-0 bg-black border-r border-white/10 transition-all duration-300 z-30",
          isSidebarOpen ? "w-64" : "w-20",
        )}
      >
        <div className="py-8 flex flex-col h-full">
          <div className="space-y-2 flex-grow">
            <SidebarItem
              tab="overview"
              icon={LayoutDashboard}
              label="Overview"
            />
            <SidebarItem tab="products" icon={Package} label="Products" />
            <SidebarItem tab="orders" icon={ShoppingBag} label="Orders" />
            <SidebarItem tab="users" icon={Users} label="Users" />
          </div>
          <div className="border-t border-white/10 pt-4">
            <SidebarItem tab="settings" icon={Settings} label="Settings" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-grow transition-all duration-300 p-8",
          isSidebarOpen ? "ml-64" : "ml-20",
        )}
      >
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-display font-bold uppercase tracking-tighter mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                Manage your luxury fashion empire
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-white/30 transition-colors w-64"
                />
              </div>
              {activeTab === "products" && (
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="bg-white text-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center"
                >
                  <Plus size={14} className="mr-2" /> Add New
                </button>
              )}
            </div>
          </header>

          {activeTab === "overview" && (
            <div className="space-y-12">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn("p-3 rounded-lg", stat.color)}>
                        <stat.icon size={24} />
                      </div>
                      <TrendingUp size={16} className="text-green-500" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                      {stat.label}
                    </h3>
                    <p className="text-2xl font-display font-bold tracking-tight">
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 p-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-8 flex items-center">
                    <Clock size={16} className="mr-2" /> Recent Orders
                  </h3>
                  <div className="space-y-6">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">
                            #{order.id.slice(0, 4).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold uppercase tracking-widest">
                              {(order as any).profiles?.full_name || "Customer"}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                              {order.items.length} items • $
                              {order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-1",
                            order.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : order.status === "shipped"
                                ? "bg-blue-500/10 text-blue-500"
                                : order.status === "delivered"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-red-500/10 text-red-500",
                          )}
                        >
                          {order.status}
                        </span>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-center text-gray-500 py-8 uppercase tracking-widest text-xs">
                        No orders yet
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-8 flex items-center">
                    <Package size={16} className="mr-2" /> Top Products
                  </h3>
                  <div className="space-y-6">
                    {products.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-sm font-bold uppercase tracking-widest truncate w-40">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                              {product.category}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-bold">${product.price}</p>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <p className="text-center text-gray-500 py-8 uppercase tracking-widest text-xs">
                        No products yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-16 object-cover rounded"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-sm font-bold uppercase tracking-widest truncate max-w-[200px]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold">
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-1",
                            product.is_sale
                              ? "bg-red-500/10 text-red-500"
                              : "bg-green-500/10 text-green-500",
                          )}
                        >
                          {product.is_sale ? "Sale" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsProductModalOpen(true);
                            }}
                            className="p-2 hover:text-blue-500 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold uppercase tracking-widest">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold uppercase tracking-widest">
                            {(order as any).profiles?.full_name || "Customer"}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {(order as any).profiles?.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold">
                          ${order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-1",
                            order.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : order.status === "shipped"
                                ? "bg-blue-500/10 text-blue-500"
                                : order.status === "delivered"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-red-500/10 text-red-500",
                          )}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:text-white transition-colors">
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="text-center py-24">
                  <p className="text-gray-500 text-sm uppercase tracking-widest">
                    No orders found
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white/5 border border-white/10 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold uppercase tracking-widest">
                          {user.full_name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400">
                          {user.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-1",
                            user.is_admin
                              ? "bg-red-500/10 text-red-500"
                              : "bg-blue-500/10 text-blue-500",
                          )}
                        >
                          {user.is_admin ? "Admin" : "Customer"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            const { error } = await supabase
                              .from("profiles")
                              .update({ is_admin: !user.is_admin })
                              .eq("id", user.id);
                            if (error) alert(error.message);
                            else fetchData();
                          }}
                          className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors border border-white/10 px-3 py-1"
                        >
                          Toggle Admin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-8">
              <div className="bg-white/5 border border-white/10 p-8">
                <h3 className="text-lg font-display font-bold uppercase tracking-tighter mb-8">
                  General Settings
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Store Name
                    </label>
                    <input
                      type="text"
                      defaultValue="ASH LUXE"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      defaultValue="support@ash-luxe.com"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Currency
                    </label>
                    <select className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-8">
                <h3 className="text-lg font-display font-bold uppercase tracking-tighter mb-8">
                  Maintenance Mode
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest">
                      Enable Maintenance Mode
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                      When enabled, customers will see a maintenance page.
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-white text-black px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#111] border border-white/10 w-full max-w-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <h2 className="text-xl font-display font-bold uppercase tracking-tighter">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-gray-500 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Product Name
                    </label>
                    <input
                      name="name"
                      defaultValue={editingProduct?.name}
                      required
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Price ($)
                    </label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.price}
                      required
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Category
                    </label>
                    <select
                      name="category"
                      defaultValue={editingProduct?.category}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none"
                    >
                      <option value="MEN">MEN</option>
                      <option value="WOMEN">WOMEN</option>
                      <option value="NEW ARRIVALS">NEW ARRIVALS</option>
                      <option value="COLLECTIONS">COLLECTIONS</option>
                      <option value="TWO-PIECE">TWO-PIECE</option>
                      <option value="SETS">SETS</option>
                      <option value="PANTS">PANTS</option>
                      <option value="UNDIES">UNDIES</option>
                      <option value="SCARF">SCARF</option>
                      <option value="FACE CAPS">FACE CAPS</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Image URL
                    </label>
                    <input
                      name="image"
                      defaultValue={editingProduct?.image}
                      required
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Stock Quantity
                    </label>
                    <input
                      name="stock_quantity"
                      type="number"
                      defaultValue={editingProduct?.stock_quantity ?? 10}
                      required
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Discount (%)
                    </label>
                    <input
                      name="discount_percentage"
                      type="number"
                      defaultValue={editingProduct?.discount_percentage ?? 0}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingProduct?.description}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                </div>

                <div className="flex space-x-8">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="is_new"
                      defaultChecked={editingProduct?.is_new}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-red-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                      New Arrival
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="is_sale"
                      defaultChecked={editingProduct?.is_sale}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-red-600 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                      On Sale
                    </span>
                  </label>
                </div>

                <div className="pt-6 flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="flex-1 border border-white/10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-white text-black py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        <Save size={14} className="mr-2" />
                        {editingProduct ? "Update Product" : "Create Product"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
