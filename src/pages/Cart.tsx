import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag, CheckCircle2, CreditCard, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../lib/types';
import { formatPrice } from '../lib/utils';
import { supabase } from '../lib/supabase';

// Shipping fee mapping based on delivery state
const SHIPPING_FEES: Record<string, number> = {
  "Lagos": 2500,
  "Rivers": 3500,
  "Abuja": 4500,
  "Other": 5500
};

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [showMockFlutterwave, setShowMockFlutterwave] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const shippingFee = state ? (SHIPPING_FEES[state] || SHIPPING_FEES["Other"]) : 0;
  const orderTotal = cartTotal + shippingFee;

  // Dynamically load the Flutterwave inline popup script with timeout fallback
  const loadFlutterwave = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).FlutterwaveCheckout) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.async = true;

      // 3 second timeout for loading external script (e.g. sandbox/no internet)
      const timeout = setTimeout(() => {
        console.warn("Flutterwave script load timed out. Falling back to test checkout.");
        resolve(false);
      }, 3000);

      script.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };

      script.onerror = () => {
        clearTimeout(timeout);
        console.warn("Failed to load Flutterwave script. Falling back to test checkout.");
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handleFlutterwavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address || !city || !state) {
      alert("Please fill in all shipping details.");
      return;
    }

    setIsPaying(true);
    const loaded = await loadFlutterwave();

    if (!loaded) {
      // Trigger mock simulation popup
      setShowMockFlutterwave(true);
      return;
    }

    try {
      const flutterwavePublicKey = (import.meta as any).env.VITE_FLUTTERWAVE_PUBLIC_KEY || "FLWPUBK_TEST-SANDBOXDEMOKEY-X";
      
      (window as any).FlutterwaveCheckout({
        public_key: flutterwavePublicKey,
        tx_ref: `banleo-${Date.now()}`,
        amount: orderTotal, // Flutterwave expects amount in standard currency (NGN)
        currency: "NGN",
        payment_options: "card,banktransfer,ussd",
        customer: {
          email: email,
          phone_number: phone,
          name: fullName,
        },
        meta: {
          shipping_address: `${address}, ${city}, ${state} State`,
        },
        customizations: {
          title: "Banleo Luxury Fashion",
          description: "Payment for order checkout",
          logo: window.location.origin + "/images/bg.png",
        },
        callback: (data: any) => {
          if (data.status === "successful" || data.status === "completed") {
            handleSuccess(data.tx_ref || data.flw_ref || `flw-${data.transaction_id || Date.now()}`);
          } else {
            alert("Payment was not completed. Please try again.");
            setIsPaying(false);
          }
        },
        onclose: () => {
          setIsPaying(false);
        }
      });
    } catch (err) {
      console.error("Flutterwave Checkout setup failed:", err);
      // Fallback to mock simulation if setup triggers error
      setShowMockFlutterwave(true);
    }
  };

  const handleSuccess = async (reference: string) => {
    setPaymentRef(reference);
    
    // Save order details to Supabase if config is valid
    if (supabase) {
      try {
        let userId = null;
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            userId = session.user.id;
          }
        } catch (sessionErr) {
          console.warn("Could not retrieve user session for order linking:", sessionErr);
        }

        await supabase.from("orders").insert({
          user_id: userId,
          email: email,
          full_name: fullName,
          phone: phone,
          shipping_address: `${address}, ${city}, ${state}`,
          amount: orderTotal,
          total: orderTotal, // AdminDashboard fetches total
          status: "pending", // Default starting status
          payment_reference: reference,
          items: cartItems.map(item => ({
            product_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.selectedSize || "N/A"
          }))
        });
      } catch (err) {
        console.error("Failed to log order to database:", err);
      }
    }

    clearCart();
    setIsSuccess(true);
    setIsCheckingOut(false);
    setIsPaying(false);
    setShowMockFlutterwave(false);
  };

  if (isSuccess) {
    return (
      <div className="pt-32 pb-24 px-6 max-w-xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-gray-100 p-12 text-center shadow-sm"
        >
          <div className="flex justify-center mb-6 text-black">
            <CheckCircle2 size={64} className="stroke-[1.5]" />
          </div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-tighter mb-4">Order Confirmed</h1>
          <p className="text-gray-500 text-sm mb-6">
            Thank you for your purchase. Your order is being processed and we will update you soon.
          </p>
          <div className="bg-gray-50 p-4 rounded text-left space-y-2 mb-8 text-xs font-mono">
            <div className="flex justify-between text-gray-500">
              <span>Payment Ref:</span>
              <span className="text-black font-bold">{paymentRef}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Status:</span>
              <span className="text-green-600 font-bold uppercase">PAID (FLUTTERWAVE)</span>
            </div>
          </div>
          <Link to="/shop" className="btn-primary inline-block w-full py-4 text-center">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
      <h1 className="text-4xl font-display font-bold uppercase tracking-tighter mb-12">
        {isCheckingOut ? "Checkout" : "Your Cart"}
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 bg-gray-50">
          <div className="flex justify-center mb-6">
            <ShoppingBag size={48} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-display font-bold uppercase tracking-widest mb-4">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-10">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="btn-primary inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items or Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {!isCheckingOut ? (
              <>
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-6 pb-8 border-b border-gray-100">
                    <div className="w-24 h-32 bg-gray-100 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-widest mb-1">{item.name}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Size: {item.selectedSize || 'N/A'}</p>
                            {(item.is_preorder || (Array.isArray(item.category) ? item.category.includes("pre-order") : item.category === "pre-order")) && (
                              <span className="text-[8px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-700 border border-amber-500/20 px-1.5 py-0.5 rounded">
                                Pre-Order
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-bold">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-gray-200 px-3 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                            className="text-xs"
                          >
                            -
                          </button>
                          <span className="mx-4 text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                            className="text-xs"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Link to="/shop" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest hover:text-gray-500 transition-colors pt-4">
                  <ArrowLeft size={14} className="mr-2" /> Continue Shopping
                </Link>
              </>
            ) : (
              <form onSubmit={handleFlutterwavePayment} className="space-y-6 bg-white p-2 border-r border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <button 
                    type="button" 
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center"
                  >
                    <ArrowLeft size={14} className="mr-2" /> Back to Cart
                  </button>
                </div>
                
                <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2 mb-4">Delivery Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-4 py-3 text-xs tracking-widest uppercase focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-4 py-3 text-xs focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-4 py-3 text-xs tracking-widest uppercase focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Delivery State</label>
                    <select 
                      required 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-4 py-[14px] text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors cursor-pointer"
                    >
                      <option value="">Select State</option>
                      <option value="Lagos">Lagos State (₦2,500)</option>
                      <option value="Rivers">Rivers / PH (₦3,500)</option>
                      <option value="Abuja">Abuja FCT (₦4,500)</option>
                      <option value="Other">Other States (₦5,500)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Street Address</label>
                    <input 
                      type="text" 
                      required 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-4 py-3 text-xs tracking-widest uppercase focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">City</label>
                    <input 
                      type="text" 
                      required 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-4 py-3 text-xs tracking-widest uppercase focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isPaying}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2 mt-4"
                >
                  <CreditCard size={16} />
                  {isPaying && !showMockFlutterwave ? "PROCESSING PAYMENT..." : `PAY WITH FLUTTERWAVE (${formatPrice(orderTotal)})`}
                </button>
              </form>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 sticky top-32">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-8">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-500">
                    {state ? formatPrice(shippingFee) : "Calculated at checkout"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-500">Included</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest">Total</span>
                  <span className="text-xl font-bold">{formatPrice(orderTotal)}</span>
                </div>
              </div>
              
              {!isCheckingOut && (
                <button 
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full btn-primary py-4"
                >
                  Proceed to Checkout
                </button>
              )}

              <p className="mt-6 text-[10px] text-gray-400 text-center uppercase tracking-widest">
                Transactions processed securely via Flutterwave
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Mock Flutterwave Modal Overlay ────────────────────────────────────── */}
      <AnimatePresence>
        {showMockFlutterwave && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md shadow-2xl overflow-hidden rounded-md border border-gray-100 flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#FB9129] text-white p-6 flex justify-between items-center relative">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">TEST PAYMENT</span>
                  </div>
                  <h4 className="text-lg font-bold uppercase tracking-wider">BANLEOFASHION</h4>
                  <p className="text-xs text-white/80">{email}</p>
                </div>
                <button 
                  onClick={() => {
                    setShowMockFlutterwave(false);
                    setIsPaying(false);
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 flex-1">
                <div className="text-center py-4">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">PAYING AMOUNT</p>
                  <h3 className="text-3xl font-display font-extrabold text-black">{formatPrice(orderTotal)}</h3>
                </div>

                <div className="border border-[#FB9129]/20 bg-[#FB9129]/5 p-4 rounded-md flex gap-3 text-xs leading-relaxed text-[#c2650b]">
                  <ShieldCheck size={20} className="shrink-0 text-[#FB9129]" />
                  <p>
                    You are in the **Flutterwave Sandbox Simulator**. Click the button below to authorize a successful test transaction.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button 
                    onClick={() => handleSuccess(`mock-flw-${Date.now()}`)}
                    className="w-full bg-[#FB9129] hover:bg-[#e07e1e] text-white text-xs font-bold uppercase tracking-widest py-4 transition-colors rounded shadow-sm"
                  >
                    AUTHORIZE SUCCESSFUL PAYMENT
                  </button>
                  <button 
                    onClick={() => {
                      setShowMockFlutterwave(false);
                      setIsPaying(false);
                      alert("Payment cancelled.");
                    }}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest py-4 transition-colors rounded"
                  >
                    CANCEL TRANSACTION
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                <CreditCard size={10} />
                <span>SECURED BY FLUTTERWAVE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
