/**
 * app/[storeName]/page.tsx  →  vendorport.com/[store-name]
 *
 * DEFAULT ROUTE — renders the business STORE (product catalog).
 * This is the first page visitors see, replacing the old "home" as default.
 *
 * Static layout, dynamic content only (products, categories from DB).
 * Business data comes from the layout via AppContext — NO extra DB fetch.
 */

import { Metadata } from "next";
import { getCachedBusiness } from "@/lib/getBusinessBySlug";
import StorefrontPage from "@/components/platform/pages/StorefrontPage";

export const revalidate = 300;

interface Props {
  params: Promise<{ storeName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storeName } = await params;
  const business = await getCachedBusiness(storeName);
  return {
    title: business ? `Shop | ${business.name}` : "Store | VendorPort",
    description: business?.siteSettings?.aboutText ?? "Browse our full catalog.",
  };
}

export default function StoreDefaultPage() {
  // Business is injected into context by layout — no fetch needed here
  return <StorefrontPage />;
}
