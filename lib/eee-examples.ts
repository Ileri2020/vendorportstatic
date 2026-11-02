import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const MAX_EXAMPLE_REQUEST_BYTES = 2_100_000;
export const MAX_EXAMPLE_CONTENT_BYTES = 1_000_000;

export class ExamplePayloadTooLargeError extends Error {
  constructor() {
    super("The example request exceeds the maximum allowed size.");
    this.name = "ExamplePayloadTooLargeError";
  }
}

export async function readBoundedJson(request: NextRequest): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_EXAMPLE_REQUEST_BYTES) {
    throw new ExamplePayloadTooLargeError();
  }

  if (!request.body) {
    throw new SyntaxError("A JSON request body is required.");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_EXAMPLE_REQUEST_BYTES) {
      await reader.cancel();
      throw new ExamplePayloadTooLargeError();
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(body)) as unknown;
}

export async function getApiTokenUserId(request: NextRequest): Promise<string | null> {
  const authorization = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+([A-Za-z0-9_-]{32,})$/i.exec(authorization);
  if (!match) return null;

  const tokenHash = createHash("sha256").update(match[1], "utf8").digest("hex");
  const token = await prisma.apiAccessToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, expiresAt: true, revokedAt: true },
  });

  if (!token || token.revokedAt || token.expiresAt <= new Date()) return null;

  await prisma.apiAccessToken.update({
    where: { id: token.id },
    data: { lastUsedAt: new Date() },
  });

  return token.userId;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function optionalText(value: unknown, maxLength: number): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw new TypeError("Optional example fields must be strings.");
  const normalized = value.trim();
  if (normalized.length > maxLength) throw new RangeError("An example field exceeds its maximum length.");
  return normalized || undefined;
}

export function buildComponentSummary(components: unknown[]): string {
  const counts = new Map<string, number>();
  for (const component of components) {
    if (!isRecord(component)) continue;
    const componentType = typeof component.ComponentType === "string"
      ? component.ComponentType
      : typeof component.componentType === "string"
        ? component.componentType
        : "Component";
    counts.set(componentType, (counts.get(componentType) ?? 0) + 1);
  }

  const summary = [...counts.entries()]
    .slice(0, 8)
    .map(([type, count]) => `${count}x ${type}`)
    .join(", ");
  return summary || "Empty circuit";
}
