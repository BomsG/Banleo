import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { Product } from "../lib/types";
import { cn, formatPrice } from "../lib/utils";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleQuickAdd = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, "M");
  };

  const handleWishlist = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link
        to={`/product/${product.id}`}
        className="block relative overflow-hidden aspect-[3/4] bg-gray-100"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300",
            isInWishlist(product.id)
              ? "bg-red-600 text-white"
              : "bg-white/80 text-black hover:bg-black hover:text-white",
          )}
        >
          <Heart
            size={16}
            fill={isInWishlist(product.id) ? "currentColor" : "none"}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discount_percentage && product.discount_percentage > 0 && (
            <span className="bg-white text-black text-[9px] font-bold px-2 py-1 uppercase tracking-widest border border-black/5 shadow-sm">
              -{product.discount_percentage}%
            </span>
          )}
          {product.stock_quantity === 0 && (
            <span className="bg-white text-black text-[9px] font-bold px-2 py-1 uppercase tracking-widest border border-black/5 shadow-sm">
              Sold Out
            </span>
          )}
          {product.is_new && (
            <span className="bg-black text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest">
              New
            </span>
          )}
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg"
          >
            Quick Add (M)
          </button>
        </div>
      </Link>

      <div className="mt-4 space-y-1">
        <Link
          to={`/product/${product.id}`}
          className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          {product.name}
        </Link>
        <p className="text-sm font-bold text-black">
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.div>
  );
}
