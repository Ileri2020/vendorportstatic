/**
 * app/[storeName]/products/page.tsx
 * Redirects to the default store route since /[storeName] IS the product catalog now.
 */
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ storeName: string }>;
}

export default async function ProductsRedirect({ params }: Props) {
  const { storeName } = await params;
  redirect(`/${storeName}`);
}