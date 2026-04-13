import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, X, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";

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
    const t = setTimeout(onClose, 5000);
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

// ─── Main ────────────────────────────────────────────────────────────────────
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const navigate = useNavigate();

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      showToast("Supabase is not configured.", "error");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      const e = err as Error;
      showToast(
        e.message || "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-gray-50">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 shadow-xl"
      >
        <h2 className="banleo-logo text-center mb-8">BANLEO</h2>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-xl font-display font-bold uppercase tracking-widest text-center mb-3">
                Forgot Password
              </h3>
              <p className="text-xs text-gray-500 text-center uppercase tracking-widest mb-8">
                Enter your email and we'll send you a reset link
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-display font-bold uppercase tracking-widest mb-3">
                Check Your Email
              </h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed mb-8">
                We've sent a password reset link to{" "}
                <span className="text-black font-bold">{email}</span>. Check
                your inbox and follow the link to reset your password.
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">
                Didn't receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-black font-bold underline"
                >
                  try again
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={13} /> Back to Sign In
        </button>
      </motion.div>
    </div>
  );
}
