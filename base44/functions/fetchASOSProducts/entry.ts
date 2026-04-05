import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const RAPIDAPI_HOST = 'asos2.p.rapidapi.com';

// Category IDs confirmed working with /products/v2/list
const CATEGORIES = [
  { categoryId: '4169', categoryName: 'tops' },
  { categoryId: '2623', categoryName: 'dresses' },
  { categoryId: '2640', categoryName: 'bottoms' },   // women's pants & leggings
  { categoryId: '4172', categoryName: 'outerwear' },
  { categoryId: '4209', categoryName: 'shoes' },
  { categoryId: '4177', categoryName: 'bags' },       // bags & purses
  { categoryId: '4174', categoryName: 'accessories' },
];

function guessPriceTier(price) {
  if (price < 30) return 'budget';
  if (price < 80) return 'mid_range';
  if (price < 200) return 'premium';
  return 'luxury';
}

function guessStyleTags(name) {
  const lower = name.toLowerCase();
  const tags = [];
  if (lower.includes('mini') || lower.includes('crop')) tags.push('trendy');
  if (lower.includes('linen') || lower.includes('cotton')) tags.push('casual');
  if (lower.includes('satin') || lower.includes('silk') || lower.includes('velvet')) tags.push('elegant');
  if (lower.includes('denim')) tags.push('casual');
  if (lower.includes('floral') || lower.includes('print')) tags.push('bohemian');
  if (lower.includes('oversized') || lower.includes('baggy')) tags.push('streetwear');
  if (lower.includes('ribbed') || lower.includes('knit')) tags.push('cozy');
  if (lower.includes('blazer') || lower.includes('tailored')) tags.push('minimalist');
  if (lower.includes('boho') || lower.includes('wrap')) tags.push('romantic');
  if (tags.length === 0) tags.push('everyday');
  return tags.slice(0, 3);
}

Deno.serve(async (req) => {
  const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');
  if (!RAPIDAPI_KEY) {
    return Response.json({ error: 'RAPIDAPI_KEY secret not configured' }, { status: 500 });
  }

  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const results = [];

  for (const { categoryId, categoryName } of CATEGORIES) {
    const url = `https://${RAPIDAPI_HOST}/products/v2/list?store=US&offset=0&categoryId=${categoryId}&limit=10&country=US&sort=freshness&currency=USD&sizeSchema=US&lang=en-US`;

    const res = await fetch(url, {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });

    const rawText = await res.text();
    if (!res.ok || !rawText.trim()) {
      console.error(`Failed for "${categoryName}": ${res.status}`);
      continue;
    }

    let data;
    try { data = JSON.parse(rawText); } catch (_) { continue; }

    const products = data?.products || [];
    console.log(`"${categoryName}": ${products.length} products`);

    for (const p of products.slice(0, 8)) {
      const price = p.price?.current?.value ?? 0;
      const rawImageUrl = p.imageUrl || p.images?.[0]?.url || '';
      const imageUrl = rawImageUrl && !rawImageUrl.startsWith('http') ? `https://${rawImageUrl}` : rawImageUrl;
      const title = p.name || '';
      const brand = p.brandName || 'ASOS';
      const color = p.colour || '';
      const sourceUrl = p.id ? `https://www.asos.com/us/prd/${p.id}` : '';
      if (!title || !imageUrl) continue;

      results.push({
        title, brand, category: categoryName,
        price: parseFloat(price) || 0,
        price_tier: guessPriceTier(parseFloat(price) || 0),
        color, image_url: imageUrl, source_url: sourceUrl,
        style_tags: guessStyleTags(title),
        likes_count: 0,
      });
    }
  }

  if (results.length === 0) {
    return Response.json({ success: false, count: 0, message: 'No products fetched.' });
  }

  // Clear old items and insert fresh ones
  const existing = await base44.asServiceRole.entities.ClothingItem.list('-created_date', 500);
  for (const item of existing) {
    await base44.asServiceRole.entities.ClothingItem.delete(item.id);
  }
  for (const item of results) {
    await base44.asServiceRole.entities.ClothingItem.create(item);
  }

  return Response.json({ success: true, count: results.length, message: `Synced ${results.length} products from ASOS` });
});