import { useState } from 'react';
import { Globe, Lock, Trash2, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { BottomSheet, BottomSheetItem } from '@/components/ui/BottomSheet';

export default function BoardCard({ board, onDelete }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const previews = (board.canvas_items || []).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative rounded-2xl border border-border/50 overflow-hidden bg-card hover:shadow-lg transition-all duration-300"
    >
      <Link to={`/styleboards/${board.id}`}>
        {/* Canvas preview */}
        <div
          className="aspect-[4/3] relative overflow-hidden"
          style={{ backgroundColor: board.background_color || '#FAF9F7' }}
        >
          {previews.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-serif text-muted-foreground/40 italic text-sm">Empty canvas</p>
            </div>
          ) : (
            <div className="absolute inset-0 grid grid-cols-2 gap-1 p-2">
              {previews.map((ci, i) => (
                <div key={i} className="rounded-lg overflow-hidden bg-secondary">
                  {ci.image_url ? (
                    <img src={ci.image_url} alt={ci.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-secondary" />
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Info */}
        <div className="p-4 pr-12">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-foreground text-sm">{board.title}</h3>
              {board.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{board.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1.5">
                {(board.canvas_items || []).length} items
              </p>
            </div>
            {board.is_shared ? (
              <Badge variant="secondary" className="text-[10px] gap-1 shrink-0">
                <Globe className="w-3 h-3" /> Shared
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] gap-1 shrink-0 text-muted-foreground">
                <Lock className="w-3 h-3" /> Private
              </Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Actions button — always visible, opens BottomSheet on mobile / inline on desktop */}
      <button
        aria-label="Board options"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSheetOpen(true); }}
        className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-all lg:opacity-0 lg:group-hover:opacity-100"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Mobile BottomSheet for board actions */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={board.title}>
        <BottomSheetItem
          onSelect={() => { setSheetOpen(false); onDelete(); }}
          destructive
        >
          <Trash2 className="w-4 h-4" />
          Delete Board
        </BottomSheetItem>
      </BottomSheet>
    </motion.div>
  );
}