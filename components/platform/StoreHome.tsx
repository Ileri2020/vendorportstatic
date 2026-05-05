"use client"

/**
 * StoreHome — primary orchestrator for rendering storefront sections.
 * Post-migration: ONLY relies on BusinessSection model and filesystem routes.
 * Legacy Page/ProjectSettings logic removed.
 */

import React from 'react'
import { useIsBusinessAdmin } from '@/hooks/useIsBusinessAdmin'
import { useMounted } from '@/hooks/use-mounted'
import { AdminEditable } from '@/components/utility/AdminEditable'
import { useAppContext } from '@/hooks/useAppContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Layout, Search, Mail, Phone, MapPin, Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useParams, useSearchParams } from 'next/navigation'
import { CartDetails } from '@/components/myComponents/subs/CartDetails'
import ContactForm from '@/components/utility/contactForm'
import { ChatInterface } from '@/components/myComponents/subs/ChatInterface'
import Posts from '@/components/myComponents/subs/posts'
import Stocks from '@/components/myComponents/subs/stocks'
import ProductDetailView from "@/components/myComponents/subs/ProductDetailView"
import FeaturedProducts from '@/components/myComponents/subs/featuredProducts'
import FeaturedCategories from '@/components/myComponents/subs/featuredCategories'
import Features from '@/components/myComponents/subs/features'
import Hero from '@/components/myComponents/subs/hero'
import SectionConfigDialog from './SectionConfigDialog'
import AdminToolbar from './AdminToolbar'
import { useStoreActions } from '@/hooks/useStoreActions'
import { AIProductSearch } from '@/components/myComponents/subs/AIProductSearch'

interface Business {
  id: string; 
  name: string; 
  ownerId: string; 
  template: string;
  sections?: any[]; 
  siteSettings?: any; 
  staff?: any[]; 
  promotions?: any[]; 
  stats?: any[]; 
  partners?: any[]; 
  helpArticles?: any[]
}

// ─── Section wrapper ───────────────────────────────────────────────────────────
const BG: Record<string,string> = { 
  '':'', 
  'muted':'bg-muted/30', 
  'accent':'bg-accent text-white', 
  'dark':'bg-black text-white', 
  'gradient':'bg-gradient-to-br from-background via-muted/20 to-background' 
}
const PAD: Record<string,string> = { 
  'none':'py-0', 
  'small':'py-8', 
  'medium':'py-16 md:py-20', 
  'large':'py-24 md:py-32', 
  'extra-large':'py-32 md:py-48' 
}

const SectionWrapper = ({ section, children, className='' }: { section:any, children:React.ReactNode, className?:string }) => {
  const s = section.settings || {}
  const bg = BG[s.bg as string] || ''
  const pad = PAD[s.padding as string] || (section.type === 'hero' ? 'py-0' : 'py-20')
  return (
    <section className={cn('w-full transition-all duration-500', bg, pad, className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">{children}</div>
    </section>
  )
}

// ─── Section renderer ──────────────────────────────────────────────────────────
const RenderSection = ({ section, business, activePageSlug }: { section:any, business:Business, isAdmin:boolean, activePageSlug:string }) => {
  const { id } = section
  const type = section.type || ''
  const data = section.data || {}
  const { storeName } = useParams()
  const searchParams = useSearchParams()

  switch (type) {
    case 'hero':
      if (activePageSlug !== 'home') return null
      return (
        <div className="w-full">
          <Hero 
            variant={section.layout || 'modern-split'} 
            title={<AdminEditable value={business.siteSettings?.heroTitle || 'Welcome'} model="siteSettings" id={business.siteSettings?.id || ''} field="heroTitle">{business.siteSettings?.heroTitle || 'Welcome'}</AdminEditable>} 
            subtitle={<AdminEditable value={business.siteSettings?.heroSubtitle || ''} model="siteSettings" id={business.siteSettings?.id || ''} field="heroSubtitle">{business.siteSettings?.heroSubtitle || ''}</AdminEditable>} 
            sectionId={id} 
          />
          <section className="w-full py-12 px-4 md:px-8 bg-gradient-to-br from-background via-muted/30 to-background border-b border-t shadow-sm">
            <div className="max-w-7xl mx-auto">
              <AIProductSearch businessId={business.id}>
                <Button className="w-full md:w-auto h-14 px-8 bg-accent hover:bg-accent/90 text-white font-black text-lg rounded-2xl shadow-lg">
                  <Search className="h-5 w-5 mr-2"/>Find Products with AI
                </Button>
              </AIProductSearch>
            </div>
          </section>
        </div>
      )
    case 'products':
      return (
        <SectionWrapper section={section}>
          <div className="space-y-8 w-full">
            <AdminEditable as="h2" value={data?.title || 'Trending Products'} model="businessSection" id={id} field="heading" className="text-3xl font-black tracking-tight"/>
            <FeaturedProducts categoryId={data?.categoryId} title={data?.title} businessId={business.id} storeName={storeName as string}/>
          </div>
        </SectionWrapper>
      )
    case 'categories':
      return (
        <SectionWrapper section={section}>
          <div className="w-full">
            <AdminEditable as="h2" value={data?.title || 'Categories'} model="businessSection" id={id} field="heading" className="text-3xl font-black tracking-tight mb-8"/>
            <FeaturedCategories businessId={business.id}/>
          </div>
        </SectionWrapper>
      )
    case 'features':
      return <SectionWrapper section={section}><Features/></SectionWrapper>
    case 'description':
      return (
        <SectionWrapper section={section}>
          <div className="max-w-4xl mx-auto space-y-6">
            <AdminEditable as="h2" value={data?.title || 'Our Philosophy'} model="businessSection" id={id} field="heading" className="text-4xl font-extrabold tracking-tight"/>
            <AdminEditable as="p" value={business.siteSettings?.aboutText || 'This store provides the best service.'} model="siteSettings" id={business.siteSettings?.id || ''} field="aboutText" className="text-xl text-muted-foreground leading-loose italic"/>
          </div>
        </SectionWrapper>
      )
    case 'contact-form':
      return (
        <SectionWrapper section={section}>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <AdminEditable as="h2" value={data?.title || 'Connect with Us'} model="businessSection" id={id} field="heading" className="text-4xl font-black tracking-tighter text-accent"/>
              <p className="text-muted-foreground text-lg">{data?.text || "We'd love to hear from you."}</p>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent"><Mail/></div>
                  <div>
                    <p className="text-xs font-black uppercase text-muted-foreground">Email</p>
                    <AdminEditable value={business.siteSettings?.contactEmail || `support@${storeName}.com`} model="siteSettings" id={business.siteSettings?.id || ''} field="contactEmail" className="font-bold"/>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent"><Phone/></div>
                  <div>
                    <p className="text-xs font-black uppercase text-muted-foreground">Phone</p>
                    <AdminEditable value={business.siteSettings?.contactPhone || '+000 000 0000'} model="siteSettings" id={business.siteSettings?.id || ''} field="contactPhone" className="font-bold"/>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent"><MapPin/></div>
                  <div>
                    <p className="text-xs font-black uppercase text-muted-foreground">Office</p>
                    <AdminEditable value={business.siteSettings?.address || 'Global Presence'} model="siteSettings" id={business.siteSettings?.id || ''} field="address" className="font-bold"/>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card shadow-2xl rounded-[2.5rem] overflow-hidden border"><ContactForm/></div>
          </div>
        </SectionWrapper>
      )
    case 'chat-interface':
      return (
        <SectionWrapper section={section}>
          <div className="w-full space-y-8">
            <div className="text-center space-y-2">
              <AdminEditable as="h2" value={data?.title || 'Talk to an Expert'} model="businessSection" id={id} field="heading" className="text-3xl font-black tracking-tight"/>
            </div>
            <ChatInterface/>
          </div>
        </SectionWrapper>
      )
    case 'blog-posts':
      return (
        <SectionWrapper section={section}>
          <div className="flex justify-between items-end mb-12 gap-6 w-full">
            <div className="space-y-2">
              <AdminEditable as="h2" value={data?.title || 'Latest Insights'} model="businessSection" id={id} field="heading" className="text-3xl font-black"/>
            </div>
          </div>
          <Posts page="General"/>
        </SectionWrapper>
      )
    case 'product-list':
      return (
        <SectionWrapper section={section}>
          <div className="w-full space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <AdminEditable as="h2" value={data?.title || 'Catalog'} model="businessSection" id={id} field="heading" className="text-4xl font-black tracking-tighter"/>
              <div className="flex gap-4 items-center flex-wrap">
                <Button variant="secondary" className="font-bold rounded-xl h-11 px-6">Filters</Button>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground"/>
                  <Input className="pl-10 h-11 w-64 rounded-xl border-2" placeholder="Search products..."/>
                </div>
              </div>
            </div>
            <Stocks businessId={business.id}/>
          </div>
        </SectionWrapper>
      )
    case 'newsletter':
      return (
        <SectionWrapper section={section}>
          <div className="w-full px-6 py-12 bg-accent rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-accent/20">
            <div className="space-y-2 flex-1">
              <AdminEditable as="h3" value={business.siteSettings?.newsletterTitle || 'Join our Newsletter'} model="siteSettings" id={business.siteSettings?.id || ''} field="newsletterTitle" className="text-2xl font-black uppercase tracking-widest"/>
              <AdminEditable as="p" value={business.siteSettings?.newsletterText || 'Be the first to know about new arrivals.'} model="siteSettings" id={business.siteSettings?.id || ''} field="newsletterText" className="text-white/80 font-medium"/>
            </div>
            <div className="flex w-full md:w-auto gap-3 items-center">
              <Input placeholder="your@email.com" className="bg-white/10 border-white/20 h-12 rounded-2xl w-full md:w-64 placeholder:text-white/50 font-bold"/>
              <Button className="h-12 px-8 rounded-2xl bg-white text-accent font-black hover:bg-white/90">Join</Button>
            </div>
          </div>
        </SectionWrapper>
      )
    case 'stats': {
      const stats = business.stats || []
      return (
        <SectionWrapper section={section} className="bg-accent text-white">
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat:any) => (
              <div key={stat.id} className="space-y-2">
                <AdminEditable as="h4" value={stat.value} model="businessStat" id={stat.id} field="value" className="text-5xl font-black"/>
                <AdminEditable as="p" value={stat.label} model="businessStat" id={stat.id} field="label" className="text-sm font-bold uppercase tracking-widest opacity-70"/>
              </div>
            ))}
          </div>
        </SectionWrapper>
      )
    }
    case 'partners': {
      const partners = business.partners || []
      return (
        <SectionWrapper section={section}>
          <div className="w-full space-y-12">
            <AdminEditable as="h2" value={data?.title || 'Our Trusted Partners'} model="businessSection" id={id} field="heading" className="text-sm font-black uppercase tracking-widest text-muted-foreground"/>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {partners.map((p:any) => (
                <div key={p.id} className="flex flex-col items-center gap-2">
                  <img src={p.logo || ''} alt={p.name} className="h-12 object-contain"/>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>
      )
    }
    case 'staff': {
      const staff = business.staff || []
      return (
        <SectionWrapper section={section}>
          <div className="w-full">
            <div className="mb-16 space-y-4">
              <AdminEditable as="h2" value={data?.title || 'Meet the Experts'} model="businessSection" id={id} field="heading" className="text-4xl font-black"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
              {staff.length > 0 ? staff.map((m:any) => (
                <div key={m.id} className="flex flex-col items-center group">
                  <div className="h-40 w-40 rounded-full overflow-hidden mb-4 border-4 border-accent/10 group-hover:border-accent transition-all duration-300 shadow-xl">
                    <img src={m.image || 'https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png'} alt={m.name} className="h-full w-full object-cover"/>
                  </div>
                  <AdminEditable as="h4" value={m.name} model="staff" id={m.id} field="name" className="font-bold text-lg group-hover:text-accent transition-colors"/>
                  <AdminEditable as="p" value={m.role} model="staff" id={m.id} field="role" className="text-sm text-muted-foreground uppercase tracking-widest font-bold text-[10px]"/>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-3xl">
                  <p>No team members listed yet.</p>
                </div>
              )}
            </div>
          </div>
        </SectionWrapper>
      )
    }
    case 'cart':
      return (
        <SectionWrapper section={section}>
          <div className="w-full">
            <div className="mb-12">
              <h2 className="text-4xl font-black tracking-tighter">Shopping Bag</h2>
              <p className="text-muted-foreground font-medium">Review your items before checkout.</p>
            </div>
            <CartDetails cartId="temp"/>
          </div>
        </SectionWrapper>
      )
    case 'product-details': {
      const pId = searchParams.get('id')
      return (
        <section className="w-full py-20 px-4 md:px-8">
          <ProductDetailView productId={pId || undefined} businessId={business.id}/>
        </section>
      )
    }
    case 'notifications':
      return (
        <div className="relative w-full h-0 z-40 overflow-visible text-center">
          <div className="inline-flex bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-2xl items-center gap-3 animate-bounce translate-y-[-50px]">
            <Bell className="h-6 w-6"/>
            <span className="font-bold uppercase tracking-widest text-sm">{data?.text || 'Special Weekend Sale - 20% OFF!'}</span>
          </div>
        </div>
      )
    default:
      return <div className="p-10 text-center text-muted-foreground">Unknown section: {type}</div>
  }
}

// ─── Section row (content editing only, no drag/drop) ─────────────────────────
const SectionRow = ({ section, isAdmin, business, activePageSlug }: any) => (
  <div className="w-full group/section relative">
    {isAdmin && (
      <div className="absolute right-4 top-4 z-40 opacity-0 group-hover/section:opacity-100 transition-opacity flex gap-1 p-1.5 bg-background/90 backdrop-blur-xl rounded-xl border-2 shadow-xl items-center">
        <SectionConfigDialog section={section} onUpdate={() => window.location.reload()}/>
      </div>
    )}
    <RenderSection section={section} business={business} isAdmin={isAdmin} activePageSlug={activePageSlug}/>
  </div>
)

// ─── Main component ────────────────────────────────────────────────────────────
const StoreHome = ({
  business: initialBusiness,
  activePageSlug = 'home',
  initialAdminTab = null,
  onDataChange
}: {
  business: Business, activePageSlug?: string, initialAdminTab?: string | null, onDataChange?: () => void
}) => {
  const { setCurrentBusiness, currentBusiness } = useAppContext()
  const isAdmin = useIsBusinessAdmin()
  const [business, setBusiness] = React.useState(initialBusiness)
  const [isAdminToolbarOpen, setIsAdminToolbarOpen] = React.useState(!!initialAdminTab)
  const mounted = useMounted()

  React.useEffect(() => {
    if (initialBusiness?.id !== currentBusiness?.id) setCurrentBusiness(initialBusiness)
    setBusiness(initialBusiness)
  }, [initialBusiness, setCurrentBusiness, currentBusiness?.id])

  React.useEffect(() => {
    if (initialAdminTab) setIsAdminToolbarOpen(true)
  }, [initialAdminTab])

  // Filter sections for this specific static page
  const sections = React.useMemo(() => {
    if (!business.sections) return []
    return business.sections
      .filter((s: any) => s.page === activePageSlug && s.isActive !== false)
      .map((s: any) => ({
        id: s.id,
        type: s.key || s.type,
        layout: s.settings?.layout || s.layout || 'default',
        data: s.content || s.data || {},
        settings: s.settings || {},
        order: s.position ?? 0
      }))
      .sort((a: any, b: any) => a.order - b.order)
  }, [business.sections, activePageSlug])

  const { updateGlobalSettings } = useStoreActions({ business, onDataChange })

  return (
    <div className="flex flex-col items-center w-full relative">
      {isAdmin && mounted && (
        <AdminToolbar
          business={business}
          onUpdateSettings={updateGlobalSettings}
          isOpen={isAdminToolbarOpen}
          onOpenChange={setIsAdminToolbarOpen}
          initialTab={initialAdminTab}
          onSectionDataChange={onDataChange}
        />
      )}

      <main className="w-full">
        {sections.length === 0 ? (
          <div className="w-full min-h-[400px] flex flex-col items-center justify-center text-center py-20 text-muted-foreground">
            <Layout className="h-12 w-12 mb-4 opacity-30"/>
            <p className="text-lg font-bold">No content on this page yet.</p>
          </div>
        ) : (
          sections.map((section: any) => (
            <SectionRow 
              key={section.id} 
              section={section} 
              isAdmin={isAdmin && mounted} 
              business={business} 
              activePageSlug={activePageSlug}
            />
          ))
        )}
      </main>
    </div>
  )
}

export default StoreHome
