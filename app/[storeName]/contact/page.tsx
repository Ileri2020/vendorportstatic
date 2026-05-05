/**
 * app/[storeName]/contact/page.tsx  →  vendorport.com/[store-name]/contact
 */
import ContactPage from "@/components/platform/pages/ContactPage";

export const revalidate = 300;

export default function ContactRoute() {
  return <ContactPage />;
}