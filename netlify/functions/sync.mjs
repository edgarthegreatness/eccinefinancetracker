import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";
import { mergeStates } from "./merge.mjs";

export const config = { path: "/api/sync" };

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const digest = (s) => createHash("sha256").update(String(s)).digest();
const sameKey = (a, b) => timingSafeEqual(digest(a), digest(b));

const empty = () => ({ projects: [], expenses: [], tomb: {}, cfg: {}, cfgU: 0 });

function clean(body) {
  if (!body || typeof body !== "object") return null;
  const list = (x) => (Array.isArray(x) ? x.filter((r) => r && typeof r.id === "string") : []);
  return {
    projects: list(body.projects),
    expenses: list(body.expenses),
    tomb: body.tomb && typeof body.tomb === "object" ? body.tomb : {},
    cfg: body.cfg && typeof body.cfg === "object" ? body.cfg : {},
    cfgU: Number(body.cfgU) || 0,
  };
}

export default async (req) => {
  const key = Netlify.env.get("SYNC_KEY");
  if (!key) return json({ error: "SYNC_KEY is not set on the server" }, 500);

  const sent = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!sameKey(sent, key)) return json({ error: "Wrong sync key" }, 401);
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);

  const text = await req.text();
  if (text.length > 4000000) return json({ error: "Too large" }, 413);

  let body = null;
  try { body = clean(JSON.parse(text)); } catch (e) { body = null; }
  if (!body) return json({ error: "Bad data" }, 400);

  const store = getStore("ec-tracker");
  const current = (await store.get("state", { type: "json" })) || empty();
  const merged = mergeStates(current, body);
  await store.setJSON("state", merged);
  return json(merged);
};
