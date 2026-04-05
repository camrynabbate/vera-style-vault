import { AnimatePresence } from 'framer-motion';
import FeedCard from './FeedCard';

export default function FeedGrid({ items, likedIds, savedIds, onLike, onDislike, onSave, onOpen }) {
  return (
    <div className="columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <div key={item.id} className="break-inside-avoid">
            <FeedCard
              item={item}
              isLiked={likedIds.has(item.id)}
              isSaved={savedIds.has(item.id)}
              onLike={onLike}
              onDislike={onDislike}
              onSave={onSave}
              onOpen={onOpen}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}