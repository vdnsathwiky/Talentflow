import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../db/dexieDB";

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const id = await db.jobs.add({
        ...payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      });
      return { ...payload, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      await db.jobs.update(id, payload);
      return { id, ...payload };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
    },
  });
}

export function useReorderJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newOrderArray) => {
      // update all order values
      await Promise.all(
        newOrderArray.map((job, index) =>
          db.jobs.update(job.id, { order: index })
        )
      );
      return newOrderArray;
    },
    onMutate: async (newOrderArray) => {
      const prev = queryClient.getQueryData(["jobs"]);
      queryClient.setQueryData(["jobs"], newOrderArray);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["jobs"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["jobs"]);
    },
  });
}
