"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useMounted } from "@/hooks/use-mounted"
import { AIProductSearch } from "@/components/myComponents/subs/AIProductSearch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Home, ShoppingBag, Info, FileText, Phone, Moon, Sun, Sparkles } from "lucide-react"

interface Business {
  id: string
  name: string
  slug?: string
  ownerId?: string
  siteSettings?: Record<string, any> | null
}

interface StoreSidebarProps {
  business: Business
  businessId?: string
  mobile?: boolean
}

export default function StoreSidebar({ business, businessId, mobile = false }: StoreSidebarProps) {
  const mounted = useMounted()
  const { theme, setTheme } = useTheme()
  const storeSlug = business.slug || business.name?.toLowerCase().replace(/\s+/g, "-") || "store"

  const pageLinks = [
    { label: "Store", href: `/${storeSlug}`, icon: ShoppingBag },
    { label: "Home", href: `/${storeSlug}/home`, icon: Home },
    { label: "About", href: `/${storeSlug}/about`, icon: Info },
    { label: "Blog", href: `/${storeSlug}/blog`, icon: FileText },
    { label: "Contact", href: `/${storeSlug}/contact`, icon: Phone },
  ]

  return (
    <aside className={`${mobile ? "w-full" : "hidden xl:flex xl:w-80"} flex-shrink-0 flex-col gap-6 rounded-3xl border border-muted/20 bg-background p-6 shadow-sm`}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-black uppercase tracking-[0.3em] text-accent">
            <Sparkles className="h-4 w-4" />
            Store Tools
          </div>
          <h2 className="text-2xl font-black">{business.name}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {business.siteSettings?.aboutText || "Quick access to AI search, theme, and navigation for your store."}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-3xl bg-muted/10 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Theme</p>
              <p className="font-black">{mounted ? (theme === "dark" ? "Dark" : "Light") : "System"}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          <div className="rounded-3xl bg-accent/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-foreground/80">AI Product Search</p>
            <p className="mt-2 text-sm text-muted-foreground">Use AI to find items in this store fast.</p>
            {businessId ? (
              <AIProductSearch businessId={businessId}>
                <Button className="mt-4 w-full rounded-2xl bg-accent text-white hover:bg-accent/90">
                  Launch AI Search
                </Button>
              </AIProductSearch>
            ) : (
              <Button className="mt-4 w-full rounded-2xl" disabled>
                Loading...
              </Button>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Quick Links</p>
        <div className="space-y-2">
          {pageLinks.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors">
              <item.icon className="h-4 w-4 text-accent" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3 text-sm text-muted-foreground">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Contact</p>
        <p>{business.siteSettings?.contactEmail || "hello@vendorport.com"}</p>
        <p>{business.siteSettings?.contactPhone || "+234 000 000 0000"}</p>
      </div>
    </aside>
  )
}
