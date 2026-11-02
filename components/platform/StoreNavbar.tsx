"use client";

/**
 * StoreNavbar — static navigation, dynamic branding from siteSettings.
 *
 * Navigation links are HARDCODED (filesystem-routed). No DB fetch, no
 * dynamic page resolution. Only the logo, icon config, and CTA text are
 * business-specific and editable via AdminEditable.
 *
 * Dark/light mode toggle is shared platform infrastructure.
 */

import React, { useEffect, useRef, useState } from "react";
import { useMounted } from "@/hooks/use-mounted";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useIsBusinessAdmin } from "@/hooks/useIsBusinessAdmin";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  Menu,
  Layout,
  BarChart3,
  Camera,
  Edit2,
  Home,
  Info,
  Phone,
  ShoppingBag,
  FileText,
  MoreHorizontal,
  Moon,
  Sun,
} from "lucide-react";
import { GlobalCart } from "@/components/utility/GlobalCart";
import StoreSidebar from "@/components/platform/StoreSidebar";
import { toast } from "sonner";
import { updateSiteSettings } from "@/server/action/siteSettings";
import { AdminEditable } from "@/components/utility/AdminEditable";

interface Business {
  id: string;
  name: string;
  settings?: any;
  siteSettings?: any;
}

/** Static pages — same for ALL businesses, driven by filesystem routes */
const STATIC_PAGES = [
  { name: "Store",   slug: "",        icon: ShoppingBag },
  { name: "Home",    slug: "home",    icon: Home },
  { name: "About",   slug: "about",   icon: Info },
  { name: "Blog",    slug: "blog",    icon: FileText },
  { name: "Contact", slug: "contact", icon: Phone },
];

const MAX_VISIBLE = 4;

const StoreNavbar = ({
  business,
  businessId,
}: {
  business: Business;
  businessId?: string;
}) => {
  const { storeName } = useParams();
  const isAdmin = useIsBusinessAdmin();
  const mounted = useMounted();

  // Icon settings (editable, but not DB-nav-driven)
  const [iconMode, setIconMode] = useState(business.siteSettings?.iconMode || "text");
  const [iconText, setIconText] = useState(business.siteSettings?.iconText || business.name);
  const [iconFontSize, setIconFontSize] = useState(business.siteSettings?.iconFontSize || 20);
  const [iconFontColor, setIconFontColor] = useState(business.siteSettings?.iconFontColor || "#000000");
  const [iconImageUrl, setIconImageUrl] = useState(business.siteSettings?.iconImageUrl || "");
  const [iconImageWidth, setIconImageWidth] = useState(business.siteSettings?.iconImageWidth || 40);
  const [iconImageHeight, setIconImageHeight] = useState(business.siteSettings?.iconImageHeight || 40);
  const [isSavingIcon, setIsSavingIcon] = useState(false);

  useEffect(() => {
    setIconMode(business.siteSettings?.iconMode || "text");
    setIconText(business.siteSettings?.iconText || business.name);
    setIconFontSize(business.siteSettings?.iconFontSize || 20);
    setIconFontColor(business.siteSettings?.iconFontColor || "#000000");
    setIconImageUrl(business.siteSettings?.iconImageUrl || "");
    setIconImageWidth(business.siteSettings?.iconImageWidth || 40);
    setIconImageHeight(business.siteSettings?.iconImageHeight || 40);
  }, [business]);

  const saveIconSettings = async () => {
    if (!businessId) { toast.error("Business context is missing"); return; }
    setIsSavingIcon(true);
    const response = await updateSiteSettings(
      { iconMode, iconText, iconFontSize, iconFontColor, iconImageUrl, iconImageWidth, iconImageHeight },
      businessId
    );
    if (response.success) toast.success("Icon settings saved");
    else toast.error(response.error || "Failed to save icon settings");
    setIsSavingIcon(false);
  };

  const showText  = iconMode !== "image";
  const showImage = iconMode !== "text" && Boolean(iconImageUrl);
  const renderedIconText = iconText?.trim() || business.name;
  const iconWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!iconWrapperRef.current) return;
    iconWrapperRef.current.style.setProperty("--wrapper-size", `${iconImageWidth + 12}px`);
    iconWrapperRef.current.style.setProperty("--image-size", `${iconImageWidth}px`);
    iconWrapperRef.current.style.setProperty("--icon-text-size", `${iconFontSize}px`);
  }, [iconImageWidth, iconImageHeight, iconFontSize]);

  /** Build href for each static page */
  const pageHref = (slug: string) =>
    slug ? `/${storeName}/${slug}` : `/${storeName}`;

  const visiblePages = STATIC_PAGES.slice(0, MAX_VISIBLE);
  const dropdownPages = STATIC_PAGES.slice(MAX_VISIBLE);

  return (
    <nav className="w-full border-b sticky top-0 z-[50] py-4 px-4 md:px-12 flex justify-between items-center bg-white/80 dark:bg-background/80 backdrop-blur-lg">
      {/* ── Logo ── */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Link href={`/${storeName}`} className="flex items-center gap-2">
            <div
              ref={iconWrapperRef}
              className="flex items-center justify-center overflow-hidden rounded-2xl border border-accent/20 bg-accent/10 min-w-[40px]"
            >
              {showImage && (
                <img
                  src={iconImageUrl}
                  alt={renderedIconText}
                  className="object-cover w-[var(--image-size)] h-[var(--image-size)]"
                />
              )}
              {showText && (
                <span className="font-black text-center truncate text-[var(--icon-text-size)] leading-[1]">
                  {renderedIconText}
                </span>
              )}
            </div>
          </Link>

          {/* Admin: edit icon */}
          {mounted && isAdmin && (
            <Dialog>
              <DialogTrigger asChild>
                <button type="button" title="Edit icon settings"
                  className="absolute -bottom-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white text-accent shadow-lg hover:bg-accent/10">
                  <Edit2 className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Business Icon Settings</DialogTitle>
                  <DialogDescription>Configure the logo/icon for your store.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="icon-mode">Icon Type</Label>
                    <Select value={iconMode} onValueChange={setIconMode}>
                      <SelectTrigger id="icon-mode" className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Only</SelectItem>
                        <SelectItem value="image">Image Only</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(iconMode === "text" || iconMode === "both") && (
                    <div className="grid gap-2">
                      <Label htmlFor="icon-text">Icon Text</Label>
                      <Input id="icon-text" value={iconText} onChange={(e) => setIconText(e.target.value)} className="h-11" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                          <Label htmlFor="icon-font-size">Font Size</Label>
                          <Input id="icon-font-size" type="number" min={10} max={60} value={iconFontSize}
                            onChange={(e) => setIconFontSize(Number(e.target.value))} className="h-11" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="icon-font-color">Font Color</Label>
                          <Input id="icon-font-color" type="color" value={iconFontColor}
                            onChange={(e) => setIconFontColor(e.target.value)} className="h-11 p-0" />
                        </div>
                      </div>
                    </div>
                  )}
                  {(iconMode === "image" || iconMode === "both") && (
                    <div className="grid gap-2">
                      <Label htmlFor="icon-image-url">Icon Image URL</Label>
                      <Input id="icon-image-url" value={iconImageUrl}
                        onChange={(e) => setIconImageUrl(e.target.value)} className="h-11" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                          <Label>Width</Label>
                          <Input type="number" min={20} max={200} value={iconImageWidth}
                            onChange={(e) => setIconImageWidth(Number(e.target.value))} className="h-11" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Height</Label>
                          <Input type="number" min={20} max={200} value={iconImageHeight}
                            onChange={(e) => setIconImageHeight(Number(e.target.value))} className="h-11" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIconMode(business.siteSettings?.iconMode || "text")}>Cancel</Button>
                  <Button onClick={saveIconSettings} disabled={isSavingIcon}>
                    {isSavingIcon ? "Saving..." : "Save Icon"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Link href={`/${storeName}`}
          className="truncate max-w-[120px] md:max-w-none text-xl md:text-2xl font-black tracking-tighter text-accent">
          {business.name}
        </Link>
      </div>

      {/* ── Desktop nav ── */}
      <div className="hidden md:flex items-center gap-1 w-2/5 justify-end">
        {visiblePages.map((page) => (
          <Link
            key={page.slug}
            href={pageHref(page.slug)}
            title={page.name}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"
          >
            <page.icon className="h-5 w-5" />
          </Link>
        ))}
        {dropdownPages.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg hover:bg-accent/10 hover:text-accent">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {dropdownPages.map((page) => (
                <DropdownMenuItem key={page.slug} asChild>
                  <Link href={pageHref(page.slug)} className="flex items-center gap-2 w-full">
                    <page.icon className="h-4 w-4" />
                    {page.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Admin badges */}
        {mounted && isAdmin && (
          <>
            <Link href={`/${storeName}/analytics`}>
              <Badge variant="secondary"
                className="bg-accent/10 text-accent font-black border-accent/20 cursor-pointer hover:bg-accent/20 py-2 hidden sm:flex">
                ADMIN <Layout className="h-3 w-3 ml-1" />
              </Badge>
            </Link>
          </>
        )}

        {/* Cart */}
        <GlobalCart />

        {/* Header CTA */}
        <AdminEditable
          value={business.siteSettings?.headerCTA || "Join Platform"}
          model="siteSettings"
          id={business.siteSettings?.id || ""}
          field="headerCTA"
        >
          <Button variant="outline" className="rounded-full font-bold md:flex hidden">
            {business.siteSettings?.headerCTA || "Join Platform"}
          </Button>
        </AdminEditable>

        {/* Mobile hamburger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-4 border-accent">
            <SheetHeader>
              <SheetTitle>{business.name || "Store Menu"}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6">
              {STATIC_PAGES.map((page) => (
                <Link
                  key={page.slug}
                  href={pageHref(page.slug)}
                  className="font-bold text-lg uppercase tracking-widest hover:text-accent transition-colors"
                >
                  {page.name}
                </Link>
              ))}
              {mounted && isAdmin && (
                <Link href={`/${storeName}/analytics`} className="flex items-center gap-3 text-accent font-black">
                  <BarChart3 className="h-5 w-5" /> OWNER ANALYTICS
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default StoreNavbar;
