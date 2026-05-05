/**
 * app/[storeName]/blog/page.tsx  →  vendorport.com/[store-name]/blog
 */
import BlogPage from "@/components/platform/pages/BlogPage";

export const revalidate = 300;

export default function BlogRoute() {
  return <BlogPage />;
}
