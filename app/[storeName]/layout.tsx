/**
 * app/[storeName]/layout.tsx
 *
 * SHARED STOREFRONT SHELL — loaded ONCE per storeName, shared by all child pages.
 *
 * This is the key architectural improvement:
 * - Business data fetched server-side with a 5-minute cache
 * - Navbar and Footer are static components, not DB-driven
 * - Business injected into AppContext for all child components
 * - Dark/light mode infrastructure is platform-wide (not per-business)
 * - No page builder, no dynamic route resolution, no section DB fetches
 *
 * Each child page (home, store, about, contact, blog, cart…) uses the business
 * object passed from this layout via BusinessContextProvider.
 */

import { notFound } from "next/navigation";
import { getCachedBusiness } from "@/lib/getBusinessBySlug";
import StoreNavbar from "@/components/platform/StoreNavbar";
import StoreFooter from "@/components/platform/StoreFooter";
import BusinessContextProvider from "@/components/platform/BusinessContextProvider";

export const revalidate = 300; // ISR: re-validate every 5 minutes

interface Props {
  children: React.ReactNode;
  params: Promise<{ storeName: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { storeName } = await params;
  const business = await getCachedBusiness(storeName);

  if (!business) {
    return { title: "Store Not Found | VendorPort" };
  }

  return {
    title: `${business.name} | VendorPort`,
    description:
      business.siteSettings?.aboutText ||
      `Shop at ${business.name} on VendorPort`,
    openGraph: {
      title: business.name,
      description: business.siteSettings?.aboutText || "",
      images: business.siteSettings?.heroImage
        ? [business.siteSettings.heroImage]
        : [],
    },
  };
}

export default async function StoreLayout({ children, params }: Props) {
  const { storeName } = await params;
  const business = await getCachedBusiness(storeName);

  if (!business) {
    notFound();
  }

  if (business.isArchived) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4 space-y-4">
        <h1 className="text-3xl font-extrabold">Store Suspended</h1>
        <p className="text-muted-foreground max-w-md">
          &quot;{business.name}&quot; has been temporarily suspended by the
          platform. Please check back later.
        </p>
      </div>
    );
  }

  return (
    /**
     * BusinessContextProvider is a thin client component that injects the
     * server-fetched business into AppContext so all client components
     * (Hero, FeaturedProducts, FeaturedCategories, etc.) can read it via
     * useAppContext().currentBusiness — without fetching from the DB again.
     */
    <BusinessContextProvider business={business}>
      <div className="min-h-screen">
        <StoreNavbar business={business} businessId={business.id} />
        <main className="flex-1">
          {children}
        </main>
        <StoreFooter business={business} />
      </div>
    </BusinessContextProvider>
  );
}