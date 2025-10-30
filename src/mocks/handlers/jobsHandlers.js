
import { http, HttpResponse } from "msw";
import { db, initDB } from "../../db/dexieDB";

const randomDelay = () => 200 + Math.floor(Math.random() * 1000); // 200-1200ms
const randomFail = (rate = 0.08) => Math.random() < rate;

// Helper to add delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const jobsHandlers = [
  // GET /api/jobs (search, status, page, pageSize)
  http.get("/api/jobs", async ({ request }) => {
    await delay(randomDelay());

    try {
      await initDB();

      const url = new URL(request.url);
      const search = (url.searchParams.get("search") || "").toLowerCase();
      const status = url.searchParams.get("status") || "";
      const page = Number(url.searchParams.get("page") || 1);
      const pageSize = Number(url.searchParams.get("pageSize") || 9);

      const allJobs = await db.jobs.toArray();
      const filtered = allJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(search) &&
          (status ? j.status === status : true)
      );

      const start = (page - 1) * pageSize;
      const pageData = filtered.slice(start, start + pageSize);

      return HttpResponse.json(
        { data: pageData, total: filtered.length, page, pageSize },
        { status: 200 }
      );
    } catch (err) {
      console.error("❌ Error fetching jobs:", err);
      return HttpResponse.json(
        { error: "Failed to fetch jobs", message: err.message },
        { status: 500 }
      );
    }
  }),

  // GET single job
  http.get("/api/jobs/:id", async ({ params }) => {
    await delay(randomDelay());

    try {
      await initDB();
      const job = await db.jobs.get(Number(params.id));

      if (!job) {
        return HttpResponse.json(
          { error: "Job not found" },
          { status: 404 }
        );
      }

      return HttpResponse.json(job, { status: 200 });
    } catch (err) {
      console.error("❌ Error fetching job:", err);
      return HttpResponse.json(
        { error: "Failed to fetch job", message: err.message },
        { status: 500 }
      );
    }
  }),

  // POST /api/jobs
  http.post("/api/jobs", async ({ request }) => {
    await delay(randomDelay());

    if (randomFail()) {
      return HttpResponse.json(
        { error: "Write failed" },
        { status: 500 }
      );
    }

    try {
      await initDB();
      const body = await request.json();

      // unique slug check
      const slug =
        body.slug || (body.title || "").toLowerCase().replace(/\s+/g, "-");
      const exists = await db.jobs.where("slug").equals(slug).first();

      if (exists) {
        return HttpResponse.json(
          { error: "Slug exists" },
          { status: 400 }
        );
      }

      const id = await db.jobs.add({
        ...body,
        slug,
        status: body.status || "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: body.order ?? Date.now(),
      });

      const created = await db.jobs.get(id);
      return HttpResponse.json(created, { status: 201 });
    } catch (err) {
      console.error("❌ Error creating job:", err);
      return HttpResponse.json(
        { error: "Failed to create job", message: err.message },
        { status: 500 }
      );
    }
  }),

  // PATCH /api/jobs/:id
  http.patch("/api/jobs/:id", async ({ params, request }) => {
    await delay(randomDelay());

    if (randomFail()) {
      return HttpResponse.json(
        { error: "Write failed" },
        { status: 500 }
      );
    }

    try {
      await initDB();
      const body = await request.json();
      const id = Number(params.id);

      // If slug changes, ensure uniqueness
      if (body.slug) {
        const other = await db.jobs
          .where("slug")
          .equals(body.slug)
          .and((j) => j.id !== id)
          .first();

        if (other) {
          return HttpResponse.json(
            { error: "Slug exists" },
            { status: 400 }
          );
        }
      }

      await db.jobs.update(id, {
        ...body,
        updatedAt: new Date().toISOString(),
      });

      const updated = await db.jobs.get(id);
      return HttpResponse.json(updated, { status: 200 });
    } catch (err) {
      console.error("❌ Error updating job:", err);
      return HttpResponse.json(
        { error: "Failed to update job", message: err.message },
        { status: 500 }
      );
    }
  }),

  // PATCH reorder — occasionally fail to test rollback
  http.patch("/api/jobs/:id/reorder", async ({ params, request }) => {
    await delay(randomDelay());

    const failRate = 0.1; // 10% fail
    if (randomFail(failRate)) {
      return HttpResponse.json(
        { error: "Reorder failed" },
        { status: 500 }
      );
    }

    try {
      await initDB();
      const body = await request.json();
      const id = Number(params.id);
      const { fromOrder, toOrder } = body;

      await db.jobs.update(id, { order: toOrder });

      return HttpResponse.json(
        { id, fromOrder, toOrder },
        { status: 200 }
      );
    } catch (err) {
      console.error("❌ Error reordering job:", err);
      return HttpResponse.json(
        { error: "Failed to reorder job", message: err.message },
        { status: 500 }
      );
    }
  }),

  // DELETE /api/jobs/:id (optional - for archive functionality)
  http.delete("/api/jobs/:id", async ({ params }) => {
    await delay(randomDelay());

    if (randomFail()) {
      return HttpResponse.json(
        { error: "Delete failed" },
        { status: 500 }
      );
    }

    try {
      await initDB();
      const id = Number(params.id);
      await db.jobs.delete(id);

      return HttpResponse.json(
        { message: "Job deleted", id },
        { status: 200 }
      );
    } catch (err) {
      console.error("❌ Error deleting job:", err);
      return HttpResponse.json(
        { error: "Failed to delete job", message: err.message },
        { status: 500 }
      );
    }
  }),
];