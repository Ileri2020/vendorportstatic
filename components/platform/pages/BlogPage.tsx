"use client";

/**
 * BlogPage — static layout, posts fetched from DB via currentBusiness
 * Rendered at: vendorport.com/[store-name]/blog
 */

import { motion } from "framer-motion";
import { useAppContext } from "@/hooks/useAppContext";
import Posts from "@/components/myComponents/subs/posts";
import { AdminEditable } from "@/components/utility/AdminEditable";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BlogPage() {
  const { currentBusiness } = useAppContext();
  const ss = currentBusiness?.siteSettings;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      className="w-full"
    >
      {/* Hero */}
      <section className="w-full py-20 px-4 bg-gradient-to-br from-accent/5 via-background to-background border-b">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold">
            <FileText className="h-4 w-4" /> Blog &amp; Insights
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
            Latest <span className="text-accent">Updates</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Knowledge base and updates from {currentBusiness?.name || "our team"}.
          </p>
        </div>
      </section>

      {/* Newsletter strip */}
      <section className="w-full py-12 px-4 bg-accent text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <AdminEditable
              as="h3"
              value={ss?.newsletterTitle || "Join our Newsletter"}
              model="siteSettings"
              id={ss?.id || ""}
              field="newsletterTitle"
              className="text-2xl font-black uppercase tracking-widest"
            />
            <AdminEditable
              as="p"
              value={ss?.newsletterText || "Be the first to know about new arrivals and exclusive offers."}
              model="siteSettings"
              id={ss?.id || ""}
              field="newsletterText"
              className="text-white/80"
            />
          </div>
          <div className="flex w-full md:w-auto gap-3 items-center">
            <Input
              placeholder="your@email.com"
              className="bg-white/10 border-white/20 h-12 rounded-2xl w-full md:w-64 placeholder:text-white/50 font-bold text-white"
            />
            <Button className="h-12 px-8 rounded-2xl bg-white text-accent font-black hover:bg-white/90 shrink-0">
              Join
            </Button>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Posts page="General" />
        </div>
      </section>
    </motion.div>
  );
}
