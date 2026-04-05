import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function Admin() {
  const [asosStatus, setAsosStatus] = useState(null);
  const [asosMessage, setAsosMessage] = useState('');

  const [aiStatus, setAiStatus] = useState(null);
  const [aiMessage, setAiMessage] = useState('');
  const [aiProgress, setAiProgress] = useState('');

  const handleAsosSync = async () => {
    setAsosStatus('loading');
    setAsosMessage('');
    const response = await base44.functions.invoke('fetchASOSProducts', {});
    const data = response.data;
    if (data.success) {
      setAsosStatus('success');
      setAsosMessage(data.message);
    } else {
      setAsosStatus('error');
      setAsosMessage(data.message || data.error || 'Something went wrong.');
    }
  };

  const handleAiSync = async () => {
    setAiStatus('loading');
    setAiMessage('');
    setAiProgress('Generating products with AI...');

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a list of 60 realistic women's fashion clothing items across these categories: tops, bottoms, dresses, outerwear, shoes, bags, accessories (about 8-9 per category).

For each item provide:
- title: realistic product name (e.g. "Oversized Linen Blazer")
- brand: a real fashion brand (mix of: Zara, H&M, Mango, ASOS, Uniqlo, COS, & Other Stories, Massimo Dutti, Arket, Reformation, Free People, Anthropologie, Topshop, River Island, NA-KD, Monki, Weekday)
- category: one of tops, bottoms, dresses, outerwear, shoes, bags, accessories
- price: realistic price in USD (number only)
- price_tier: one of budget (under $30), mid_range ($30-$80), premium ($80-$200), luxury (over $200)
- color: primary color
- material: primary material
- style_tags: array of 2-3 tags from: minimalist, casual, elegant, bohemian, streetwear, trendy, cozy, classic, preppy, edgy, romantic, sporty
- description: one sentence product description
- image_url: a real working Unsplash image URL in format https://images.unsplash.com/photo-[ID]?w=600&q=80

Return exactly 60 items.`,
      response_json_schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                brand: { type: 'string' },
                category: { type: 'string' },
                price: { type: 'number' },
                price_tier: { type: 'string' },
                color: { type: 'string' },
                material: { type: 'string' },
                style_tags: { type: 'array', items: { type: 'string' } },
                description: { type: 'string' },
                image_url: { type: 'string' },
              },
            },
          },
        },
      },
    });

    const items = response?.items || [];

    if (items.length === 0) {
      setAiStatus('error');
      setAiMessage('AI did not return any items. Please try again.');
      setAiProgress('');
      return;
    }

    setAiProgress('Clearing old products...');
    const existing = await base44.entities.ClothingItem.list('-created_date', 500);
    for (const item of existing) {
      await base44.entities.ClothingItem.delete(item.id);
    }

    setAiProgress(`Saving ${items.length} new products...`);
    for (const item of items) {
      await base44.entities.ClothingItem.create({ ...item, likes_count: 0 });
    }

    setAiStatus('success');
    setAiMessage(`Successfully added ${items.length} products to the feed!`);
    setAiProgress('');
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold mb-2">Admin</h1>
      <p className="text-muted-foreground text-sm mb-10">Manage product data</p>

      {/* ASOS Sync Card */}
      <div className="border border-border rounded-2xl p-6 bg-card space-y-4 mb-6">
        <div>
          <h2 className="font-medium text-foreground">Sync from ASOS (Live Products)</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Fetches real products directly from ASOS via the RapidAPI integration.
          </p>
        </div>

        <Button
          onClick={handleAsosSync}
          disabled={asosStatus === 'loading'}
          className="gap-2 w-full"
        >
          {asosStatus === 'loading' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Syncing from ASOS...</>
          ) : (
            <><RefreshCw className="w-4 h-4" /> Sync ASOS Products</>
          )}
        </Button>

        {asosStatus === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            {asosMessage}
          </div>
        )}
        {asosStatus === 'error' && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            {asosMessage}
          </div>
        )}
      </div>

      {/* AI Fallback Card */}
      <div className="border border-border rounded-2xl p-6 bg-card space-y-4">
        <div>
          <h2 className="font-medium text-foreground">Generate with AI (Fallback)</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Uses AI to generate 60 realistic fashion items if ASOS sync is unavailable.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleAiSync}
          disabled={aiStatus === 'loading'}
          className="gap-2 w-full"
        >
          {aiStatus === 'loading' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {aiProgress || 'Working...'}</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate with AI</>
          )}
        </Button>

        {aiStatus === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            {aiMessage}
          </div>
        )}
        {aiStatus === 'error' && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            {aiMessage}
          </div>
        )}
      </div>
    </div>
  );
}