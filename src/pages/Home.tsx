import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "../components/ProductCard";
import CategoryTabsSection from "../components/CategoryTabsSection";
import { supabase } from "../lib/supabase";
import { Product } from "../lib/types";

export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      if (!supabase) return;

      // Fetch New Arrivals
      const { data: newData, error: newError } = await supabase
        .from("products")
        .select("*")
        .eq("is_new", true)
        .limit(4);

      if (newError) throw newError;
      setNewArrivals(newData || []);

      // Fetch Best Sellers (mocking with first 4 products for now)
      const { data: bestData, error: bestError } = await supabase
        .from("products")
        .select("*")
        .limit(4);

      if (bestError) throw bestError;
      setBestSellers(bestData || []);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col ">
      {/* Hero Section */}
      <section className=" h-screen  flex items-end overflow-hidden bg-[#1a1a1a] py-5">
        <img
          src="/images/bg.png"
          alt="Hero"
          className="absolute inset-0 w-full h-full  object-center opacity-70 pt-18"
          referrerPolicy="no-referrer"
        />
        {/* <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent" /> */}

        <div className="relative z-10 text-left text-white px-6 md:px-20 max-w-5xl py-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-5xl lg:text-5xl font-display font-bold uppercase tracking-tighter mb-8 leading-[1.2]"
          >
            Effortless Style For
            <br />
            Everyday Confidence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg font-normal text-gray-300 mb-12 max-w-xl leading-relaxed"
          >
            Modern two-piece sets, tailored shirts, and everyday essentials
            designed for comfort, confidence, and culture.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/shop"
              className="inline-block bg-white text-black px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-all"
            >
              Shop New Arrivals
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BEST SELLERS / NEW ARRIVALS Tabs */}
      <CategoryTabsSection
        tabs={["BEST SELLERS", "NEW ARRIVALS"]}
        initialTab="BEST SELLERS"
      />

      {/* Categories Banner Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-16">
        <Link
          to="/shop?category=men"
          className="relative group overflow-hidden  md:h-[700px]"
        >
          <img
            src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1000&auto=format&fit=crop"
            alt="Men"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10 text-center">
            <h3 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-8">
              Men
            </h3>
            <p className="text-xs uppercase tracking-[0.3em] mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              New Season Essentials
            </p>
            <span className="bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              Shop Men
            </span>
          </div>
        </Link>
        <Link
          to="/shop?category=women"
          className="relative group overflow-hidden  md:h-[700px]"
        >
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
            alt="Women"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10 text-center">
            <h3 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-8">
              Women
            </h3>
            <p className="text-xs uppercase tracking-[0.3em] mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              Elevated Everyday Style
            </p>
            <span className="bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              Shop Women
            </span>
          </div>
        </Link>
      </section>

      {/* More Tabs */}
      <CategoryTabsSection
        tabs={["TWO-PIECE", "SETS", "PANTS", "UNDIES"]}
        initialTab="TWO-PIECE"
      />

      {/* Collections Banner */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden mb-16 mx-4">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="Collections"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-6">
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-6">
            Collections
          </h2>
          <p className="text-sm font-medium tracking-widest uppercase mb-10 opacity-80">
            Explore our curated seasonal collections.
          </p>
          <Link
            to="/collections"
            className="bg-white text-black px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            View Collections
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-6 bg-gray-50 text-center border-y border-gray-100">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight mb-4">
            Sign Up To Our Newsletters
          </h2>
          <p className="text-sm text-gray-500 mb-10 uppercase tracking-widest">
            Be the first to know about new arrivals, sales & exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="flex-1 bg-white border border-gray-200 px-6 py-4 text-[11px] font-bold tracking-widest uppercase focus:outline-none focus:border-black transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-10 py-4 text-[11px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-all"
            >
              Sign Up
            </button>
          </form>
        </div>
      </section>

      {/* Features / Support */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em]">
              Customer Support
            </h4>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest leading-relaxed">
              Our dedicated team is here to help you with any questions or
              concerns.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-6">
          <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em]">
              Secure Payment
            </h4>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest leading-relaxed">
              Your transactions are protected with industry-leading encryption
              and security.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-6">
          <div className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em]">
              Any Questions?
            </h4>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest leading-relaxed">
              Check our FAQ or contact us directly for personalized assistance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
