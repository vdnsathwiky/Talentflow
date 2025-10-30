
import { useQuery } from '@tanstack/react-query';
import { candidatesAPI } from '../db/candidatesAPI';

export function useCandidates({ search, stage, page, pageSize } = {}) {
  return useQuery({
    queryKey: ['candidates', { search, stage, page, pageSize }],
    queryFn: async () => {
      console.log('🔍 Fetching candidates from Dexie...');

      let allCandidates;

      // Apply search filter
      if (search) {
        allCandidates = await candidatesAPI.searchCandidates(search);
      } else if (stage && stage !== 'all') {
        allCandidates = await candidatesAPI.getByStage(stage);
      } else {
        allCandidates = await candidatesAPI.getAll();
      }

      console.log('📊 Raw candidates from Dexie:', allCandidates);

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = allCandidates.slice(startIndex, endIndex);

      const result = {
        data: paginatedData,
        meta: {
          page,
          pageSize,
          total: allCandidates.length,
          totalPages: Math.ceil(allCandidates.length / pageSize)
        }
      };

      console.log('📄 Paginated result:', result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}