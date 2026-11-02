/**
 * app/[storeName]/home/page.tsx  →  vendorport.com/[store-name]/home
 *
 * LANDING PAGE — renders the business home sections (hero, features, etc.).
 * Uses StoreHome for flexible section management.
 */

import BusinessHomePage from "@/components/platform/pages/BusinessHomePage";
import { getCachedBusiness } from "@/lib/getBusinessBySlug";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ storeName: string }>;
}

export default async function HomeRoute({ params }: Props) {
  const { storeName } = await params;
  const business = await getCachedBusiness(storeName);

  if (!business) return notFound();

  return <BusinessHomePage />;
}
