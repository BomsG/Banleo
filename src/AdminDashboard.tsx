import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  TrendingUp,
  DollarSign,
  Clock,
  X,
  Save,
  Loader2,
  Menu,
  RefreshCw,
  ImagePlus,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

const CATEGORIES = [
  "men",
  "women",
  "two-piece",
  "sets",
  "pants",
  "undies",
  "sleeveless",
  "singlet",
  "shirts",
  "t-shirts",
  "scarf",
  "face-caps",
  "collections",
];

// ─── helpers ─────────────────────────────────────────────────────────────────
const toArray = (v: string | string[] | null | undefined): string[] => {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
};

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className={cn(
        "fixed bottom-6 right-6 z-[9999] px-6 py-4 text-[11px] font-bold uppercase tracking-widest flex items-center gap-3 shadow-2xl",
        type === "success" ? "bg-white text-black" : "bg-red-600 text-white",
      )}
    >
      {type === "error" && <AlertCircle size={14} />}
      {message}
    </motion.div>,
    document.body,
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  // Product modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(""); // permanent Supabase URL
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // ── Hide nav/footer ────────────────────────────────────────────────────
  useEffect(() => {
    const nav = document.querySelector("nav") as HTMLElement | null;
    const footer = document.querySelector("footer") as HTMLElement | null;
    const prevNav = nav?.style.display;
    const prevFooter = footer?.style.display;
    if (nav) nav.style.display = "none";
    if (footer) footer.style.display = "none";
    document.body.style.overflow = "auto";
    return () => {
      if (nav) nav.style.display = prevNav || "";
      if (footer) footer.style.display = prevFooter || "";
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        showToast("Supabase not configured", "error");
        setLoading(false);
        return;
      }
      const [pRes, oRes, uRes] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("orders")
          .select("*, profiles(full_name, email)")
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);
      if (pRes.error) throw new Error(`Products: ${pRes.error.message}`);
      if (oRes.error) throw new Error(`Orders: ${oRes.error.message}`);
      if (uRes.error) throw new Error(`Users: ${uRes.error.message}`);
      setProducts(pRes.data || []);
      setOrders(oRes.data || []);
      setUsers(uRes.data || []);
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Failed to load data",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Delete product ─────────────────────────────────────────────────────
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product permanently?")) return;
    if (!supabase) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((x) => x.id !== id));
      showToast("Product deleted");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  // ── Save product ───────────────────────────────────────────────────────
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) {
      showToast("Supabase not configured", "error");
      return;
    }
    if (selectedCategories.length === 0) {
      showToast("Select at least one category", "error");
      return;
    }

    setIsSaving(true);
    const fd = new FormData(e.currentTarget);

    // Priority: file upload > pasted URL > existing image
    const finalImage =
      uploadedUrl ||
      (fd.get("image") as string)?.trim() ||
      editingProduct?.image ||
      "";

    const payload = {
      name: fd.get("name") as string,
      price: parseFloat(fd.get("price") as string),
      category: selectedCategories,
      image: finalImage,
      description: fd.get("description") as string,
      is_new: fd.get("is_new") === "on",
      is_sale: fd.get("is_sale") === "on",
      stock_quantity: parseInt(fd.get("stock_quantity") as string) || 0,
      discount_percentage:
        parseInt(fd.get("discount_percentage") as string) || 0,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);
        if (error) throw error;
        showToast("Product updated");
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
        showToast("Product created");
      }
      await fetchData();
      closeModal();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Update order status ────────────────────────────────────────────────
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
  ) => {
    if (!supabase) return;
    setUpdatingOrderId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);
      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
      showToast(`Status → ${status}`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ── Toggle admin ───────────────────────────────────────────────────────
  const handleToggleAdmin = async (user: UserProfile) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: !user.is_admin })
        .eq("id", user.id);
      if (error) throw error;
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, is_admin: !u.is_admin } : u,
        ),
      );
      showToast(
        `${user.full_name || "User"} ${!user.is_admin ? "granted" : "revoked"} admin`,
      );
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed", "error");
    }
  };

  // ── Image upload ───────────────────────────────────────────────────────
  const handleImageUpload = async (file: File) => {
    setImagePreview(URL.createObjectURL(file));
    setUploadedUrl("");
    if (!supabase) return;
    try {
      const ext = file.name.split(".").pop();
      const path = `product-${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("products")
        .upload(path, file, { upsert: true });
      if (error) {
        showToast("Upload failed — using local preview", "error");
        return;
      }
      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(data.path);
      setUploadedUrl(urlData.publicUrl);
      setImagePreview(urlData.publicUrl);
      showToast("Image uploaded");
    } catch {
      showToast("Image upload failed", "error");
    }
  };

  // ── Category toggle ────────────────────────────────────────────────────
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  // ── Modal open/close ───────────────────────────────────────────────────
  const openModal = (product: Product | null) => {
    setEditingProduct(product);
    setImagePreview(product?.image || "");
    setUploadedUrl("");
    setSelectedCategories(product ? toArray(product.category) : []);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setImagePreview("");
    setUploadedUrl("");
    setSelectedCategories([]);
  };

  // ── Derived ────────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "bg-green-500/10 text-green-500",
    },
    {
      label: "Total Orders",
      value: String(orders.length),
      icon: ShoppingBag,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Total Products",
      value: String(products.length),
      icon: Package,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      label: "Total Users",
      value: String(users.length),
      icon: Users,
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  const q = searchQuery.toLowerCase();
  const filteredProducts = products.filter((p) => {
    const cats = toArray(p.category).join(" ").toLowerCase();
    return p.name.toLowerCase().includes(q) || cats.includes(q);
  });
  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(q) ||
      (o as any).profiles?.full_name?.toLowerCase().includes(q),
  );
  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q),
  );

  const statusColor = (s: string) =>
    s === "pending"
      ? "bg-yellow-500/10 text-yellow-500"
      : s === "processing"
        ? "bg-indigo-500/10 text-indigo-400"
        : s === "shipped"
          ? "bg-blue-500/10 text-blue-500"
          : s === "delivered"
            ? "bg-green-500/10 text-green-500"
            : "bg-red-500/10 text-red-500";

  const SidebarItem = ({
    tab,
    icon: Icon,
    label,
  }: {
    tab: Tab;
    icon: React.ElementType;
    label: string;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      title={!sidebarOpen ? label : undefined}
      className={cn(
        "w-full flex items-center py-3 text-[11px] font-bold uppercase tracking-widest transition-all",
        sidebarOpen ? "px-5 gap-3" : "justify-center px-0",
        activeTab === tab
          ? "bg-white text-black border-r-4 border-red-600"
          : "text-gray-400 hover:text-white hover:bg-white/5",
      )}
    >
      <Icon size={16} />
      {sidebarOpen && <span>{label}</span>}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white flex z-[500] overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={cn(
          "flex flex-col bg-[#080808] border-r border-white/10 transition-all duration-300 shrink-0",
          sidebarOpen ? "w-56" : "w-[52px]",
        )}
      >
        <div
          className={cn(
            "flex items-center border-b border-white/10 py-4 shrink-0",
            sidebarOpen ? "px-5 gap-3" : "justify-center px-0",
          )}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <Menu size={17} />
          </button>
          {sidebarOpen && (
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
              Banleo Admin
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 py-4 gap-1 overflow-y-auto">
          <SidebarItem tab="overview" icon={LayoutDashboard} label="Overview" />
          <SidebarItem tab="products" icon={Package} label="Products" />
          <SidebarItem tab="orders" icon={ShoppingBag} label="Orders" />
          <SidebarItem tab="users" icon={Users} label="Users" />
        </div>
        <div className="border-t border-white/10 pb-4 pt-3 space-y-1 shrink-0">
          <SidebarItem tab="settings" icon={Settings} label="Settings" />
          <button
            onClick={() => navigate("/")}
            title={!sidebarOpen ? "Back to site" : undefined}
            className={cn(
              "w-full flex items-center py-3 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all",
              sidebarOpen ? "px-5 gap-3" : "justify-center px-0",
            )}
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Back to Site</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-[#0a0a0a] gap-4">
          <div>
            <h1 className="text-xl font-display font-bold uppercase tracking-tighter">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold hidden sm:block">
              Banleo admin dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-white/5 border border-white/10 pl-8 pr-4 py-2 text-[11px] uppercase tracking-widest focus:outline-none focus:border-white/30 transition-colors w-48"
              />
            </div>
            <button
              onClick={fetchData}
              className="p-2 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            {activeTab === "products" && (
              <button
                onClick={() => openModal(null)}
                className="bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Plus size={13} /> Add Product
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-red-600" size={36} />
            </div>
          )}

          {/* OVERVIEW */}
          {!loading && activeTab === "overview" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white/5 border border-white/10 p-5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={cn("p-2 rounded-lg", s.color)}>
                        <s.icon size={18} />
                      </div>
                      <TrendingUp size={13} className="text-green-500" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                      {s.label}
                    </p>
                    <p className="text-xl font-display font-bold">{s.value}</p>
                  </motion.div>
                ))}
              </div>

              {pendingCount > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 px-5 py-3 flex items-center gap-3">
                  <AlertCircle size={15} className="text-yellow-500 shrink-0" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-yellow-500">
                    {pendingCount} pending order{pendingCount > 1 ? "s" : ""}{" "}
                    need attention
                  </p>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="ml-auto text-[10px] underline text-yellow-400 hover:text-yellow-200"
                  >
                    View
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
                    <Clock size={13} /> Recent Orders
                  </h3>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/10 flex items-center justify-center text-[9px] font-bold shrink-0">
                            #{o.id.slice(0, 4).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest">
                              {(o as any).profiles?.full_name || "Customer"}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {formatPrice(o.total)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase tracking-widest px-2 py-1",
                            statusColor(o.status),
                          )}
                        >
                          {o.status}
                        </span>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-center text-gray-600 py-8 text-[11px] uppercase tracking-widest">
                        No orders yet
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
                    <Package size={13} /> Top Products
                  </h3>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-12 object-cover shrink-0"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/36x48/111/333?text=?";
                            }}
                          />
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest truncate max-w-[150px]">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {toArray(p.category).join(", ")}
                            </p>
                          </div>
                        </div>
                        <p className="text-[11px] font-bold shrink-0">
                          {formatPrice(p.price)}
                        </p>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <p className="text-center text-gray-600 py-8 text-[11px] uppercase tracking-widest">
                        No products yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {!loading && activeTab === "products" && (
            <div className="bg-white/5 border border-white/10 overflow-x-auto max-w-7xl mx-auto">
              <table className="w-full text-left min-w-[680px]">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Categories</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-12 object-cover shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/36x48/111/333?text=?";
                            }}
                          />
                          <span className="text-[11px] font-bold uppercase tracking-widest truncate max-w-[160px]">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {toArray(p.category).map((cat) => (
                            <span
                              key={cat}
                              className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-white/10 text-gray-300"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[11px] font-bold">
                          {formatPrice(p.price)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-1",
                            (p.stock_quantity || 0) === 0
                              ? "bg-red-500/10 text-red-500"
                              : (p.stock_quantity || 0) < 5
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-green-500/10 text-green-500",
                          )}
                        >
                          {p.stock_quantity ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {p.is_new && (
                            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-purple-500/10 text-purple-400">
                              New
                            </span>
                          )}
                          {p.is_sale && (
                            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-red-500/10 text-red-500">
                              Sale
                            </span>
                          )}
                          {!p.is_new && !p.is_sale && (
                            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-green-500/10 text-green-500">
                              Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openModal(p)}
                            className="p-2 hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-14 text-gray-600 text-[11px] uppercase tracking-widest"
                      >
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ORDERS */}
          {!loading && activeTab === "orders" && (
            <div className="bg-white/5 border border-white/10 overflow-x-auto max-w-7xl mx-auto">
              <table className="w-full text-left min-w-[720px]">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <th className="px-5 py-4">Order ID</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="text-[11px] font-bold font-mono">
                          #{o.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[11px] font-bold uppercase tracking-widest">
                          {(o as any).profiles?.full_name || "Customer"}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {(o as any).profiles?.email}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[11px] text-gray-400">
                          {new Date(o.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[11px] font-bold">
                          {formatPrice(o.total)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase tracking-widest px-2 py-1",
                            statusColor(o.status),
                          )}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {updatingOrderId === o.id ? (
                          <Loader2
                            size={14}
                            className="animate-spin text-gray-400 ml-auto"
                          />
                        ) : (
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(
                                o.id,
                                e.target.value as OrderStatus,
                              )
                            }
                            className="bg-[#111] border border-white/10 text-[10px] font-bold uppercase tracking-widest px-3 py-2 focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s} className="normal-case">
                                {s}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-14 text-gray-600 text-[11px] uppercase tracking-widest"
                      >
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* USERS */}
          {!loading && activeTab === "users" && (
            <div className="bg-white/5 border border-white/10 overflow-x-auto max-w-7xl mx-auto">
              <table className="w-full text-left min-w-[580px]">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                            {(u.full_name || "U")[0].toUpperCase()}
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-widest">
                            {u.full_name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[11px] text-gray-400">
                          {u.email}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[11px] text-gray-400">
                          {new Date(u.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-1",
                            u.is_admin
                              ? "bg-red-500/10 text-red-500"
                              : "bg-blue-500/10 text-blue-500",
                          )}
                        >
                          {u.is_admin ? "Admin" : "Customer"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleToggleAdmin(u)}
                          className="text-[10px] font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 px-3 py-1 hover:text-white transition-colors"
                        >
                          {u.is_admin ? "Revoke Admin" : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-14 text-gray-600 text-[11px] uppercase tracking-widest"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* SETTINGS */}
          {!loading && activeTab === "settings" && (
            <div className="max-w-2xl space-y-6 mx-auto">
              <div className="bg-white/5 border border-white/10 p-8">
                <h3 className="text-base font-display font-bold uppercase tracking-tighter mb-8">
                  General Settings
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      label: "Store Name",
                      type: "text",
                      defaultValue: "Banleo",
                    },
                    {
                      label: "Contact Email",
                      type: "email",
                      defaultValue: "support@banleo.com",
                    },
                    { label: "Support Phone", type: "tel", defaultValue: "" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        defaultValue={f.defaultValue}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Currency
                    </label>
                    <select className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 appearance-none">
                      <option value="NGN">NGN (₦)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => showToast("Settings saved")}
                  className="bg-white text-black px-12 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#111] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-5 border-b border-white/10 sticky top-0 bg-[#111] z-10">
                <h2 className="text-base font-display font-bold uppercase tracking-tighter">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-5">
                {/* Image */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Product Image
                    {uploadedUrl && (
                      <span className="ml-2 text-green-400 normal-case font-normal tracking-normal">
                        ✓ Saved to storage
                      </span>
                    )}
                  </label>
                  <div className="flex gap-4 items-start">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-28 border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:border-white/30 transition-colors shrink-0 overflow-hidden"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImagePlus size={18} className="text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <input
                        name="image"
                        placeholder="Or paste image URL"
                        defaultValue={!uploadedUrl ? editingProduct?.image : ""}
                        onChange={(e) => {
                          setImagePreview(e.target.value);
                          setUploadedUrl(""); // pasting a URL clears the upload
                        }}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[11px] focus:outline-none focus:border-white/30 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] font-bold uppercase tracking-widest border border-white/10 px-4 py-2 hover:border-white/30 transition-colors"
                      >
                        Upload File
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0])
                            handleImageUpload(e.target.files[0]);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Name *
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
                      Price (₦) *
                    </label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={editingProduct?.price}
                      required
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Multi-select Categories */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Categories *{" "}
                    {selectedCategories.length > 0 && (
                      <span className="text-white/40 normal-case font-normal tracking-normal">
                        ({selectedCategories.length} selected)
                      </span>
                    )}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-white/5 border border-white/10 p-3">
                    {CATEGORIES.map((c) => {
                      const active = selectedCategories.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleCategory(c)}
                          className={cn(
                            "px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all text-left",
                            active
                              ? "bg-white text-black"
                              : "text-gray-400 hover:text-white hover:bg-white/10",
                          )}
                        >
                          {c.replace(/-/g, " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Stock *
                    </label>
                    <input
                      name="stock_quantity"
                      type="number"
                      min="0"
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
                      min="0"
                      max="100"
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

                <div className="flex gap-8">
                  {[
                    {
                      name: "is_new",
                      label: "New Arrival",
                      checked: editingProduct?.is_new,
                    },
                    {
                      name: "is_sale",
                      label: "On Sale",
                      checked: editingProduct?.is_sale,
                    },
                  ].map((cb) => (
                    <label
                      key={cb.name}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        name={cb.name}
                        defaultChecked={cb.checked}
                        className="w-4 h-4 bg-white/5 text-red-600 focus:ring-0 border-white/10"
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                        {cb.label}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 border border-white/10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-white text-black py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <>
                        <Save size={13} />
                        {editingProduct ? "Update" : "Create"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
