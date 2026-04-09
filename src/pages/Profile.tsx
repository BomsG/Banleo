import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  User,
  Package,
  Settings,
  LogOut,
  ChevronRight,
  Loader2,
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

export default function Profile() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "settings">(
    "profile",
  );
  const navigate = useNavigate();

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

      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }
      setProfile(profileData);

      // Fetch Orders
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

          <button
            onClick={() => setActiveTab("profile")}
            className={cn(
              "w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === "profile"
                ? "bg-black text-white"
                : "hover:bg-gray-50",
            )}
          >
            <div className="flex items-center">
              <User size={16} className="mr-3" /> Profile
            </div>
            <ChevronRight size={14} />
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={cn(
              "w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === "orders"
                ? "bg-black text-white"
                : "hover:bg-gray-50",
            )}
          >
            <div className="flex items-center">
              <Package size={16} className="mr-3" /> Orders
            </div>
            <ChevronRight size={14} />
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === "settings"
                ? "bg-black text-white"
                : "hover:bg-gray-50",
            )}
          >
            <div className="flex items-center">
              <Settings size={16} className="mr-3" /> Settings
            </div>
            <ChevronRight size={14} />
          </button>
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
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-gray-100 p-8 shadow-sm"
            >
              <h3 className="text-lg font-display font-bold uppercase tracking-widest mb-8">
                Account Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Full Name
                  </label>
                  <p className="text-sm font-medium border-b border-gray-100 pb-2">
                    {profile?.full_name || "Not provided"}
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
                    {profile?.address || "No address saved"}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <p className="text-sm font-medium border-b border-gray-100 pb-2">
                    {profile?.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <button className="btn-primary mt-12">Edit Profile</button>
            </motion.div>
          )}

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
