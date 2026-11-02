"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, Clock, Truck, Star, ShieldCheck, MapPin, 
  ShoppingCart, Search, Instagram, Phone, Mail, Grid, Sparkles, ChevronLeft, ChevronRight, Menu, User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { AdminEditable } from "@/components/utility/AdminEditable";
import FeaturedProducts from "@/components/myComponents/subs/featuredProducts";
import FeaturedCategories from "@/components/myComponents/subs/featuredCategories";
import { useAppContext } from "@/hooks/useAppContext";

/**
 * BusinessHomePage — The default premium home page for all businesses.
 * Implements the "Lois Spice" project design language.
 */
export default function BusinessHomePage() {
  const { currentBusiness, user } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotification, setShowNotification] = useState(true);
  const [isOrderNowFloating, setIsOrderNowFloating] = useState(false);

  // Default Lois slides
  const defaultSlides = [
    '/small chops 1.jpg',
    '/small chops 3.jpg',
    '/small chops 4.jpg',
    '/small chops 5.jpg',
    '/shawama pics 1.jpg',
  ];

  // Dynamically use business images or default Lois slides
  const productImages = currentBusiness?.products?.slice(0, 5).map((p: any) => p.images?.[0]).filter(Boolean) || [];
  const slides = productImages.length > 0 ? productImages : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsOrderNowFloating(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!currentBusiness) return null;

  return (
    <div className="relative w-full bg-background overflow-x-hidden">
      
      {/* 1. NOTIFICATION BAR (Lois Style) */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: -50 }}
            className="sticky top-0 z-[60] bg-accent text-white py-2.5 px-4 text-center text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-4"
          >
            <span>Free delivery on orders over ₦5,000 for {currentBusiness.name}</span>
            <button 
              onClick={() => setShowNotification(false)} 
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PREMIUM HERO CAROUSEL (Lois Style) */}
      <section className="relative h-[90vh] md:h-screen w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide]}
            alt="Slide"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Carousel Controls */}
        <Button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full h-12 w-12 p-0 z-20 border border-white/20"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </Button>
        <Button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full h-12 w-12 p-0 z-20 border border-white/20"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </Button>

        {/* CTA Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-4xl space-y-6"
          >
            <h1 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase drop-shadow-2xl">
              <AdminEditable 
                value={currentBusiness.siteSettings?.heroTitle || "Order Fresh Quality Online"} 
                model="siteSettings" 
                id={currentBusiness.siteSettings?.id || ""} 
                field="heroTitle" 
              />
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium italic drop-shadow-lg">
              <AdminEditable 
                value={currentBusiness.siteSettings?.heroSubtitle || "Delicious flavors from " + currentBusiness.name + " delivered to your doorstep."} 
                model="siteSettings" 
                id={currentBusiness.siteSettings?.id || ""} 
                field="heroSubtitle" 
              />
            </p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 justify-center pt-8"
            >
              <Link href="/store">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-10 h-16 text-lg font-black rounded-2xl shadow-2xl shadow-accent/20 gap-2">
                  Order Now <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/store">
                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-10 h-16 text-lg font-black rounded-2xl backdrop-blur-md">
                  View Menu
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentSlide ? 'w-10 bg-accent' : 'w-2.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 3. INFO SECTION (Lois Icons) */}
      <section className="w-full bg-background border-b py-12 px-4 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <motion.div whileHover={{ y: -5 }} className="space-y-3">
            <Clock className="h-10 w-10 mx-auto text-accent" />
            <h3 className="font-black uppercase tracking-widest text-sm">Mon-Sat: 8AM-8PM</h3>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">Closed on Sundays</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="space-y-3 border-y md:border-y-0 md:border-x border-muted/30 py-8 md:py-0">
            <Truck className="h-10 w-10 mx-auto text-accent" />
            <h3 className="font-black uppercase tracking-widest text-sm">Fast Delivery</h3>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">Within 30-60 minutes</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="space-y-3">
            <Star className="h-10 w-10 mx-auto text-accent" />
            <h3 className="font-black uppercase tracking-widest text-sm">Special Offers</h3>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">Save up to 20% weekly</p>
          </motion.div>
        </div>
      </section>

      {/* 4. STORY SECTION (Lois Passion) */}
      <section className="py-24 md:py-32 px-4 bg-muted/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter uppercase">
              Crafted with <span className="text-accent">Passion</span>,<br />
              Served with <span className="text-accent">Love</span>
            </h2>

            <div className="text-lg text-muted-foreground leading-relaxed font-medium italic">
              <AdminEditable 
                value={currentBusiness.siteSettings?.aboutText || "Bringing authentic quality to your home."} 
                model="siteSettings" 
                id={currentBusiness.siteSettings?.id || ""} 
                field="aboutText" 
                type="textarea"
              />
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="story" className="border-accent/10">
                <AccordionTrigger className="text-xl font-black uppercase tracking-tighter hover:text-accent">Our Story</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-lg py-4 leading-relaxed font-medium">
                  Founded with a dedication to quality and authenticity, {currentBusiness.name} has been serving premium products to the community with a focus on excellence and customer satisfaction.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="team" className="border-accent/10">
                <AccordionTrigger className="text-xl font-black uppercase tracking-tighter hover:text-accent">The Team</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-lg py-4 leading-relaxed font-medium">
                  Our experienced specialists work tirelessly to ensure every product meets our high standards before it reaches your hands.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link href="/store">
              <Button size="lg" className="h-14 px-10 bg-accent hover:bg-accent/90 text-white rounded-2xl font-black uppercase tracking-widest text-xs gap-2">
                Order Online <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Right: Sidebar / Gallery (Lois Style) */}
          <div className="bg-white rounded-[2.5rem] border shadow-2xl p-8 space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-x-10 -translate-y-10" />
             <h3 className="text-2xl font-black uppercase tracking-tighter">Why Choose Us?</h3>
             <div className="space-y-6">
                <div className="flex items-start gap-4">
                   <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0"><ShieldCheck /></div>
                   <div>
                      <h4 className="font-black uppercase text-xs tracking-widest">100% Natural</h4>
                      <p className="text-sm text-muted-foreground">No preservatives, just pure quality ingredients.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0"><Truck /></div>
                   <div>
                      <h4 className="font-black uppercase text-xs tracking-widest">Fast Delivery</h4>
                      <p className="text-sm text-muted-foreground">From our kitchen to yours in record time.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0"><Star /></div>
                   <div>
                      <h4 className="font-black uppercase text-xs tracking-widest">Award Winning</h4>
                      <p className="text-sm text-muted-foreground">Trusted by thousands of loyal customers.</p>
                   </div>
                </div>
             </div>

             <div className="pt-8 border-t space-y-4">
                <div className="flex items-center justify-between">
                   <p className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Instagram Feed</p>
                   <Link href="#" className="text-accent font-black text-[10px] uppercase tracking-widest hover:underline">Follow Us</Link>
                </div>
                <div className="grid grid-cols-3 gap-3">
                   {slides.slice(0, 3).map((img, i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:scale-110 transition-transform cursor-pointer">
                         <img src={img} alt="Feed" className="w-full h-full object-cover" />
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. MENU HIGHLIGHTS SECTION */}
      <section className="py-24 md:py-32 bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 space-y-16 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              The <span className="text-accent">Menu</span>
            </h2>
            <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto italic">
              Explore our delicious selection of authentic products.
            </p>
          </div>

          <FeaturedProducts 
            businessId={currentBusiness.id} 
            title="Featured Items" 
            storeName={currentBusiness.name} 
          />

          <div className="flex justify-center">
            <Link href="/store">
              <Button size="lg" className="h-16 px-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">
                See Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CATEGORY GRID SECTION */}
      <section className="py-24 md:py-32 bg-muted/20 border-t">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
           <div className="flex justify-between items-end">
              <h2 className="text-4xl font-black tracking-tighter uppercase">Categories</h2>
              <Link href="/store" className="text-accent font-black uppercase tracking-widest text-xs hover:underline">View All</Link>
           </div>
           <FeaturedCategories businessId={currentBusiness.id} layout="cards" />
        </div>
      </section>

      {/* 7. FLOATING "ORDER ONLINE" BUTTON (Lois Style) */}
      <AnimatePresence>
        {isOrderNowFloating && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 right-8 z-[100]"
          >
            <Link href="/store">
              <Button className="h-16 px-8 bg-accent hover:bg-accent/90 text-white shadow-2xl rounded-full font-black flex gap-3">
                <ShoppingCart className="h-5 w-5" />
                Order Online
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. NEWSLETTER (Lois Accent) */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-5xl mx-auto bg-accent rounded-[3rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex-1 space-y-4">
             <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Stay Updated</h3>
             <p className="text-white/80 font-medium">Subscribe to get special offers and updates from {currentBusiness.name}.</p>
          </div>
          <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-4">
             <Input 
                placeholder="your@email.com" 
                className="h-16 px-8 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/40 min-w-[300px] font-bold"
             />
             <Button className="h-16 px-10 bg-white text-accent hover:bg-white/90 rounded-2xl font-black uppercase tracking-widest text-xs">
                Subscribe
             </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
