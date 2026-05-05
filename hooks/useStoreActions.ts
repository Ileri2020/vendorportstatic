"use client";

/**
 * useStoreActions — content-only store actions (post architecture migration).
 *
 * REMOVED: legacy page-builder logic, projectSettings logic.
 * KEPT: updateGlobalSettings, handleEditSection, handleDeleteSection, handleAddSection
 */

import axios from 'axios';
import { toast } from 'sonner';

interface Params {
  business?: any;
  onDataChange?: () => void;
}

export function useStoreActions({ business, onDataChange }: Params) {

  const updateGlobalSettings = async (data: any) => {
    try {
      if (data.siteSettings) {
        await axios.put('/api/dbhandler?model=siteSettings', {
          id: business?.siteSettings?.id,
          ...data.siteSettings,
        });
      }
      
      const bizData = { ...data };
      delete bizData.siteSettings;
      if (Object.keys(bizData).length > 0) {
        await axios.put(`/api/dbhandler?model=business&id=${business?.id}`, bizData);
      }

      toast.success('Settings updated!');
      onDataChange?.();
      window.location.reload();
    } catch {
      toast.error('Failed to update settings');
    }
  };

  const handleEditSection = async (sectionId: string, content: any, settings?: any) => {
    try {
      await axios.put('/api/dbhandler?model=businessSection', {
        id: sectionId,
        content,
        settings
      });
      toast.success('Section updated!');
      onDataChange?.();
    } catch {
      toast.error('Failed to update section');
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await axios.delete(`/api/dbhandler?model=businessSection&id=${sectionId}`);
      toast.success('Section removed');
      onDataChange?.();
    } catch {
      toast.error('Failed to remove section');
    }
  };

  const handleAddSection = async (page: string, type: string, layout: string) => {
    try {
      await axios.post('/api/dbhandler?model=businessSection', {
        businessId: business.id,
        page,
        key: type,
        settings: { layout }
      });
      toast.success('Section added');
      onDataChange?.();
    } catch {
      toast.error('Failed to add section');
    }
  };

  return { updateGlobalSettings, handleEditSection, handleDeleteSection, handleAddSection };
}
