"use client";

/**
 * ContactPage — static layout, dynamic contact info from AppContext
 * Rendered at: vendorport.com/[store-name]/contact
 */

import { motion } from "framer-motion";
import { useAppContext } from "@/hooks/useAppContext";
import { AdminEditable } from "@/components/utility/AdminEditable";
import ContactForm from "@/components/utility/contactForm";
import { ChatInterface } from "@/components/myComponents/subs/ChatInterface";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

export default function ContactPage() {
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
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
            Get in <span className="text-accent">Touch</span>
          </h1>
          <AdminEditable
            as="p"
            value={ss?.contactDesc || "Reach out to us for product inquiries, order support, or business collaborations."}
            model="siteSettings"
            id={ss?.id || ""}
            field="contactDesc"
            className="text-xl text-muted-foreground max-w-xl mx-auto"
          />
        </div>
      </section>

      {/* Contact details + form */}
      <section className="w-full py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left: info */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Email</p>
                  <AdminEditable
                    value={ss?.contactEmail || "support@example.com"}
                    model="siteSettings"
                    id={ss?.id || ""}
                    field="contactEmail"
                    className="font-bold text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Phone</p>
                  <AdminEditable
                    value={ss?.contactPhone || "+000 000 000 0000"}
                    model="siteSettings"
                    id={ss?.id || ""}
                    field="contactPhone"
                    className="font-bold text-lg"
                  />
                </div>
              </div>

              {ss?.address && (
                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Office</p>
                    <AdminEditable
                      value={ss.address}
                      model="siteSettings"
                      id={ss.id}
                      field="address"
                      className="font-bold text-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Chat interface */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest">
                <MessageSquare className="h-4 w-4 text-accent" /> Live Chat
              </div>
              <ChatInterface />
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-card shadow-2xl rounded-[2.5rem] overflow-hidden border">
            <ContactForm />
          </div>
        </div>
      </section>
    </motion.div>
  );
}
