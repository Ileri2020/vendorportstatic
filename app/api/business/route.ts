import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/business?storeName=my-store
 *   OR
 * GET /api/business?businessId=<id>
 *
 * Replaces the old pagehandler. Returns ONLY the business content data needed
 * to hydrate the storefront — NO page structure, NO layout, NO sections ordering.
 *
 * Page layout is defined in the filesystem (static routes).
 * Only content (siteSettings, sections, staff, stats, partners, promotions, helpArticles)
 * is fetched from the DB.
 *
 * Products, categories, posts are fetched by their own dedicated API routes
 * (/api/dbhandler?model=product&businessId=) on demand, not bulk-loaded here.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let businessId = searchParams.get("businessId");
  const storeName = searchParams.get("storeName");

  // Resolve storeName → businessId
  if (!businessId && storeName) {
    const businesses = await prisma.business.findMany({ select: { id: true, name: true } });
    const match = businesses.find(
      (b) => b.name.toLowerCase().replace(/\s+/g, "-") === storeName
    );
    if (!match) return NextResponse.json({ error: "Store not found" }, { status: 404 });
    businessId = match.id;
  }

  if (!businessId) return NextResponse.json({ error: "businessId or storeName required" }, { status: 400 });

  try {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        ownerId: true,
        template: true,
        isArchived: true,
        siteSettings: true,
        sections: {
          where: { isActive: true },
          orderBy: { position: "asc" },
        },
        staff: true,
        stats: true,
        partners: true,
        promotions: true,
        helpArticles: { take: 50 },
      },
    });

    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });

    const res = NextResponse.json({ business });
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    return res;
  } catch (err) {
    console.error("Business API error:", err);
    return NextResponse.json({ error: "Failed to fetch business data" }, { status: 500 });
  }
}
