import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SavedItemsPanel({ items }) {
  const [search, setSearch] = useState('');

  const filtered = items.filter(item =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-52 lg:w-64 shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
      <div className="p-3 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your Items</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="h-7 pl-7 text-xs bg-secondary border-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8 italic">
            {items.length === 0 ? 'Save items from the feed first' : 'No results'}
          </p>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              className="flex items-center gap-2 p-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-secondary transition-colors group select-none"
              title={`${item.brand} – ${item.title}`}
            >
              <div className="w-10 h-12 rounded-md overflow-hidden bg-secondary shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{item.brand}</p>
                {item.price && (
                  <p className="text-[10px] text-accent font-medium">${item.price}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}