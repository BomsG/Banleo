import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import ProductCard from './ProductCard';
import { cn } from '../lib/utils';

interface CategoryTabsSectionProps {
  title?: string;
  tabs: string[];
  initialTab?: string;
}

export default function CategoryTabsSection({ title, tabs, initialTab }: CategoryTabsSectionProps) {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('category', activeTab)
        .limit(8);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products for tab:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-6 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative py-2 whitespace-nowrap",
                activeTab === tab ? "text-black" : "text-gray-400 hover:text-black"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-100">
            <button 
              onClick={() => scroll('left')}
              className="p-3 hover:bg-gray-50 transition-colors border-r border-gray-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <Link 
            to={`/shop?category=${activeTab}`}
            className="bg-white border border-gray-200 px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="relative">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-red-600" size={32} />
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 overflow-x-auto no-scrollbar scroll-smooth"
          >
            <AnimatePresence mode="popLayout">
              {products.length > 0 ? (
                products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">No products found in this category.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
