"use client";

/**
 * AboutPage — static layout, dynamic content from AppContext
 * Rendered at: vendorport.com/[store-name]/about
 */

import { motion } from "framer-motion";
import { useAppContext } from "@/hooks/useAppContext";
import { AdminEditable } from "@/components/utility/AdminEditable";
import { Info, Users, BarChart3, Handshake } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AboutPage() {
  const { currentBusiness } = useAppContext();
  const ss = currentBusiness?.siteSettings;
  const staff = currentBusiness?.staff ?? [];
  const stats = currentBusiness?.stats ?? [];
  const partners = currentBusiness?.partners ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      className="w-full"
    >
      {/* Hero */}
      <section className="w-full py-24 md:py-32 px-4 bg-gradient-to-br from-accent/10 via-background to-background">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
              <Info className="h-4 w-4" /> Our Story
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
              About{" "}
              <span className="text-accent">{currentBusiness?.name || "Us"}</span>
            </h1>
          </motion.div>
          <motion.div {...fadeUp}>
            <AdminEditable
              as="p"
              value={ss?.aboutText || "Write about your business here."}
              model="siteSettings"
              id={ss?.id || ""}
              field="aboutText"
              className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="w-full py-16 px-4 bg-accent text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {stats.map((stat: any) => (
              <div key={stat.id} className="space-y-1">
                <AdminEditable
                  as="h3"
                  value={stat.value}
                  model="businessStat"
                  id={stat.id}
                  field="value"
                  className="text-5xl font-black"
                />
                <AdminEditable
                  as="p"
                  value={stat.label}
                  model="businessStat"
                  id={stat.id}
                  field="label"
                  className="text-sm font-bold uppercase tracking-widest opacity-70"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Team */}
      {staff.length > 0 && (
        <section className="w-full py-20 px-4">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-accent text-sm font-bold">
                <Users className="h-4 w-4" /> Our Team
              </div>
              <h2 className="text-4xl font-black tracking-tighter">Meet the Experts</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {staff.map((member: any) => (
                <div key={member.id} className="flex flex-col items-center group text-center">
                  <div className="h-36 w-36 rounded-full overflow-hidden border-4 border-accent/10 group-hover:border-accent transition-all duration-300 shadow-xl mb-4">
                    <img
                      src={member.image || "https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png"}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <AdminEditable
                    as="h4"
                    value={member.name}
                    model="staff"
                    id={member.id}
                    field="name"
                    className="font-bold text-base group-hover:text-accent transition-colors"
                  />
                  <AdminEditable
                    as="p"
                    value={member.role}
                    model="staff"
                    id={member.id}
                    field="role"
                    className="text-xs text-muted-foreground uppercase tracking-widest font-bold"
                  />
                  {member.bio && (
                    <AdminEditable
                      as="p"
                      value={member.bio}
                      model="staff"
                      id={member.id}
                      field="bio"
                      className="text-xs text-muted-foreground mt-1 line-clamp-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners */}
      {partners.length > 0 && (
        <section className="w-full py-16 px-4 bg-muted/30 border-t">
          <div className="max-w-7xl mx-auto space-y-10 text-center">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-bold">
              <Handshake className="h-4 w-4" /> Our Partners
            </div>
            <div className="flex flex-wrap justify-center items-center gap-10 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
              {partners.map((p: any) => (
                <a key={p.id} href={p.website || "#"} target="_blank" rel="noreferrer">
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} className="h-10 object-contain" />
                  ) : (
                    <span className="font-bold text-sm">{p.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
}
