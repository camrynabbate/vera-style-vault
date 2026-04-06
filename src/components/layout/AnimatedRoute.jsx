import { motion } from 'framer-motion';
import { Suspense } from 'react';

const variants = {
  push: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-30%', opacity: 0 },
  },
  pop: {
    initial: { x: '-30%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
  tab: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, position: 'absolute', top: 0, left: 0, right: 0 },
  },
};

function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-48 w-full">
      <div className="w-7 h-7 border-2 border-border border-t-foreground rounded-full animate-spin" />
    </div>
  );
}

export default function AnimatedRoute({ children, direction = 'tab' }) {
  const v = variants[direction] ?? variants.tab;

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      style={{ width: '100%' }}
    >
      <Suspense fallback={<PageSpinner />}>
        {children}
      </Suspense>
    </motion.div>
  );
}