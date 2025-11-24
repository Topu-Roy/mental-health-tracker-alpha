"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { createJournalEntry, getJournalEntries } from "@/action/journal";
import { queryClient } from "@/provider/tanstack-query/provider";

export function useJournalEntries() {
  return useQuery({
    queryKey: ["journalEntries"],
    queryFn: () => getJournalEntries(),
  });
}

export function useCreateJournalEntry() {
  return useMutation({
    mutationFn: createJournalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
    },
  });
}
