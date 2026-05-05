/**
 * app/[storeName]/analytics/page.tsx
 *
 * OWNER DASHBOARD — renders analytics for a specific business.
 * Refactored to use server-side fetching for performance and reliability.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedBusiness } from "@/lib/getBusinessBySlug";
import AnalyticsDashboard from "@/app/admin/analytics/page";

interface Props {
  params: Promise<{ storeName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storeName } = await params;
  const business = await getCachedBusiness(storeName);
  return {
    title: business ? `Analytics | ${business.name}` : "Analytics | VendorPort",
  };
}

export default async function StoreAnalyticsPage({ params }: Props) {
  const { storeName } = await params;
  const business = await getCachedBusiness(storeName);

  if (!business) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent p-8 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              {business.name} Insights
            </h1>
            <p className="text-sm font-medium opacity-80 mt-1">
              Deep dive into your store&apos;s performance and customer behavior.
            </p>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/20">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Business ID
            </p>
            <p className="font-mono text-xs">{business.id}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnalyticsDashboard businessId={business.id} />
      </div>
    </div>
  );
}
