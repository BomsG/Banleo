import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Package,
  Settings,
  LogOut,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Save,
} from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { Order } from "../lib/types";
import { cn, formatPrice } from "../lib/utils";

interface UserProfile {
  id: string;
  full_name: string | null;
  address: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
}

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
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center gap-3 px-5 py-4 text-sm font-semibold shadow-lg rounded-sm ${
        type === "success" ? "bg-black text-white" : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? (
        <CheckCircle size={16} className="shrink-0" />
      ) : (
        <AlertCircle size={16} className="shrink-0" />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </motion.div>
  );
}

export default function Profile() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "settings">(
    "profile",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const navigate = useNavigate();

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) console.error("Error fetching profile:", profileError);
      setProfile(profileData);

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setEditName(profile?.full_name || "");
    setEditPhone(profile?.phone || "");
    setEditAddress(profile?.address || "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!supabase || !user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editName.trim() || null,
          phone: editPhone.trim() || null,
          address: editAddress.trim() || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update local state immediately
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              full_name: editName.trim() || null,
              phone: editPhone.trim() || null,
              address: editAddress.trim() || null,
            }
          : prev,
      );

      setIsEditing(false);
      showToast("Profile updated successfully!", "success");
    } catch (err: unknown) {
      const e = err as Error;
      showToast(e.message || "Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
      {/* Toast */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="mb-8">
            <h2 className="text-xl font-display font-bold uppercase tracking-widest">
              {profile?.full_name || user?.email?.split("@")[0]}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
              {user?.email}
            </p>
          </div>

          {(["profile", "orders", "settings"] as const).map((tab) => {
            const icons = {
              profile: User,
              orders: Package,
              settings: Settings,
            };
            const Icon = icons[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-widest transition-all",
                  activeTab === tab
                    ? "bg-black text-white"
                    : "hover:bg-gray-50",
                )}
              >
                <div className="flex items-center">
                  <Icon size={16} className="mr-3" /> {tab}
                </div>
                <ChevronRight size={14} />
              </button>
            );
          })}

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <div className="flex items-center">
              <LogOut size={16} className="mr-3" /> Sign Out
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-gray-100 p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-display font-bold uppercase tracking-widest">
                  Account Details
                </h3>
                {!isEditing && (
                  <button
                    onClick={startEditing}
                    className="text-[10px] font-bold uppercase tracking-widest border border-gray-200 px-4 py-2 hover:bg-black hover:text-white hover:border-black transition-all"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {!isEditing ? (
                // ── View mode ──────────────────────────────────────────
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Full Name
                    </label>
                    <p className="text-sm font-medium border-b border-gray-100 pb-2">
                      {profile?.full_name || (
                        <span className="text-gray-400 italic">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Email Address
                    </label>
                    <p className="text-sm font-medium border-b border-gray-100 pb-2">
                      {user?.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Default Shipping Address
                    </label>
                    <p className="text-sm font-medium border-b border-gray-100 pb-2">
                      {profile?.address || (
                        <span className="text-gray-400 italic">
                          No address saved
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Phone Number
                    </label>
                    <p className="text-sm font-medium border-b border-gray-100 pb-2">
                      {profile?.phone || (
                        <span className="text-gray-400 italic">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                // ── Edit mode ──────────────────────────────────────────
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Email Address
                      </label>
                      <p className="text-sm text-gray-400 border-b border-gray-100 py-2">
                        {user?.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Default Shipping Address
                      </label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder="Your shipping address"
                        className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="Your phone number"
                        className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={cancelEditing}
                      disabled={isSaving}
                      className="flex-1 border border-gray-200 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex-1 bg-black text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          <Save size={13} /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-gray-100 p-8 shadow-sm"
            >
              <h3 className="text-lg font-display font-bold uppercase tracking-widest mb-8">
                Order History
              </h3>

              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                          {new Date(order.created_at).toLocaleDateString()} •{" "}
                          {order.items.length} items
                        </p>
                      </div>
                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest mb-1">
                            Total
                          </p>
                          <p className="text-sm font-bold">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest mb-1">
                            Status
                          </p>
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-widest px-2 py-1",
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700",
                            )}
                          >
                            {order.status}
                          </span>
                        </div>
                        <button className="p-2 hover:bg-gray-50 transition-colors">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    You haven't placed any orders yet.
                  </p>
                  <button
                    onClick={() => navigate("/shop")}
                    className="btn-secondary mt-6 border-gray-200"
                  >
                    Go to Shop
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-gray-100 p-8 shadow-sm"
            >
              <h3 className="text-lg font-display font-bold uppercase tracking-widest mb-8">
                Account Settings
              </h3>
              <p className="text-sm text-gray-500 uppercase tracking-widest">
                Manage your security and notification preferences.
              </p>
              <div className="mt-8 space-y-6">
                <button className="w-full text-left p-4 border border-gray-100 hover:bg-gray-50 transition-colors text-xs font-bold uppercase tracking-widest">
                  Change Password
                </button>
                <button className="w-full text-left p-4 border border-gray-100 hover:bg-gray-50 transition-colors text-xs font-bold uppercase tracking-widest">
                  Notification Preferences
                </button>
                <button className="w-full text-left p-4 border border-red-100 hover:bg-red-50 text-red-600 transition-colors text-xs font-bold uppercase tracking-widest">
                  Delete Account
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
