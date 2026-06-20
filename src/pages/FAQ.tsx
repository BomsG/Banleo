import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'Do you only make custom outfits, or can I buy ready-to-wear pieces too?',
    a: "Both. Banleofashion offers ready-to-wear pieces you can order straight away, as well as made-to-order and fully custom pieces built to your measurements. Browse the shop for ready-to-wear, or reach out to us directly to start a custom order.",
  },
  {
    q: 'How long does a custom or made-to-order piece take to complete?',
    a: "Because these pieces are made specifically for you, production typically takes 7–14 business days, depending on the complexity of the design. We'll confirm an estimated timeline once your order and measurements are received.",
  },
  {
    q: 'How do I get my measurements right for a custom order?',
    a: "Once you place a custom order, our team will guide you through the measurements we need, either via a size guide or a short measurement call/chat. If you're unsure about anything, we're happy to help you get it right before production begins.",
  },
  {
    q: 'Do you deliver outside Nigeria?',
    a: "Currently, we deliver within Nigeria only, with international shipping coming soon. If you're outside Nigeria and want to place an order, contact us directly and we'll see what we can arrange.",
  },
  {
    q: "Can I return or exchange a custom-made piece if it doesn't fit?",
    a: "Made-to-order and custom pieces are final sale since they're created specifically for you. However, if your item arrives with a genuine defect or doesn't match what was ordered, contact us within 3 days of delivery and we'll make it right. See our Return and Exchange policies for full details.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="border-b border-black/10"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-7 text-left gap-6 group"
      >
        <div className="flex items-start gap-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pt-1 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-base font-bold uppercase tracking-tight group-hover:text-gray-600 transition-colors">
            {q}
          </span>
        </div>
        <div className="shrink-0 text-gray-400">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-7 pl-12 text-gray-500 leading-relaxed text-sm">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  useEffect(() => {
    document.title = "FAQ | Banleo";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute("content", "Find answers to frequently asked questions about Banleo custom tailored orders, shipping timelines, return policies, and ready-to-wear sizing.");
    }
  }, []);

  return (
    <div className="pt-40 pb-32 px-6 max-w-3xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4">Support</p>
        <h1 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tighter">
          Frequently Asked Questions
        </h1>
      </motion.div>

      <div className="border-t border-black/10">
        {faqs.map((faq, i) => (
          <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-20 p-10 bg-black text-white text-center"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Still have questions?</p>
        <p className="text-2xl font-display font-bold uppercase tracking-tighter mb-6">We're here to help.</p>
        <a
          href="mailto:support@banleofashion.com"
          className="inline-block border border-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
        >
          Contact Us
        </a>
      </motion.div>
    </div>
  );
}
