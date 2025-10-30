
import { http, HttpResponse } from "msw";
import { db, initDB } from "../../db/dexieDB";

// Helper to add artificial delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 5-10% error rate helper
const maybeFail = () => Math.random() < 0.08;

export const assessmentsHandlers = [
  // 📘 GET /assessments/:jobId
  http.get("/assessments/:jobId", async ({ params }) => {
    await delay(300 + Math.random() * 700);
    const jobId = parseInt(params.jobId);

    try {
      await initDB(); // ✅ Ensure DB is ready
      const assessment = await db.assessments
        .where("jobId")
        .equals(jobId)
        .first();

      if (!assessment) {
        return HttpResponse.json(
          {
            jobId,
            title: "Untitled Assessment",
            definition: { sections: [] },
          },
          { status: 200 }
        );
      }

      return HttpResponse.json(assessment, { status: 200 });
    } catch (err) {
      console.error("❌ Failed to fetch assessment:", err);
      return HttpResponse.json(
        { message: "Failed to fetch assessment", error: err.message },
        { status: 500 }
      );
    }
  }),

  // 🧱 PUT /assessments/:jobId
  http.put("/assessments/:jobId", async ({ params, request }) => {
    await delay(300 + Math.random() * 700);

    if (maybeFail()) {
      return HttpResponse.json(
        { message: "Server error while saving assessment" },
        { status: 500 }
      );
    }

    const jobId = parseInt(params.jobId);
    const payload = await request.json();

    try {
      await initDB(); // ✅ Ensure DB is ready
      const now = new Date().toISOString();
      const existing = await db.assessments
        .where("jobId")
        .equals(jobId)
        .first();

      if (existing) {
        await db.assessments.update(existing.id, {
          ...existing,
          ...payload,
          updatedAt: now,
        });
      } else {
        await db.assessments.add({
          jobId,
          title: payload.title || `Assessment ${jobId}`,
          definition: payload.definition || payload,
          createdAt: now,
          updatedAt: now,
        });
      }

      const updated = await db.assessments
        .where("jobId")
        .equals(jobId)
        .first();
      return HttpResponse.json(updated, { status: 200 });
    } catch (err) {
      console.error("❌ Failed to save assessment:", err);
      return HttpResponse.json(
        { message: "Failed to save assessment", error: err.message },
        { status: 500 }
      );
    }
  }),

  // 📝 POST /assessments/:jobId/submit
  http.post("/assessments/:jobId/submit", async ({ params, request }) => {
    await delay(300 + Math.random() * 700);

    if (maybeFail()) {
      return HttpResponse.json(
        { message: "Server error while submitting assessment" },
        { status: 500 }
      );
    }

    const jobId = parseInt(params.jobId);
    const submission = await request.json();

    try {
      await initDB(); // ✅ Ensure DB is ready
      const now = new Date().toISOString();
      const id = await db.responses.add({
        jobId,
        candidateId: submission.candidateId,
        answers: submission.answers,
        submittedAt: now,
      });

      const saved = await db.responses.get(id);
      return HttpResponse.json(saved, { status: 200 });
    } catch (err) {
      console.error("❌ Failed to save submission:", err);
      return HttpResponse.json(
        { message: "Failed to save submission", error: err.message },
        { status: 500 }
      );
    }
  }),

  // 📊 GET all assessments
  http.get("/assessments", async () => {
    await delay(200 + Math.random() * 500);

    try {
      await initDB();
      const assessments = await db.assessments.toArray();

      return HttpResponse.json(
        { data: assessments, total: assessments.length },
        { status: 200 }
      );
    } catch (err) {
      console.error("❌ Failed to fetch assessments:", err);
      return HttpResponse.json(
        { message: "Failed to fetch assessments", error: err.message },
        { status: 500 }
      );
    }
  }),
];