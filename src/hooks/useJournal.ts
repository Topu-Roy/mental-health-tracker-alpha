"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createJournalEntry,
  getJournalEntries,
  deleteJournalEntry,
  updateJournalEntry,
} from "@/action/journal";
import { queryClient } from "@/provider/tanstack-query/provider";

export function useJournalEntriesQuery() {
  return useQuery({
    queryKey: ["journalEntries"],
    queryFn: () => getJournalEntries(),
  });
}

export function useCreateJournalEntryMutation() {
  return useMutation({
    mutationFn: createJournalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
    },
  });
}

export function useDeleteJournalEntryMutation() {
  return useMutation({
    mutationFn: deleteJournalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
    },
  });
}

export function useUpdateJournalEntryMutation() {
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => updateJournalEntry(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
    },
  });
}
