"use client";

/**
 * CartPage — static layout, cart items from user session/context
 * Rendered at: vendorport.com/[store-name]/cart
 */

import { motion } from "framer-motion";
import { CartDetails } from "@/components/myComponents/subs/CartDetails";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      className="w-full"
    >
      <section className="w-full py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-bold">
              <ShoppingBag className="h-4 w-4" /> Your Bag
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Shopping Bag</h1>
            <p className="text-muted-foreground font-medium">
              Review your items before checkout.
            </p>
          </div>
          <CartDetails cartId="temp" />
        </div>
      </section>
    </motion.div>
  );
}
