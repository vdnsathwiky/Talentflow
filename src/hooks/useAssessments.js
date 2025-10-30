import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAssessmentByJobId,
  saveAssessment,
  submitAssessmentResponse,
} from "../api/assessments";

/**
 * Hook to fetch an assessment by jobId
 */
export function useAssessment(jobId) {
  return useQuery({
    queryKey: ["assessment", jobId],
    queryFn: () => getAssessmentByJobId(jobId),
    enabled: !!jobId,
  });
}

/**
 * Hook to update (PUT) an assessment
 */
export function useSaveAssessment(jobId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => saveAssessment(jobId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["assessment", jobId], updated);
    },
    onError: (error) => {
      console.error("Failed to save assessment:", error);
      alert("❌ Failed to save assessment. Please try again.");
    },
  });
}

/**
 * Hook to submit candidate responses
 */
export function useSubmitAssessment(jobId, candidateId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (responses) =>
      submitAssessmentResponse(jobId, candidateId, responses),
    onSuccess: (submission) => {
      console.log("✅ Assessment submitted:", submission);
      queryClient.invalidateQueries(["responses", jobId, candidateId]);
    },
    onError: (error) => {
      console.error("Failed to submit assessment:", error);
      alert("❌ Submission failed. Please try again.");
    },
  });
}
