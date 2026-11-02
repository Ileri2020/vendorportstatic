import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN_NAME = "EEE mobile app";
const TOKEN_LIFETIME_DAYS = 90;

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get("sec-fetch-site") === "cross-site") {
      return NextResponse.json({ error: "Cross-site token requests are not allowed." }, { status: 403 });
    }

    const origin = request.headers.get("origin");
    if (origin) {
      let originHost: string;
      try {
        originHost = new URL(origin).host;
      } catch {
        return NextResponse.json({ error: "Token requests must come from this site." }, { status: 403 });
      }
      const expectedHost = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
        .split(",")[0]
        .trim();
      if (!expectedHost || originHost !== expectedHost) {
        return NextResponse.json({ error: "Token requests must come from this site." }, { status: 403 });
      }
    }

    const session = await auth();
    const userId = (session?.user as unknown as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Sign in to your VendorPort account before issuing an API token." }, { status: 401 });
    }

    const now = new Date();
    const accessToken = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(accessToken, "utf8").digest("hex");
    const expiresAt = new Date(now.getTime() + TOKEN_LIFETIME_DAYS * 24 * 60 * 60 * 1_000);

    // Keep a single active mobile token per account; only the hash is stored in MongoDB.
    await prisma.apiAccessToken.updateMany({
      where: { userId, name: TOKEN_NAME, revokedAt: null },
      data: { revokedAt: now },
    });
    await prisma.apiAccessToken.create({
      data: { userId, name: TOKEN_NAME, tokenHash, expiresAt },
    });

    return NextResponse.json({
      accessToken,
      tokenType: "Bearer",
      expiresAt: expiresAt.toISOString(),
      message: "Copy this token now. It cannot be retrieved again; issuing another token will revoke this one.",
    }, { headers: { "Cache-Control": "no-store, private" } });
  } catch (error) {
    console.error("EEE mobile API token issuance failed:", error);
    return NextResponse.json({ error: "Could not issue an API token." }, { status: 500 });
  }
}
