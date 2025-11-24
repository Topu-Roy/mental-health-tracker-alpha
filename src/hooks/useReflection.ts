"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { createDailyReflection, getDailyReflection, getReflections } from "@/action/reflection";
import { queryClient } from "@/provider/tanstack-query/provider";

export function useReflectionsQuery() {
  return useQuery({
    queryKey: ["reflections"],
    queryFn: () => getReflections(),
  });
}

export function useDailyReflectionQuery({ date }: { date: Date }) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["dailyReflection", `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`],
    queryFn: () => getDailyReflection(date),
  });
}

export function useCreateDailyReflectionMutation({ date }: { date: Date }) {
  return useMutation({
    mutationFn: createDailyReflection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dailyReflection", `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`],
      });
    },
  });
}
