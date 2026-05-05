"use client";

/**
 * StorefrontPage — the product catalog / store page
 *
 * Rendered at: vendorport.com/[store-name]  (default route)
 *
 * Static layout. Content (products, categories) fetched client-side using
 * currentBusiness from AppContext (set by the shared layout, no extra DB read).
 */

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Stocks from "@/components/myComponents/subs/stocks";
import FeaturedCategories from "@/components/myComponents/subs/featuredCategories";
import { useAppContext } from "@/hooks/useAppContext";
import { BusinessProductSearch } from "@/components/utility/BusinessProductSearch";
import { AIProductSearch } from "@/components/myComponents/subs/AIProductSearch";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function StorefrontPage() {
  const { currentBusiness } = useAppContext();
  const { storeName } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4, ease: "easeIn" } }}
      className="w-full min-h-screen"
    >
      {/* Categories strip */}
      <section className="w-full py-8 border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <FeaturedCategories businessId={currentBusiness?.id} />
        </div>
      </section>

      {/* AI search */}
      {currentBusiness?.id && (
        <section className="w-full py-10 px-4 bg-gradient-to-br from-background via-muted/30 to-background border-b shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
            <AIProductSearch businessId={currentBusiness.id}>
              <Button className="h-12 px-8 bg-accent hover:bg-accent/90 text-white font-black rounded-2xl shadow-lg gap-2">
                <Search className="h-5 w-5" /> Find Products with AI
              </Button>
            </AIProductSearch>
            <p className="text-sm text-muted-foreground">
              Snap a photo or describe what you&apos;re looking for
            </p>
          </div>
        </section>
      )}

      {/* Full product catalog */}
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-4xl font-black tracking-tighter">Our Catalog</h2>
            {currentBusiness?.id && (
              <BusinessProductSearch businessId={currentBusiness.id} />
            )}
          </div>
          {currentBusiness?.id ? (
            <Stocks businessId={currentBusiness.id} />
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              Loading store...
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
