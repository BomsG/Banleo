import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface Section {
  heading: string;
  content: ReactNode;
}

interface PolicyPageProps {
  title: string;
  lastUpdated?: string;
  intro?: string;
  sections: Section[];
}

export default function PolicyPage({ title, lastUpdated, intro, sections }: PolicyPageProps) {
  return (
    <div className="pt-40 pb-32 px-6 max-w-3xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Header */}
        <div className="mb-16 border-b border-black/10 pb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4">Legal</p>
          <h1 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-4">{title}</h1>
          {lastUpdated && (
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Last updated: {lastUpdated}</p>
          )}
          {intro && (
            <p className="text-gray-600 leading-relaxed mt-6 text-base">{intro}</p>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-12"
            >
              <div className="pt-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="text-sm font-bold uppercase tracking-widest text-black leading-snug">
                  {section.heading}
                </h2>
              </div>
              <div className="text-gray-600 leading-relaxed text-sm space-y-4">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact footer */}
        <div className="mt-20 pt-10 border-t border-black/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Questions?</p>
          <p className="text-sm text-gray-600">
            Contact Banleofashion at{' '}
            <a href="mailto:support@banleofashion.com" className="underline underline-offset-2 hover:text-black transition-colors">
              support@banleofashion.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
