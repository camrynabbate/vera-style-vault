import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function scoreMatch(item, keywords) {
  let score = 0;
  const searchable = [
    item.title,
    item.brand,
    item.description,
    item.category,
    item.color,
    item.material,
    ...(item.style_tags || []),
  ].join(' ').toLowerCase();

  for (const kw of keywords) {
    if (searchable.includes(kw)) score += 1;
  }
  return score;
}

export default function FindDupes() {
  const [description, setDescription] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const { data: allItems = [] } = useQuery({
    queryKey: ['clothingItems'],
    queryFn: () => base44.entities.ClothingItem.list('-created_date', 500),
  });

  const handleSearch = () => {
    if (!description.trim()) return;
    setSearching(true);

    const keywords = description.toLowerCase()
      .split(/[\s,]+/)
      .filter(w => w.length > 2);

    // Only show items that have a source_url
    const scored = allItems
      .filter(item => item.source_url)
      .map(item => ({ ...item, _score: scoreMatch(item, keywords) }))
      .filter(item => item._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 10);

    setTimeout(() => {
      setResults(scored);
      setSearching(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
          Find Dupes
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Describe a piece you love — we'll find similar items you can actually buy
        </p>
      </div>

      {/* Search */}
      <div className="mb-10 space-y-4">
        <Textarea
          placeholder="e.g. 'black leather crossbody bag with gold chain' or 'casual white linen dress'"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px] text-sm resize-none bg-card border-border/60 rounded-2xl px-5 py-4 shadow-sm focus-visible:ring-1 focus-visible:ring-accent/50 placeholder:text-muted-foreground/50"
        />
        <Button
          onClick={handleSearch}
          disabled={!description.trim() || searching}
          className="gap-2"
        >
          {searching ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Searching...</>
          ) : (
            <><Search className="w-4 h-4" /> Find Dupes</>
          )}
        </Button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h2 className="font-serif text-xl font-semibold">
                {results.length} {results.length === 1 ? 'Match' : 'Matches'} Found
              </h2>
            </div>

            {results.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No matches yet. Try different keywords, or check back as we add more products.
              </p>
            ) : (
              <div className="grid gap-3">
                {results.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card hover:border-border hover:shadow-md transition-all group"
                    >
                      {/* Image */}
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-secondary shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs">
                            No img
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                          {item.brand || 'Unknown Brand'}
                        </p>
                        <h3 className="text-sm font-medium text-foreground mt-0.5 truncate">{item.title}</h3>
                        {item.price > 0 && (
                          <p className="text-sm font-semibold text-foreground mt-1">${item.price}</p>
                        )}
                        {item.style_tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.style_tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Shop link */}
                      <div className="shrink-0 text-muted-foreground group-hover:text-accent transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
