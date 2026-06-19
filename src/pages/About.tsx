import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const pillars = [
  {
    num: '01',
    title: 'CRAFT',
    desc: 'Every stitch, every seam is held to a single standard — it has to be right. We do not compromise on construction.',
  },
  {
    num: '02',
    title: 'DETAIL',
    desc: 'The things most people overlook are the things we obsess over. A perfect collar, a precise hem, the right weight of fabric.',
  },
  {
    num: '03',
    title: 'FIT',
    desc: 'Clothes that fit well look different. They carry differently. We design around the body, not around convenience.',
  },
];

const stats = [
  { value: '100%', label: 'Made To Order' },
  { value: 'PREMIUM', label: 'Luxury Fabrics' },
  { value: '∞', label: 'Fits Possible' },
];

export default function About() {
  return (
    <div className="bg-white text-black overflow-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pt-44 pb-28 px-6 md:px-20 max-w-[1400px] mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-10"
        >
          About Banleofashion
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-[clamp(3rem,9vw,8rem)] font-display font-bold uppercase tracking-tighter leading-[0.88] mb-0"
        >
          Built for the<br />
          ones who<br />
          <span className="text-gray-300">dress with</span><br />
          intention.
        </motion.h1>
      </section>

      {/* ── Horizontal rule with tagline ──────────────────────────────────────── */}
      <div className="border-t border-black/10 mx-6 md:mx-20" />
      <section className="py-10 px-6 md:px-20 max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400"
        >
          Intentional Design
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400"
        >
          Est. Banleofashion
        </motion.p>
      </section>
      <div className="border-t border-black/10 mx-6 md:mx-20" />

      {/* ── Story Block ──────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 md:px-20 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-6">Our Story</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter leading-tight">
            Shaped by craft.<br />Driven by detail.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="space-y-7 text-gray-600 leading-relaxed text-base"
        >
          <p>
            Banleofashion is a fashion house built for the ones who dress with intention. We design ready-to-wear and custom pieces for men and women who know that what they wear says something before they speak.
          </p>
          <p>
            We are shaped by craft, driven by detail, and held to one standard across everything we make: it has to fit well, look right, and feel like it was made for you.
          </p>
          <p>
            Our ready-to-wear line is for the days you want to get dressed and go. Our made-to-order and custom pieces are for the moments that call for something more personal — a cut designed around your body, your occasion, your taste.
          </p>
          <p className="text-black font-bold text-lg border-l-2 border-black pl-6">
            We don't chase trends. We make clothes that last beyond them.
          </p>
        </motion.div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-black/10 py-0">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="py-12 px-10 text-center"
            >
              <p className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-2">{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pillars ───────────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 md:px-20 max-w-[1400px] mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-16"
        >
          What We Stand For
        </motion.p>
        <div className="space-y-0 divide-y divide-black/10 border-y border-black/10">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="grid grid-cols-1 md:grid-cols-[120px_1fr_2fr] gap-6 md:gap-12 py-10 group"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pt-1">{p.num}</p>
              <h3 className="text-2xl font-display font-bold uppercase tracking-tighter">{p.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm max-w-lg">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Full-width closing statement ──────────────────────────────────────── */}
      <section className="bg-black text-white py-28 px-6 md:px-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.88]"
          >
            Shop the<br />
            collection.<br />
            <span className="text-gray-500">Or let us make</span><br />
            something<br />
            just for you.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
              Browse our ready-to-wear line or start a custom order built around your measurements, occasion, and taste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-block bg-white text-black px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors text-center"
              >
                Shop Now
              </Link>
              <Link
                to="/contact"
                className="inline-block border border-white/20 text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:border-white transition-colors text-center"
              >
                Custom Order
              </Link>
            </div>
            <div className="border-t border-white/10 pt-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Questions?</p>
              <a href="mailto:support@banleofashion.com" className="text-sm text-gray-300 hover:text-white transition-colors underline underline-offset-4">
                support@banleofashion.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
