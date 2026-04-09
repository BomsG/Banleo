import { motion } from 'motion/react';

interface StaticPageProps {
  title: string;
  content: string;
}

export default function StaticPage({ title, content }: StaticPageProps) {
  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-12">{title}</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            {content}
          </p>
          <div className="space-y-6 text-gray-500 leading-relaxed">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
              eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
