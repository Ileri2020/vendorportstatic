"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useState } from "react";
import Stocks from "@/components/myComponents/subs/stocks";
import FeaturedCategories from "@/components/myComponents/subs/featuredCategories";
import { useAppContext } from "@/hooks/useAppContext";
import { BusinessProductSearch } from "@/components/utility/BusinessProductSearch";
import { AIProductSearch } from "@/components/myComponents/subs/AIProductSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Sparkles, ChevronDown, X, Grid } from "lucide-react";

export default function StorefrontPage() {
  const { currentBusiness } = useAppContext();
  const { storeName } = useParams();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"categories" | "filters" | "ai" | null>(null);

  const toggleTab = (tab: "categories" | "filters" | "ai") => {
    setActiveTab(prev => prev === tab ? null : tab);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4, ease: "easeIn" } }}
      className="w-full min-h-screen bg-background"
    >
      {/* Unified Tab Bar */}
      <section className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b pt-4 pb-2 px-4">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center justify-between bg-muted/40 p-1 rounded-2xl border shadow-sm overflow-hidden">
            <button
              onClick={() => toggleTab("categories")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-tighter transition-all rounded-xl ${
                activeTab === "categories" ? "bg-white text-accent shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid className="h-3.5 w-3.5" /> Categories
            </button>
            <button
              onClick={() => toggleTab("filters")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-tighter transition-all rounded-xl ${
                activeTab === "filters" ? "bg-white text-accent shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Filter className="h-3.5 w-3.5" /> Filter
            </button>
            <button
              onClick={() => toggleTab("ai")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-tighter transition-all rounded-xl ${
                activeTab === "ai" ? "bg-white text-accent shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> AI Search
            </button>
          </div>
        </div>

        {/* Dropdown Content */}
        <AnimatePresence>
          {activeTab && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className="overflow-hidden"
            >
              <div className="max-w-md mx-auto py-6 space-y-6">
                {activeTab === "categories" && (
                  <div className="bg-white rounded-[2rem] border-2 border-accent/10 p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-black uppercase tracking-tighter text-sm">Select Category</h3>
                      <button onClick={() => setActiveTab(null)}><X className="h-4 w-4 text-muted-foreground"/></button>
                    </div>
                    <FeaturedCategories
                      businessId={currentBusiness?.id}
                      layout="tabs"
                      onCategorySelect={(cat) => {
                        setCategoryFilter(cat);
                        setActiveTab(null);
                      }}
                    />
                  </div>
                )}

                {activeTab === "filters" && (
                  <div className="bg-white rounded-[2rem] border-2 border-accent/10 p-6 shadow-2xl space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-black uppercase tracking-tighter text-sm">Refine Search</h3>
                      <button onClick={() => setActiveTab(null)}><X className="h-4 w-4 text-muted-foreground"/></button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="pl-11 h-12 rounded-2xl border-2 border-muted/50 focus:border-accent"
                      />
                    </div>
                    {currentBusiness?.id && (
                      <div className="pt-2">
                        <BusinessProductSearch businessId={currentBusiness.id} />
                      </div>
                    )}
                    <Button 
                      onClick={() => { setQuery(""); setCategoryFilter(undefined); setActiveTab(null); }}
                      variant="outline" 
                      className="w-full h-12 rounded-2xl border-2 font-bold"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}

                {activeTab === "ai" && (
                  <div className="bg-accent text-white rounded-[2rem] p-6 shadow-2xl shadow-accent/20 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-black uppercase tracking-tighter text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> AI Shopping Assistant
                      </h3>
                      <button onClick={() => setActiveTab(null)}><X className="h-4 w-4 text-white/60"/></button>
                    </div>
                    <p className="text-sm font-medium text-white/80 leading-relaxed">
                      Upload a photo or describe exactly what you need. Our AI will find the perfect match in our inventory.
                    </p>
                    {currentBusiness?.id && (
                      <AIProductSearch businessId={currentBusiness.id}>
                        <Button className="w-full h-14 bg-white text-accent hover:bg-white/90 font-black rounded-2xl shadow-xl gap-2">
                          <Search className="h-5 w-5" /> Launch AI Search
                        </Button>
                      </AIProductSearch>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Main Content Area */}
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Active Filter Header */}
          {(categoryFilter || query) && (
            <div className="mb-12 flex flex-wrap items-center gap-4">
              <div className="bg-accent/10 text-accent px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-accent/20">
                {categoryFilter || "All Products"} {query && `• "${query}"`}
                <button onClick={() => { setCategoryFilter(undefined); setQuery(""); }} className="hover:text-primary transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
            <div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
                Our <span className="text-accent">Collection</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl text-lg font-medium italic">
                &quot;Curated excellence for {currentBusiness?.name}. Find exactly what moves you.&quot;
              </p>
            </div>
          </div>

          {currentBusiness?.id ? (
            <Stocks
              businessId={currentBusiness.id}
              categoryFilter={categoryFilter}
              search={query}
            />
          ) : (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="font-bold uppercase tracking-widest text-xs">Hydrating Catalog...</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}

