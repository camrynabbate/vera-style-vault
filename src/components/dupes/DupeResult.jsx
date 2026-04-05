import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, ShoppingBag } from 'lucide-react';

export default function DupeResult({ dupe, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border-border/50 hover:border-border transition-all hover:shadow-md">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {dupe.brand}
                </p>
              </div>
              <h3 className="text-base font-medium text-foreground">{dupe.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {dupe.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                  <DollarSign className="w-4 h-4 text-accent" />
                  ${dupe.price}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {dupe.where_to_buy}
                </span>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}