import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function PullToRefreshIndicator({ pullDistance, isPulling }) {
  if (pullDistance === 0) return null;
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
      style={{ height: pullDistance, paddingTop: 'env(safe-area-inset-top)' }}
    >
      <motion.div
        animate={{ rotate: isPulling ? 180 : pullDistance * 2 }}
        transition={{ duration: 0.1 }}
        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${isPulling ? 'bg-accent text-accent-foreground' : 'bg-card text-muted-foreground'}`}
      >
        <RefreshCw className="w-4 h-4" />
      </motion.div>
    </div>
  );
}