
import { db } from "../db/dexieDB";

// Simulate latency & error
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
function randomError(prob = 0.1) {
  if (Math.random() < prob) throw new Error("Simulated server error");
}

// GET /assessments/:jobId
export async function getAssessmentByJobId(jobId) {
  await delay(400 + Math.random() * 800);
  const assessment = await db.assessments.where("jobId").equals(Number(jobId)).first();

  if (!assessment) {
    return {
      jobId: Number(jobId),
      title: `Assessment ${jobId}`,
      definition: { sections: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  return assessment;
}

// PUT /assessments/:jobId
export async function saveAssessment(jobId, payload) {
  await delay(400 + Math.random() * 800);
  randomError(0.05);
  const now = new Date().toISOString();

  const existing = await db.assessments.where("jobId").equals(Number(jobId)).first();

  if (existing) {
    await db.assessments.update(existing.id, { ...existing, ...payload, updatedAt: now });
    return db.assessments.get(existing.id);
  } else {
    const id = await db.assessments.add({
      jobId: Number(jobId),
      ...payload,
      createdAt: now,
      updatedAt: now,
    });
    return db.assessments.get(id);
  }
}

// POST /assessments/:jobId/submit
export async function submitAssessmentResponse(jobId, candidateId, answers) {
  await delay(400 + Math.random() * 800);
  randomError(0.05);

  const submission = {
    jobId: Number(jobId),
    candidateId: Number(candidateId),
    answers,
    submittedAt: new Date().toISOString(),
  };

  await db.responses.add(submission);
  return submission;
}
