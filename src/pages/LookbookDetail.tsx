import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';
import { LOOKBOOK_ITEMS } from '../lib/constants';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import ProductCard from '../components/ProductCard';

export default function LookbookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const look = LOOKBOOK_ITEMS.find(item => item.id === id);
  const [lookProducts, setLookProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (look) {
      fetchLookProducts();
    }
  }, [look]);

  const fetchLookProducts = async () => {
    if (!look || !supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', look.products);
      
      if (error) throw error;
      setLookProducts(data || []);
    } catch (error) {
      console.error('Error fetching look products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!look) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-gray-500 uppercase tracking-widest mb-8">Look not found</p>
          <button onClick={() => navigate('/lookbook')} className="btn-primary">Back to Lookbook</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-12">
          <button onClick={() => navigate('/')} className="hover:text-black transition-colors">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate('/lookbook')} className="hover:text-black transition-colors">Lookbook</button>
          <ChevronRight size={12} />
          <span className="text-black">{look.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Main Look Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="aspect-[3/4] bg-gray-100 overflow-hidden"
          >
            <img 
              src={look.image} 
              alt={look.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Look Info */}
          <div className="flex flex-col justify-center max-w-xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-8 leading-[0.85]"
            >
              {look.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-gray-600 leading-relaxed mb-12"
            >
              {look.description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/lookbook" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">
                <ArrowLeft size={14} className="mr-2" /> Back to Lookbook
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Featured Products in this Look */}
        <section>
          <h2 className="text-2xl font-display font-bold uppercase tracking-tight mb-12 text-center">Shop the Look</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-red-600" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
              {lookProducts.map(product => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
