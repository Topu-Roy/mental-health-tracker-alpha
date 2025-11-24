"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { createDailyReflection, getDailyReflection, getReflections } from "@/action/reflection";
import { queryClient } from "@/provider/tanstack-query/provider";

export function useReflections() {
  return useQuery({
    queryKey: ["reflections"],
    queryFn: () => getReflections(),
  });
}

export function useDailyReflection({ date }: { date: Date }) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["dailyReflection", `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`],
    queryFn: () => getDailyReflection(date),
  });
}

export function useCreateDailyReflection({ date }: { date: Date }) {
  return useMutation({
    mutationFn: createDailyReflection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dailyReflection", `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`],
      });
    },
  });
}
