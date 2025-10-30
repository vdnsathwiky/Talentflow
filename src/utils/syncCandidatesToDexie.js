
import { db } from "../db/dexieDB";

export async function syncCandidatesToDexie() {
  try {
    const res = await fetch("/api/candidates?page=1&pageSize=1000");

    const contentType = res.headers.get("content-type") || "";
    if (!res.ok || !contentType.includes("application/json")) {
      console.error("❌ /api/candidates returned non-JSON (likely Vite index.html). Skipping sync.");
      return;
    }

    const data = await res.json();
    const candidates = data?.data || data || [];

    if (!Array.isArray(candidates) || !candidates.length) {
      console.warn("⚠️ No candidates returned from API");
      return;
    }

    await db.candidates.clear();
    await db.candidates.bulkAdd(
      candidates.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        stage: c.stage,
        jobTitle: c.jobTitle,
        createdAt: c.createdAt,
      }))
    );

    console.log(`✅ Synced ${candidates.length} candidates into Dexie`);
  } catch (err) {
    console.error("❌ Failed to sync MSW candidates to Dexie:", err);
  }
}
