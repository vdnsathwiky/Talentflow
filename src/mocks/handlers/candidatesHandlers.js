
import { http, HttpResponse, delay } from 'msw';
import { db } from '../../db/dexieDB';

export const candidatesHandlers = [
  // GET /api/candidates - with pagination, search, and filtering
  http.get('/api/candidates', async ({ request }) => {
    await delay(Math.random() * 800 + 200); // 200-1000ms delay

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');

    try {
      let query = db.candidates;

      // Apply filters
      if (search) {
        const candidates = await query.toArray();
        const filtered = candidates.filter(c =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
        );

        if (stage) {
          const stageFiltered = filtered.filter(c => c.stage === stage);
          const total = stageFiltered.length;
          const start = (page - 1) * pageSize;
          const paginatedData = stageFiltered.slice(start, start + pageSize);

          return HttpResponse.json({
            data: paginatedData,
            meta: {
              page,
              pageSize,
              total,
              totalPages: Math.ceil(total / pageSize)
            }
          });
        }

        const total = filtered.length;
        const start = (page - 1) * pageSize;
        const paginatedData = filtered.slice(start, start + pageSize);

        return HttpResponse.json({
          data: paginatedData,
          meta: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
          }
        });
      }

      if (stage) {
        query = query.where('stage').equals(stage);
      }

      const total = await query.count();
      const data = await query
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

      return HttpResponse.json({
        data,
        meta: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    } catch (error) {
      console.error('Error in GET /api/candidates:', error);
      return HttpResponse.json(
        { error: 'Failed to fetch candidates' },
        { status: 500 }
      );
    }
  }),

  // POST /api/candidates
  http.post('/api/candidates', async ({ request }) => {
    await delay(Math.random() * 800 + 200);

    // Simulate 5-10% error rate
    if (Math.random() < 0.075) {
      return HttpResponse.json(
        { error: 'Failed to create candidate' },
        { status: 500 }
      );
    }

    try {
      const body = await request.json();
      const newCandidate = {
        id: Date.now().toString(),
        ...body,
        createdAt: new Date().toISOString()
      };

      await db.candidates.add(newCandidate);
      return HttpResponse.json(newCandidate, { status: 201 });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Failed to create candidate' },
        { status: 500 }
      );
    }
  }),

  // PATCH /api/candidates/:id
  http.patch('/api/candidates/:id', async ({ request, params }) => {
    await delay(Math.random() * 800 + 200);

    // Simulate error rate
    if (Math.random() < 0.075) {
      return HttpResponse.json(
        { error: 'Failed to update candidate' },
        { status: 500 }
      );
    }

    try {
      const { id } = params;
      const updates = await request.json();

      const candidate = await db.candidates.get(id);
      if (!candidate) {
        return HttpResponse.json(
          { error: 'Candidate not found' },
          { status: 404 }
        );
      }

      const updated = { ...candidate, ...updates, updatedAt: new Date().toISOString() };
      await db.candidates.update(id, updated);

      // Add to timeline if stage changed
      if (updates.stage && updates.stage !== candidate.stage) {
        await db.timeline.add({
          id: Date.now().toString(),
          candidateId: id,
          stage: updates.stage,
          timestamp: new Date().toISOString(),
          note: updates.note || `Moved to ${updates.stage}`
        });
      }

      return HttpResponse.json(updated);
    } catch (error) {
      return HttpResponse.json(
        { error: 'Failed to update candidate' },
        { status: 500 }
      );
    }
  }),

  // GET /api/candidates/:id/timeline
  http.get('/api/candidates/:id/timeline', async ({ params }) => {
    await delay(Math.random() * 500 + 200);

    try {
      const { id } = params;
      const timeline = await db.timeline
        .where('candidateId')
        .equals(id)
        .sortBy('timestamp');

      return HttpResponse.json(timeline);
    } catch (error) {
      return HttpResponse.json(
        { error: 'Failed to fetch timeline' },
        { status: 500 }
      );
    }
  }),
];