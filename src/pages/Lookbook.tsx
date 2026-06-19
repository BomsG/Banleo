import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LookbookItem } from '../lib/types';

export default function Lookbook() {
  const [items, setItems] = useState<LookbookItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLookbookItems();
  }, []);

  const fetchLookbookItems = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('lookbook_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching lookbook items:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1600px] mx-auto w-full">
      <header className="mb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-6">Lookbook</h1>
        <p className="text-sm text-gray-500 uppercase tracking-[0.3em] font-bold">Curated Styles &amp; Editorial Stories</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-red-600" size={36} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 uppercase tracking-widest text-sm">No lookbook items yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative overflow-hidden aspect-[4/5] bg-gray-100"
            >
              <Link to={`/lookbook/${item.id}`} className="block w-full h-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                  <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {item.title}
                  </h2>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
