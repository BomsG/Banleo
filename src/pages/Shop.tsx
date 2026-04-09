import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, [categoryParam, sortBy, searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (!supabase) return;

      let query = supabase.from('products').select('*');

      if (categoryParam) {
        query = query.ilike('category', categoryParam);
      }

      const searchParam = searchParams.get('search');
      if (searchParam) {
        query = query.or(`name.ilike.%${searchParam}%,category.ilike.%${searchParam}%,description.ilike.%${searchParam}%`);
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
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tighter mb-4">
            {categoryParam ? `${categoryParam} Collection` : 'All Products'}
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
