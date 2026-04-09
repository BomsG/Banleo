import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        {/* Brand & Newsletter */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center group mb-6">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-2 transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-lg leading-none">
                B
              </span>
            </div>
            <span className="banleo-logo text-white">ANLEO</span>
          </Link>
          <p className="text-gray-400 text-sm mb-8 max-w-xs">
            Effortless style for everyday confidence. Join our community for
            exclusive access and updates.
          </p>
          <div className="flex space-x-4">
            <Instagram
              size={20}
              className="text-gray-400 hover:text-white cursor-pointer"
            />
            <Twitter
              size={20}
              className="text-gray-400 hover:text-white cursor-pointer"
            />
            <Facebook
              size={20}
              className="text-gray-400 hover:text-white cursor-pointer"
            />
            <Youtube
              size={20}
              className="text-gray-400 hover:text-white cursor-pointer"
            />
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6">
            Shop
          </h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <Link to="/shop" className="hover:text-white">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/shop?category=men" className="hover:text-white">
                Men
              </Link>
            </li>
            <li>
              <Link to="/shop?category=women" className="hover:text-white">
                Women
              </Link>
            </li>
            <li>
              <Link to="/collections" className="hover:text-white">
                Collections
              </Link>
            </li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6">
            Information
          </h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <Link to="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-white">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6">
            Newsletter
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent border-b border-gray-700 py-2 text-sm w-full focus:outline-none focus:border-white transition-colors"
            />
            <button className="ml-4 text-xs font-bold uppercase tracking-widest hover:text-gray-400 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* <div className="max-w-7xl mx-auto border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest gap-4">
       
        <div className="flex space-x-6">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>Amex</span>
          <span>Apple Pay</span>
        </div>
      </div> */}

      <div className="mt-20 flex justify-center opacity-10 select-none pointer-events-none">
        <div>
          <img src="/images/logo.png" className="w-300" />
        </div>
      </div>
      <p className="text-[#F6F6F6] text-[18px] text-center">
        © 2026 BANLEO. All rights reserved.
      </p>
    </footer>
  );
}
