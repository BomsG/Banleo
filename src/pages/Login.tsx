import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, CheckCircle, AlertCircle, X } from "lucide-react";
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

// ─── Main ────────────────────────────────────────────────────────────────────
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });

  useEffect(() => {
    if (!supabase) {
      showToast(
        "Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
        "error",
      );
      return;
    }
    supabase.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: any } }) => {
        if (session) navigate(from, { replace: true });
      });
  }, [navigate, from]);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      showToast("Supabase is not configured.", "error");
      return;
    }
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        showToast(
          "Account created successfully! You can now sign in.",
          "success",
        );
        setTimeout(() => {
          setIsSignUp(false);
          setFullName("");
          setEmail("");
          setPassword("");
        }, 1500);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      const e = err as Error;
      const msg = e.message.includes("already registered")
        ? "An account with this email already exists. Try signing in."
        : e.message.includes("Invalid login credentials")
          ? "Incorrect email or password. Please try again."
          : e.message.includes("Password should be at least")
            ? "Password must be at least 6 characters."
            : e.message.includes("Unable to validate email address")
              ? "Please enter a valid email address."
              : e.message;
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      showToast("Supabase is not configured.", "error");
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + from,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const e = err as Error;
      showToast(e.message, "error");
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
        <h3 className="text-xl font-display font-bold uppercase tracking-widest text-center mb-8">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h3>

        <form onSubmit={handleAuth} className="space-y-6">
          {isSignUp && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Your full name"
              />
            </div>
          )}
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
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-black transition-colors pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 mt-4 disabled:opacity-50"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* <div className="mt-8">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 border-t border-gray-100" />
            <span className="relative z-10 bg-white px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Or
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full btn-secondary py-4 flex items-center justify-center"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-4 h-4 mr-3"
            />
            Continue with Google
          </button>
        </div> */}

        <div className="text-right mt-1">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setFullName("");
              setEmail("");
              setPassword("");
              setToast(null);
            }}
            className="font-bold text-black hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
