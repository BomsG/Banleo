import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#1B1B1B] text-white pt-14 pb-10">
      {/* ── Top Section ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-0 mb-16">
        {/* Col 1 — Newsletter + Socials (left, narrower) */}
        <div className="lg:w-[280px] shrink-0">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3">
            Customer Service
          </h3>
          <p className="text-gray-400 text-[11px] leading-[1.8] mb-6">
            Receive updates on our latest products,
            <br />
            releases and exclusive partnerships.
          </p>

          {/* Email + Subscribe — flush, side by side */}
          <div className="flex mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-transparent border border-gray-600 px-4 py-[10px] text-[11px] text-white placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors min-w-0"
            />
            <button
              type="button"
              className="bg-white text-black px-5 py-[10px] text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-gray-200 transition-colors shrink-0 border border-white"
            >
              SUBSCRIBE
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {/* WhatsApp */}
            <a
              href="#"
              aria-label="WhatsApp"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="#"
              aria-label="Instagram"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* Threads */}
            <a
              href="#"
              aria-label="Threads"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 192 192"
                fill="currentColor"
              >
                <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.318-11.319 11.263-24.939 16.142-45.497 16.291-22.745-.168-39.949-7.453-51.147-21.664C39.981 143.508 34.79 127.07 34.62 96c.17-31.071 5.36-47.508 16.83-61.337C62.65 20.45 79.855 13.166 102.6 13h.34c22.795.168 40.592 7.477 52.933 21.71 6.223 7.11 10.792 15.959 13.573 26.317l16.147-4.308c-3.384-12.545-9.06-23.519-16.987-32.708C151.675 8.452 129.198-.068 102.94 0h-.402C76.37.07 54.483 8.59 39.589 24.959 26.062 39.866 19.609 60.624 19.408 96c.201 35.376 6.654 56.134 20.181 71.041 14.894 16.369 36.78 24.889 63.131 24.959h.402c23.317-.07 39.752-6.265 53.333-19.767 18.134-18.026 17.6-40.558 11.616-54.412-4.298-10.016-12.463-18.158-26.534-24.833Z" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a
              href="#"
              aria-label="X"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="#"
              aria-label="TikTok"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.78 1.52V6.82a4.85 4.85 0 01-1.01-.13z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Flex spacer */}
        <div className="hidden lg:block flex-1" />

        {/* Right 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-14 shrink-0">
          {/* Customer Service links */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-5 whitespace-nowrap">
              Customer Service
            </h3>
            <ul className="space-y-[10px]">
              {[
                { label: "Customer Care", to: "/contact" },
                { label: "Shipping", to: "/shipping" },
                { label: "Orders & Payments", to: "/orders" },
                { label: "Returns", to: "/returns" },
                { label: "FAQ", to: "/faq" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 text-[11px] hover:text-white transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-5">
              Company
            </h3>
            <ul className="space-y-[10px]">
              {[
                { label: "About Us", to: "/about" },
                { label: "Careers", to: "/careers" },
                { label: "Contact Us", to: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 text-[11px] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-5">
              Categories
            </h3>
            <ul className="space-y-[10px]">
              {[
                { label: "New arrivals", to: "/shop?filter=new" },
                { label: "Men", to: "/shop?category=men" },
                { label: "Women", to: "/shop?category=women" },
                { label: "Collections", to: "/collections" },
                { label: "Lookroom", to: "/lookroom" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 text-[11px] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-5">
              Policies
            </h3>
            <ul className="space-y-[10px]">
              {[
                { label: "Exchange Policy", to: "/exchange-policy" },
                { label: "Return Policy", to: "/return-policy" },
                { label: "Refund Policy", to: "/refund-policy" },
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Cookie Policy", to: "/cookie-policy" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 text-[11px] hover:text-white transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Full-width Logo Watermark ─────────────────────────────────────────── */}
      <div
        className="w-full overflow-hidden select-none pointer-events-none mb-6"
        style={{ opacity: 0.12 }}
      >
        <img
          src="/images/banleo.png"
          alt="Banleo"
          className="w-full object-contain"
          style={{ maxHeight: "220px" }}
        />
      </div>

      {/* ── Copyright ─────────────────────────────────────────────────────────── */}
      <p className="text-center text-[13px] text-gray-400 tracking-wide">
        © 2026 Bandleo. All rights reserved.
      </p>
    </footer>
  );
}
