"use client";

/**
 * BusinessContextProvider
 *
 * A thin client boundary that receives the server-fetched business object
 * and sets it in AppContext so all deeply nested client components
 * (Hero, FeaturedProducts, StoreNavbar, etc.) can access currentBusiness
 * without triggering any additional DB fetches.
 *
 * This is the bridge between server-side data fetching and client-side context.
 */

import { useEffect } from "react";
import { useAppContext } from "@/hooks/useAppContext";

interface Props {
  business: any;
  children: React.ReactNode;
}

function BusinessInjector({ business }: { business: any }) {
  const { setCurrentBusiness, currentBusiness } = useAppContext();

  useEffect(() => {
    // Only update if business actually changed (prevents infinite re-renders)
    if (business && business.id !== currentBusiness?.id) {
      setCurrentBusiness(business);
    }
  }, [business, currentBusiness?.id, setCurrentBusiness]);

  return null;
}

export default function BusinessContextProvider({ business, children }: Props) {
  return (
    <>
      <BusinessInjector business={business} />
      {children}
    </>
  );
}
