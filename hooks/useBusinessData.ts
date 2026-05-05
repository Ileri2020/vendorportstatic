"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * useBusinessData
 * 
 * Centralized content loader for the storefront.
 * Fetches business settings, staff, stats, partners, and help articles.
 * Replaces the old usePageCache which was tied to dynamic page-builder structure.
 * 
 * Fetches from /api/business?storeName=...
 */
export function useBusinessData(storeName: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CACHE_KEY = `biz_data_${storeName}`;
  const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  };

  const setCachedData = (bizData: any) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: bizData,
        timestamp: Date.now()
      }));
    } catch {
      // Storage full or private mode
    }
  };

  const invalidateCache = () => {
    localStorage.removeItem(CACHE_KEY);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const cached = getCachedData();
        if (cached) {
          setData(cached);
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`/api/business?storeName=${storeName}`);
        const bizData = response.data.business;
        
        setData(bizData);
        setCachedData(bizData);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load business data');
        setIsLoading(false);
      }
    };

    if (storeName) {
      fetchData();
    }
  }, [storeName]);

  return {
    business: data,
    siteSettings: data?.siteSettings,
    sections: data?.sections || [],
    staff: data?.staff || [],
    stats: data?.stats || [],
    partners: data?.partners || [],
    promotions: data?.promotions || [],
    helpArticles: data?.helpArticles || [],
    isLoading,
    error,
    invalidateCache,
    refetch: () => {
      invalidateCache();
      window.location.reload();
    }
  };
}
