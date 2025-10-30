
import Dexie from "dexie";

// ================== Initialize IndexedDB ==================
export const db = new Dexie("TalentFlowDB");

// ✅ Version 5 — updated schema with sections and questions
db.version(5).stores({
  jobs: "++id, title, slug, status, tags, order, createdAt, updatedAt",
  candidates: "++id, name, email, stage, jobId, createdAt, updatedAt, history",
  timelines: "++id, candidateId, timestamp, note, from, to",
  assessments: "++id, jobId, title, description, duration, sections, createdAt, updatedAt",
  responses: "++id, jobId, candidateId, answers, submittedAt",
});

// ✅ Safe initialization - wait for DB to open
let dbReady = false;

export const initDB = async () => {
  if (dbReady) return;
  try {
    await db.open();
    dbReady = true;
    console.log("✅ Dexie DB opened successfully");
  } catch (e) {
    console.error("❌ Dexie open error:", e);
    throw e;
  }
};

// Initialize immediately
initDB();

// Expose db in browser console (optional for debugging)
if (typeof window !== "undefined") {
  window.db = db;
}

// ================== ASSESSMENTS API ==================
export const assessmentsAPI = {
  async getByJobId(jobId) {
    await initDB();
    return db.assessments.where("jobId").equals(Number(jobId)).first();
  },

  async upsertByJobId(jobId, payload) {
    await initDB();
    const now = new Date().toISOString();
    const existing = await db.assessments
      .where("jobId")
      .equals(Number(jobId))
      .first();

    if (existing) {
      await db.assessments.update(existing.id, {
        ...existing,
        ...payload,
        updatedAt: now,
      });
      return db.assessments.get(existing.id);
    } else {
      const id = await db.assessments.add({
        jobId: Number(jobId),
        title: payload.title || `Assessment for Job ${jobId}`,
        description: payload.description || `Assessment for ${payload.title || 'this position'}`,
        duration: payload.duration || 60,
        sections: payload.sections || [],
        createdAt: now,
        updatedAt: now,
      });
      return db.assessments.get(id);
    }
  },

  async getAll() {
    await initDB();
    return db.assessments.toArray();
  },
};

// ================== RESPONSES API ==================
export const responsesAPI = {
  async submit(jobId, candidateId, answers) {
    await initDB();
    const now = new Date().toISOString();
    const id = await db.responses.add({
      jobId: Number(jobId),
      candidateId: Number(candidateId),
      answers,
      submittedAt: now,
    });
    return db.responses.get(id);
  },

  async getByCandidate(candidateId) {
    await initDB();
    return db.responses
      .where("candidateId")
      .equals(Number(candidateId))
      .toArray();
  },

  async getByJob(jobId) {
    await initDB();
    return db.responses.where("jobId").equals(Number(jobId)).toArray();
  },
};