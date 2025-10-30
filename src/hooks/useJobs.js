// src/hooks/useJobs.js
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "../api/jobs";

export const useJobs = (filters) => {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => fetchJobs(filters),
    keepPreviousData: true,
  });
};
