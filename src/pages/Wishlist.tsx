import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlistItems, wishlistCount } = useWishlist();

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
      <header className="mb-12">
        <h1 className="text-4xl font-display font-bold uppercase tracking-tighter mb-4">Your Favorites</h1>
        <p className="text-sm text-gray-500 uppercase tracking-widest">
          {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved
        </p>
      </header>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-24 bg-gray-50">
          <div className="flex justify-center mb-6">
            <Heart size={48} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-display font-bold uppercase tracking-widest mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 text-sm mb-10">Save your favorite items to keep track of what you love.</p>
          <Link to="/shop" className="btn-primary inline-block">
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {wishlistItems.map((product, index) => (
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
      )}

      <div className="mt-16 pt-8 border-t border-gray-100">
        <Link to="/shop" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">
          <ArrowLeft size={14} className="mr-2" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
