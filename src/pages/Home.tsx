import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";
import { Product } from "../lib/types";

// ─── Reusable Category Tabs Section ────────────────────────────────────────────
interface CategoryTabsSectionProps {
  tabs: string[];
  initialTab: string;
  categoryFilters: Record<
    string,
    { column: string; value: string | boolean } | null
  >;
  viewAllLink?: string;
}

function CategoryTabsSection({
  tabs,
  initialTab,
  categoryFilters,
  viewAllLink = "/shop",
}: CategoryTabsSectionProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts(activeTab);
  }, [activeTab]);

  const fetchProducts = async (tab: string) => {
    setLoading(true);
    try {
      if (!supabase) return;
      const filter = categoryFilters[tab];
      let query = supabase.from("products").select("*").limit(4);

      if (filter) {
        if (filter.column === "category") {
          // category is now a text[] — use contains
          query = query.contains("category", [filter.value as string]);
        } else {
          query = query.eq(filter.column, filter.value);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-10 px-4 md:px-6 mb-4">
      {/* Tab Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[11px] font-bold tracking-[0.18em] uppercase whitespace-nowrap pb-2 transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button
            onClick={() => scroll("left")}
            className="w-7 h-7 border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-7 h-7 border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
          >
            <ChevronRight size={13} />
          </button>
          <Link
            to={viewAllLink}
            className="text-[10px] font-bold tracking-[0.18em] uppercase ml-1 hover:underline whitespace-nowrap"
          >
            VIEW ALL
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-[11px] uppercase tracking-widest text-gray-400">
          No products yet
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 overflow-x-auto scrollbar-hide"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative h-screen flex items-end overflow-hidden bg-[#1a1a1a] py-5">
        <img
          src="/images/bg.png"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-center opacity-70 pt-18"
          referrerPolicy="no-referrer"
        />
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

      {/* ── Best Sellers / New Arrivals ───────────────────────────────────────── */}
      <CategoryTabsSection
        tabs={["BEST SELLERS", "NEW ARRIVALS"]}
        initialTab="BEST SELLERS"
        categoryFilters={{
          "BEST SELLERS": null,
          "NEW ARRIVALS": { column: "is_new", value: true },
        }}
        viewAllLink="/shop"
      />

      {/* ── Men / Women Category Banners ──────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-4">
        <Link
          to="/shop?category=men"
          className="relative group overflow-hidden h-85 md:h-140"
        >
          <img
            src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1000&auto=format&fit=crop"
            alt="Men"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-start justify-end text-white p-8">
            <h3 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-2">
              Men
            </h3>
            <p className="text-[10px] uppercase tracking-[0.25em] mb-6 opacity-80">
              Modern fits tailored for everyday ease
            </p>
            <span className="bg-white text-black px-7 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              SHOP MEN
            </span>
          </div>
        </Link>
        <Link
          to="/shop?category=women"
          className="relative group overflow-hidden h-[340px] md:h-[560px]"
        >
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
            alt="Women"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-start justify-end text-white p-8">
            <h3 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-2">
              Women
            </h3>
            <p className="text-[10px] uppercase tracking-[0.25em] mb-6 opacity-80">
              Designed for confidence and style
            </p>
            <span className="bg-white text-black px-7 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              SHOP WOMEN
            </span>
          </div>
        </Link>
      </section>

      {/* ── Sleeveless / Singlet / Shirts / T-shirts ─────────────────────────── */}
      <CategoryTabsSection
        tabs={["SLEEVELESS", "SINGLET", "SHIRTS", "T-SHIRTS"]}
        initialTab="SLEEVELESS"
        categoryFilters={{
          SLEEVELESS: { column: "category", value: "sleeveless" },
          SINGLET: { column: "category", value: "singlet" },
          SHIRTS: { column: "category", value: "shirts" },
          "T-SHIRTS": { column: "category", value: "t-shirts" },
        }}
        viewAllLink="/shop?category=tops"
      />

      {/* ── Two-Piece / Sets / Pants / Undies ────────────────────────────────── */}
      <CategoryTabsSection
        tabs={["TWO-PIECE", "SETS", "PANTS", "UNDIES"]}
        initialTab="TWO-PIECE"
        categoryFilters={{
          "TWO-PIECE": { column: "category", value: "two-piece" },
          SETS: { column: "category", value: "sets" },
          PANTS: { column: "category", value: "pants" },
          UNDIES: { column: "category", value: "undies" },
        }}
        viewAllLink="/shop?category=bottoms"
      />

      {/* ── Scarf / Face Caps ────────────────────────────────────────────────── */}
      <CategoryTabsSection
        tabs={["SCARF", "FACE CAPS"]}
        initialTab="SCARF"
        categoryFilters={{
          SCARF: { column: "category", value: "scarf" },
          "FACE CAPS": { column: "category", value: "face-caps" },
        }}
        viewAllLink="/shop?category=accessories"
      />

      {/* ── Collections Banner ───────────────────────────────────────────────── */}
      <section className="relative h-120 md:h-145 flex items-center justify-center overflow-hidden mb-16">
        <img
          src="/images/collections.png"
          alt="Collections"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-6">
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-4">
            Collections
          </h2>
          <p className="text-[11px] font-medium tracking-widest uppercase mb-10 opacity-80">
            Discover looks made to fit your lifestyle.
          </p>
          <Link
            to="/collections"
            className="bg-white text-black px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            SHOP COLLECTIONS
          </Link>
        </div>
      </section>

      {/* ── Collections products ─────────────────────────────────────────────── */}
      <CategoryTabsSection
        tabs={["COLLECTIONS"]}
        initialTab="COLLECTIONS"
        categoryFilters={{
          COLLECTIONS: { column: "category", value: "collections" },
        }}
        viewAllLink="/collections"
      />

      {/* ── Newsletter ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white text-center border-y border-gray-100">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight mb-3">
            Sign Up To Our Newsletters
          </h2>
          <p className="text-[11px] text-gray-500 mb-10 uppercase tracking-widest">
            Access the latest drops and insider exclusives.
          </p>
          <div className="flex flex-col sm:flex-row gap-0">
            <input
              type="email"
              placeholder="Enter email"
              className="flex-1 bg-white border border-gray-200 px-6 py-4 text-[11px] tracking-widest uppercase focus:outline-none focus:border-black transition-colors"
            />
            <button
              type="button"
              className="bg-black text-white px-10 py-4 text-[11px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-all"
            >
              SIGN UP
            </button>
          </div>
        </div>
      </section>

      {/* ── Features / Support ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="flex flex-col items-center space-y-5">
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">
              Customer Support
            </h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
              We're here to help reach us by email Monday to Friday.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-5">
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
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">
              Secure Payment
            </h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
              Shop confidently with 100% encrypted checkout.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-5">
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
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">
              Have Questions?
            </h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
              Send us a note anytime at [banleo.com].
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
