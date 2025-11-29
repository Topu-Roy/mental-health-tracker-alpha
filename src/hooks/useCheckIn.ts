"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { createDailyCheckIn, getDailyCheckIn, getCheckIns } from "@/action/checkIn";
import { queryClient } from "@/provider/tanstack-query/provider";

export function useCheckInsQuery() {
  return useQuery({
    queryKey: ["checkIns"],
    queryFn: () => getCheckIns(),
  });
}

export function useDailyCheckInQuery({ date }: { date: Date }) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["dailyCheckIn", `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`],
    queryFn: () => getDailyCheckIn(date),
  });
}

export function useCreateDailyCheckInMutation({ date }: { date: Date }) {
  return useMutation({
    mutationFn: createDailyCheckIn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dailyCheckIn", `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`],
      });
      queryClient.invalidateQueries({ queryKey: ["checkIns"] });
    },
  });
}
