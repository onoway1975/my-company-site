import { NextRequest } from "next/server";

export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function getJSTDateKey(prefix: string, ip: string): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = jst.getUTCFullYear();
  const mm = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(jst.getUTCDate()).padStart(2, "0");
  return `${prefix}:${ip}:${yyyy}-${mm}-${dd}`;
}

export async function checkRateLimit(
  prefix: string,
  ip: string,
  max: number
): Promise<{ ok: boolean; remaining: number }> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    // KV未設定時はレート制限をスキップ
    return { ok: true, remaining: max };
  }
  const { kv } = await import("@vercel/kv");
  const key = getJSTDateKey(prefix, ip);
  const current = (await kv.get<number>(key)) ?? 0;
  if (current >= max) {
    return { ok: false, remaining: 0 };
  }
  await kv.set(key, current + 1, { ex: 90000 });
  return { ok: true, remaining: max - current - 1 };
}
