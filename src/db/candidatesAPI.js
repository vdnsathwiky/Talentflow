
import { db } from './dexieDB';

export const candidatesAPI = {
  async getAll() {
    await db.open();
    return db.candidates
      .orderBy('id') // Sort by ID numerically
      .toArray();
  },

  async getByStage(stage) {
    await db.open();
    if (stage === 'all') {
      return db.candidates
        .orderBy('id') // Sort by ID numerically
        .toArray();
    }
    const candidates = await db.candidates
      .where('stage')
      .equals(stage)
      .toArray();

    // Sort by ID numerically
    return candidates.sort((a, b) => a.id - b.id);
  },

  async searchCandidates(searchTerm) {
    await db.open();
    const allCandidates = await db.candidates
      .orderBy('id') // Sort by ID numerically
      .toArray();

    if (!searchTerm) return allCandidates;

    const filtered = allCandidates.filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Already sorted by ID from the query
    return filtered;
  },

  async getById(id) {
    await db.open();
    return db.candidates.get(Number(id));
  },

  async updateStage(candidateId, newStage) {
    await db.open();
    const updated = {
      stage: newStage,
      updatedAt: new Date().toISOString()
    };

    await db.candidates.update(Number(candidateId), updated);
    return db.candidates.get(Number(candidateId));
  }
};