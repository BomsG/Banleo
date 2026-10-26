import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const typeParam = searchParams.get('type');
  const filterParam = searchParams.get('filter');
  const searchParam = searchParams.get('search');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  const formatCategoryTitle = (cat: string | null) => {
    if (!cat) return "All Products";
    if (cat.toLowerCase() === "pre-order") return "Pre-Order Collection";
    return `${cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ")} Collection`;
  };

  useEffect(() => {
    fetchProducts();
    const titleVal = categoryParam 
      ? `${formatCategoryTitle(categoryParam)} | Banleo`
      : "Shop | Banleo";
    document.title = titleVal;
    
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      const descVal = categoryParam === "pre-order"
        ? "Explore the exclusive Banleo Pre-Order collection. Secure limited-edition luxury bespoke pieces before official release."
        : categoryParam
        ? `Shop the luxury Banleo ${categoryParam} collection. Find tailored pieces, custom-made luxury options, and premium fabrics.`
        : "Browse the complete collection of luxury two-piece sets, tailored shirts, and everyday essentials from Banleo.";
      desc.setAttribute("content", descVal);
    }
  }, [categoryParam, typeParam, filterParam, sortBy, searchParam]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (!supabase) return;

      let query = supabase.from('products').select('*');

      if (categoryParam) {
        query = query.contains('category', [categoryParam]);
      }
      
      if (typeParam) {
        query = query.contains('category', [typeParam]);
      }

      if (filterParam === 'new-arrivals') {
        query = query.eq('is_new', true);
      } else if (filterParam === 'sale') {
        query = query.eq('is_sale', true);
      } // best-sellers might need order by sales, assuming we don't have it we just show all

      if (searchParam) {
        query = query.or(`name.ilike.%${searchParam}%,description.ilike.%${searchParam}%`);
      }

      if (sortBy === 'price-low') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price-high') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tighter mb-4">
            {formatCategoryTitle(categoryParam)}
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Showing {products.length} results
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort By:</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-b border-black text-xs font-bold uppercase tracking-widest py-1 focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </header>

      {/* Category / Collection Quick Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 text-[11px] font-bold uppercase tracking-widest">
        {[
          { label: "All", to: "/shop", active: !categoryParam && !filterParam },
          { label: "Pre-Order", to: "/shop?category=pre-order", active: categoryParam === "pre-order", highlight: true },
          { label: "Collections", to: "/shop?category=collections", active: categoryParam === "collections" },
          { label: "Men", to: "/shop?category=men", active: categoryParam === "men" },
          { label: "Women", to: "/shop?category=women", active: categoryParam === "women" },
          { label: "New Arrivals", to: "/shop?filter=new-arrivals", active: filterParam === "new-arrivals" },
          { label: "Sale", to: "/shop?filter=sale", active: filterParam === "sale" },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`px-4 py-2 border transition-all whitespace-nowrap ${
              item.active
                ? "bg-black text-white border-black shadow-sm"
                : item.highlight
                ? "bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/20"
                : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>


      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="animate-spin text-red-600" size={48} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-gray-500 uppercase tracking-widest mb-8">No products found.</p>
              <button 
                onClick={() => window.history.back()}
                className="btn-primary"
              >
                Go Back
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
