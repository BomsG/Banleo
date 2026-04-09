import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Minus, Plus, Heart, Share2, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { cn, formatPrice } from '../lib/utils';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setProduct(data);

      // Fetch related products
      const { data: relatedData, error: relatedError } = await supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(4);
      
      if (relatedError) throw relatedError;
      setRelatedProducts(relatedData || []);

    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-gray-500 uppercase tracking-widest mb-8">Product not found</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">Go to Shop</button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedSize);
    navigate('/cart');
  };

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-12">
          <button onClick={() => navigate('/')} className="hover:text-black">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate('/shop')} className="hover:text-black">Shop</button>
          <ChevronRight size={12} />
          <span className="text-black">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[3/4] bg-gray-100 overflow-hidden"
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[3/4] bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                  <img 
                    src={`https://picsum.photos/seed/product-${id}-${i}/600/800`} 
                    alt={`${product.name} view ${i}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{product.category}</h2>
              <h1 className="text-4xl font-display font-bold uppercase tracking-tighter mb-4">{product.name}</h1>
              <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || `Experience unparalleled comfort and style with our premium ${product.name.toLowerCase()}. Crafted from high-quality materials, this piece is designed to elevate your everyday wardrobe.`}
              </p>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-bold uppercase tracking-widest">Select Size</label>
                <button className="text-[10px] font-bold uppercase tracking-widest underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center text-xs font-bold border transition-all ${
                      selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-gray-200 px-4 py-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="hover:text-gray-400"
                >
                  <Minus size={16} />
                </button>
                <span className="mx-6 text-sm font-bold w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="hover:text-gray-400"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-4"
              >
                Add to Cart
              </button>

              <button 
                onClick={handleWishlist}
                className={cn(
                  "p-4 border transition-colors",
                  isInWishlist(product.id) ? "bg-red-600 text-white border-red-600" : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest">
              <button className="flex items-center hover:text-gray-500">
                <Share2 size={14} className="mr-2" /> Share
              </button>
              <button 
                onClick={handleWishlist}
                className={cn(
                  "flex items-center hover:text-gray-500",
                  isInWishlist(product.id) && "text-red-600"
                )}
              >
                <Heart size={14} className="mr-2" fill={isInWishlist(product.id) ? "currentColor" : "none"} /> 
                {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Details Accordion */}
            <div className="mt-12 border-t border-gray-100 pt-8 space-y-6">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-xs font-bold uppercase tracking-widest">Materials & Care</span>
                  <Plus size={16} className="group-open:hidden" />
                  <Minus size={16} className="hidden group-open:block" />
                </summary>
                <div className="mt-4 text-sm text-gray-500 leading-relaxed">
                  100% Premium Cotton. Machine wash cold with like colors. Tumble dry low. Cool iron if needed.
                </div>
              </details>
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-xs font-bold uppercase tracking-widest">Shipping & Returns</span>
                  <Plus size={16} className="group-open:hidden" />
                  <Minus size={16} className="hidden group-open:block" />
                </summary>
                <div className="mt-4 text-sm text-gray-500 leading-relaxed">
                  Free standard shipping on orders over $200. Returns accepted within 30 days of purchase.
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h3 className="text-2xl font-display font-bold uppercase tracking-tight mb-12 text-center">You May Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
              {relatedProducts.map(p => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
