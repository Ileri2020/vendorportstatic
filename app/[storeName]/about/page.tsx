/**
 * app/[storeName]/about/page.tsx  →  vendorport.com/[store-name]/about
 * Static layout, dynamic content from AppContext (siteSettings, staff, stats, partners).
 */
import AboutPage from "@/components/platform/pages/AboutPage";

export const revalidate = 300;

export default function AboutRoute() {
  return <AboutPage />;
}