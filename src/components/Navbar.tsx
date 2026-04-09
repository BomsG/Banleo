import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Heart,
  ChevronDown,
} from "lucide-react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    if (!supabase) return;

    const checkAdmin = async (userId: string) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .maybeSingle();
      setIsAdmin(!!profile?.is_admin);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) checkAdmin(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleAccountClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const toggleMobileSubmenu = (menu: string) => {
    setActiveMobileSubmenu(activeMobileSubmenu === menu ? null : menu);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-10 py-4 bg-black text-white",
      )}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Logo & Desktop Nav Left */}
        <div className="flex items-center space-x-10">
          <Link to="/" className="flex items-center group">
            <img src="/images/logo.png" className="w-20 md:w-40" />
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/brand" className="nav-link">
              Brand
            </Link>
            <Link to="/shop" className="nav-link">
              New Arrivals
            </Link>

            {/* Men Mega Menu */}
            <div className="group">
              <Link
                to="/shop?category=men"
                className="nav-link flex items-center py-4"
              >
                Men{" "}
                <ChevronDown
                  size={12}
                  className="ml-1 transition-transform group-hover:rotate-180"
                />
              </Link>
              <div className="absolute top-full left-0 w-full bg-black border-t border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="max-w-[1600px] mx-auto px-10 py-12 grid grid-cols-5 gap-10">
                  <div className="col-span-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-6">
                      Clothing
                    </h3>
                    <ul className="space-y-4">
                      <li>
                        <Link
                          to="/shop?category=men&type=t-shirts"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          T-Shirts
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=men&type=shirts"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Shirts
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=men&type=pants"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Pants
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=men&type=outerwear"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Outerwear
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=men&type=sets"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Two-Piece Sets
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-6">
                      Accessories
                    </h3>
                    <ul className="space-y-4">
                      <li>
                        <Link
                          to="/shop?category=men&type=bags"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Bags
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=men&type=hats"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Hats
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=men&type=jewelry"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Jewelry
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-6">
                      Featured
                    </h3>
                    <ul className="space-y-4">
                      <li>
                        <Link
                          to="/shop?category=men&filter=best-sellers"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Best Sellers
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=men&filter=new-arrivals"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          New Arrivals
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=men&filter=sale"
                          className="text-[11px] text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors"
                        >
                          Sale
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="relative aspect-[4/5] overflow-hidden group/item">
                      <img
                        src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop"
                        alt="Men Featured"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                          New Collection
                        </span>
                      </div>
                    </div>
                    <div className="relative aspect-[4/5] overflow-hidden group/item">
                      <img
                        src="https://images.unsplash.com/photo-1550246140-29f40b909e5a?q=80&w=800&auto=format&fit=crop"
                        alt="Men Sale"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                          Essentials
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Women Mega Menu */}
            <div className="group">
              <Link
                to="/shop?category=women"
                className="nav-link flex items-center py-4"
              >
                Women{" "}
                <ChevronDown
                  size={12}
                  className="ml-1 transition-transform group-hover:rotate-180"
                />
              </Link>
              <div className="absolute top-full left-0 w-full bg-black border-t border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="max-w-[1600px] mx-auto px-10 py-12 grid grid-cols-5 gap-10">
                  <div className="col-span-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-6">
                      Clothing
                    </h3>
                    <ul className="space-y-4">
                      <li>
                        <Link
                          to="/shop?category=women&type=dresses"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Dresses
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=women&type=tops"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Tops
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=women&type=skirts"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Skirts
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=women&type=outerwear"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Outerwear
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=women&type=sets"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Two-Piece Sets
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-6">
                      Accessories
                    </h3>
                    <ul className="space-y-4">
                      <li>
                        <Link
                          to="/shop?category=women&type=bags"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Bags
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=women&type=jewelry"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Jewelry
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=women&type=shoes"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Shoes
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-6">
                      Featured
                    </h3>
                    <ul className="space-y-4">
                      <li>
                        <Link
                          to="/shop?category=women&filter=best-sellers"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          Best Sellers
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=women&filter=new-arrivals"
                          className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          New Arrivals
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop?category=women&filter=sale"
                          className="text-[11px] text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors"
                        >
                          Sale
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="relative aspect-[4/5] overflow-hidden group/item">
                      <img
                        src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
                        alt="Women Featured"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                          New Season
                        </span>
                      </div>
                    </div>
                    <div className="relative aspect-[4/5] overflow-hidden group/item">
                      <img
                        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
                        alt="Women Lookbook"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                          Lookbook
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/collections" className="nav-link">
              Collections
            </Link>
            <Link to="/lookbook" className="nav-link">
              Lookbook
            </Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link text-red-500 font-bold">
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Search & Icons Right */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="hidden md:flex">
            {/* Search Bar - Desktop */}
            <form
              onSubmit={handleSearch}
              className=" search-bar border-white/10 "
            >
              <Search size={14} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent  border-none outline-none text-[10px] w-full placeholder:text-gray-500 font-bold tracking-widest uppercase"
              />
            </form>
          </div>
          <div className=" flex items-center space-x-3 md:space-x-5 ">
            <button className="md:hidden hover:text-gray-400 transition-colors">
              <Search size={18} />
            </button>
            <button
              onClick={handleAccountClick}
              className="hover:text-gray-400 transition-colors"
            >
              <User size={18} />
            </button>
            <Link
              to="/wishlist"
              className="hover:text-gray-400 transition-colors relative"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-black">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="hover:text-gray-400 transition-colors relative"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-black">
                  {cartCount}
                </span>
              )}
            </Link>{" "}
          </div>
        </div>
        <button
          className="lg:hidden hover:text-gray-400 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black z-[60] lg:hidden flex flex-col pt-24 px-8 text-white overflow-y-auto">
          <button
            className="absolute top-6 right-6"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={32} />
          </button>

          <div className="flex flex-col space-y-6">
            <Link
              to="/brand"
              className="nav-link text-xl text-left"
              onClick={() => setIsMenuOpen(false)}
            >
              Brand
            </Link>
            <Link
              to="/shop"
              className="nav-link text-xl text-left"
              onClick={() => setIsMenuOpen(false)}
            >
              New Arrivals
            </Link>

            {/* Men Accordion */}
            <div>
              <button
                onClick={() => toggleMobileSubmenu("men")}
                className="nav-link text-xl w-full flex justify-between items-center"
              >
                Men{" "}
                <ChevronDown
                  size={20}
                  className={cn(
                    "transition-transform",
                    activeMobileSubmenu === "men" && "rotate-180",
                  )}
                />
              </button>
              {activeMobileSubmenu === "men" && (
                <div className="mt-4 ml-4 flex flex-col space-y-4 border-l border-white/10 pl-4">
                  <Link
                    to="/shop?category=men&type=t-shirts"
                    className="text-sm uppercase tracking-widest text-gray-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    T-Shirts
                  </Link>
                  <Link
                    to="/shop?category=men&type=shirts"
                    className="text-sm uppercase tracking-widest text-gray-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shirts
                  </Link>
                  <Link
                    to="/shop?category=men&type=pants"
                    className="text-sm uppercase tracking-widest text-gray-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pants
                  </Link>
                  <Link
                    to="/shop?category=men&type=sets"
                    className="text-sm uppercase tracking-widest text-gray-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Two-Piece Sets
                  </Link>
                  <Link
                    to="/shop?category=men"
                    className="text-sm uppercase tracking-widest text-white font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shop All Men
                  </Link>
                </div>
              )}
            </div>

            {/* Women Accordion */}
            <div>
              <button
                onClick={() => toggleMobileSubmenu("women")}
                className="nav-link text-xl w-full flex justify-between items-center"
              >
                Women{" "}
                <ChevronDown
                  size={20}
                  className={cn(
                    "transition-transform",
                    activeMobileSubmenu === "women" && "rotate-180",
                  )}
                />
              </button>
              {activeMobileSubmenu === "women" && (
                <div className="mt-4 ml-4 flex flex-col space-y-4 border-l border-white/10 pl-4">
                  <Link
                    to="/shop?category=women&type=dresses"
                    className="text-sm uppercase tracking-widest text-gray-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dresses
                  </Link>
                  <Link
                    to="/shop?category=women&type=tops"
                    className="text-sm uppercase tracking-widest text-gray-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tops
                  </Link>
                  <Link
                    to="/shop?category=women&type=skirts"
                    className="text-sm uppercase tracking-widest text-gray-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Skirts
                  </Link>
                  <Link
                    to="/shop?category=women&type=sets"
                    className="text-sm uppercase tracking-widest text-gray-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Two-Piece Sets
                  </Link>
                  <Link
                    to="/shop?category=women"
                    className="text-sm uppercase tracking-widest text-white font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shop All Women
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/collections"
              className="nav-link text-xl text-left"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              to="/lookbook"
              className="nav-link text-xl text-left"
              onClick={() => setIsMenuOpen(false)}
            >
              Lookbook
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="nav-link text-xl text-left text-red-500 font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            <div className="flex items-center space-x-3 md:space-x-5">
              <button
                onClick={handleAccountClick}
                className="hover:text-gray-400 transition-colors"
              >
                <User size={18} />
              </button>
              <Link
                to="/wishlist"
                className="hover:text-gray-400 transition-colors relative"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-black">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="hover:text-gray-400 transition-colors relative"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-black">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="mt-auto pb-12 pt-12 border-t border-white/10">
            <div className="flex space-x-6 justify-center">
              <User
                size={24}
                onClick={handleAccountClick}
                className="cursor-pointer"
              />
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                <Heart size={24} className="cursor-pointer" />
              </Link>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                <ShoppingBag size={24} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
