/**
 * app/[storeName]/cart/page.tsx  →  vendorport.com/[store-name]/cart
 */
import CartPage from "@/components/platform/pages/CartPage";

export const revalidate = 0; // Cart is always dynamic (user-specific)

export default function CartRoute() {
  return <CartPage />;
}
