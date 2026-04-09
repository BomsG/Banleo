import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { Product } from '../lib/types';
import { formatPrice } from '../lib/utils';

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
      <h1 className="text-4xl font-display font-bold uppercase tracking-tighter mb-12">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 bg-gray-50">
          <div className="flex justify-center mb-6">
            <ShoppingBag size={48} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-display font-bold uppercase tracking-widest mb-4">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-10">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="btn-primary inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-6 pb-8 border-b border-gray-100">
                <div className="w-24 h-32 bg-gray-100 flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest mb-1">{item.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Size: {item.selectedSize || 'N/A'}</p>
                    </div>
                    <p className="text-sm font-bold">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-200 px-3 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                        className="text-xs"
                      >
                        -
                      </button>
                      <span className="mx-4 text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                        className="text-xs"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <Link to="/shop" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">
              <ArrowLeft size={14} className="mr-2" /> Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 sticky top-32">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-8">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest">Total</span>
                  <span className="text-xl font-bold">{formatPrice(cartTotal)}</span>
                </div>
              </div>
              <button 
                onClick={() => alert('Checkout functionality would be integrated here (e.g., Stripe).')}
                className="w-full btn-primary py-4"
              >
                Checkout
              </button>

              <p className="mt-6 text-[10px] text-gray-400 text-center uppercase tracking-widest">
                Shipping & taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

