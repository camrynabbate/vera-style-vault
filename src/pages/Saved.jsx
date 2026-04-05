import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Skeleton } from '@/components/ui/skeleton';
import FeedGrid from '@/components/feed/FeedGrid';
import usePreferences from '@/hooks/usePreferences';
import { Bookmark, Heart } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function Saved() {
  const { likedIds, savedIds, recordPreference } = usePreferences();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['clothingItems'],
    queryFn: () => base44.entities.ClothingItem.list('-created_date', 200),
  });

  const savedItems = useMemo(() => items.filter(item => savedIds.has(item.id)), [items, savedIds]);
  const likedItems = useMemo(() => items.filter(item => likedIds.has(item.id)), [items, likedIds]);

  const EmptyState = ({ icon: Icon, text }) => (
    <div className="text-center py-20">
      <Icon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
      <p className="font-serif text-lg text-muted-foreground italic">{text}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
          Your Collection
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Items you've saved and loved
        </p>
      </div>

      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="bg-secondary mb-8">
          <TabsTrigger value="saved" className="gap-2">
            <Bookmark className="w-4 h-4" /> Saved ({savedItems.length})
          </TabsTrigger>
          <TabsTrigger value="liked" className="gap-2">
            <Heart className="w-4 h-4" /> Liked ({likedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved">
          {isLoading ? (
            <div className="columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="break-inside-avoid">
                  <Skeleton className="aspect-[3/4] rounded-xl" />
                </div>
              ))}
            </div>
          ) : savedItems.length === 0 ? (
            <EmptyState icon={Bookmark} text="No saved items yet — tap the bookmark icon on any item" />
          ) : (
            <FeedGrid
              items={savedItems}
              likedIds={likedIds}
              savedIds={savedIds}
              onLike={(item) => recordPreference(item, 'like')}
              onDislike={(item) => recordPreference(item, 'dislike')}
              onSave={(item) => recordPreference(item, 'save')}
            />
          )}
        </TabsContent>

        <TabsContent value="liked">
          {isLoading ? (
            <div className="columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="break-inside-avoid">
                  <Skeleton className="aspect-[3/4] rounded-xl" />
                </div>
              ))}
            </div>
          ) : likedItems.length === 0 ? (
            <EmptyState icon={Heart} text="No liked items yet — double-tap any item to like it" />
          ) : (
            <FeedGrid
              items={likedItems}
              likedIds={likedIds}
              savedIds={savedIds}
              onLike={(item) => recordPreference(item, 'like')}
              onDislike={(item) => recordPreference(item, 'dislike')}
              onSave={(item) => recordPreference(item, 'save')}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}