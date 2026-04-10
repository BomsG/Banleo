import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Minus,
  Plus,
  Heart,
  Share2,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { Product } from "../lib/types";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { cn, formatPrice } from "../lib/utils";

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
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);

      // Fetch related products — any other products excluding current one
      // Try to match by shared category first, fall back to all products
      const categories: string[] = Array.isArray(data.category)
        ? data.category
        : data.category
          ? [data.category]
          : [];

      let relatedData: Product[] = [];

      if (categories.length > 0) {
        // Get products that share at least one category
        const { data: catData, error: catError } = await supabase
          .from("products")
          .select("*")
          .contains("category", [categories[0]])
          .neq("id", data.id)
          .limit(4);

        if (!catError && catData && catData.length > 0) {
          relatedData = catData;
        }
      }

      // If no related by category found, just show other products
      if (relatedData.length === 0) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("products")
          .select("*")
          .neq("id", data.id)
          .limit(4);

        if (!fallbackError) {
          relatedData = fallbackData || [];
        }
      }

      setRelatedProducts(relatedData);
    } catch (error) {
      console.error("Error fetching product:", error);
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
          <p className="text-gray-500 uppercase tracking-widest mb-8">
            Product not found
          </p>
          <button onClick={() => navigate("/shop")} className="btn-primary">
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  const hasDiscount =
    typeof product.discount_percentage === "number" &&
    product.discount_percentage > 0;

  const discountedPrice = hasDiscount
    ? product.price * (1 - (product.discount_percentage as number) / 100)
    : null;

  const categories: string[] = Array.isArray(product.category)
    ? product.category
    : product.category
      ? [product.category as string]
      : [];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product, quantity, selectedSize);
    navigate("/cart");
  };

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-12">
          <button onClick={() => navigate("/")} className="hover:text-black">
            Home
          </button>
          <ChevronRight size={12} />
          <button
            onClick={() => navigate("/shop")}
            className="hover:text-black"
          >
            Shop
          </button>
          <ChevronRight size={12} />
          <span className="text-black">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Image */}
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
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              {/* Categories */}
              <div className="flex flex-wrap gap-1 mb-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-bold uppercase tracking-widest text-gray-500"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-display font-bold uppercase tracking-tighter mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3">
                {discountedPrice ? (
                  <>
                    <p className="text-2xl font-bold text-black">
                      {formatPrice(discountedPrice)}
                    </p>
                    <p className="text-lg text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </p>
                    <span className="text-xs font-bold bg-black text-white px-2 py-1 uppercase tracking-widest">
                      -{product.discount_percentage}%
                    </span>
                  </>
                ) : (
                  <p className="text-2xl font-bold">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description ||
                  `Experience unparalleled comfort and style with our premium ${product.name.toLowerCase()}. Crafted from high-quality materials, this piece is designed to elevate your everyday wardrobe.`}
              </p>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-bold uppercase tracking-widest">
                  Select Size
                </label>
                <button className="text-[10px] font-bold uppercase tracking-widest underline">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center text-xs font-bold border transition-all ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "border-gray-200 hover:border-black"
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
                <span className="mx-6 text-sm font-bold w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="hover:text-gray-400"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1 btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock_quantity === 0 ? "Sold Out" : "Add to Cart"}
              </button>
              <button
                onClick={handleWishlist}
                className={cn(
                  "p-4 border transition-colors",
                  isInWishlist(product.id)
                    ? "bg-red-600 text-white border-red-600"
                    : "border-gray-200 hover:bg-gray-50",
                )}
              >
                <Heart
                  size={20}
                  fill={isInWishlist(product.id) ? "currentColor" : "none"}
                />
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
                  isInWishlist(product.id) && "text-red-600",
                )}
              >
                <Heart
                  size={14}
                  className="mr-2"
                  fill={isInWishlist(product.id) ? "currentColor" : "none"}
                />
                {isInWishlist(product.id) ? "In Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Details Accordion */}
            <div className="mt-12 border-t border-gray-100 pt-8 space-y-6">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Materials & Care
                  </span>
                  <Plus size={16} className="group-open:hidden" />
                  <Minus size={16} className="hidden group-open:block" />
                </summary>
                <div className="mt-4 text-sm text-gray-500 leading-relaxed">
                  100% Premium Cotton. Machine wash cold with like colors.
                  Tumble dry low. Cool iron if needed.
                </div>
              </details>
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Shipping & Returns
                  </span>
                  <Plus size={16} className="group-open:hidden" />
                  <Minus size={16} className="hidden group-open:block" />
                </summary>
                <div className="mt-4 text-sm text-gray-500 leading-relaxed">
                  Free standard shipping on orders over $200. Returns accepted
                  within 30 days of purchase.
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h3 className="text-2xl font-display font-bold uppercase tracking-tight mb-12 text-center">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
