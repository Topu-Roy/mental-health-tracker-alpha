"use client";

import React, { useState } from "react";
import {
  useJournalEntriesQuery,
  useCreateJournalEntryMutation,
  useDeleteJournalEntryMutation,
  useUpdateJournalEntryMutation,
} from "@/hooks/useJournal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Trash2, Edit2, X, Check, Frown, Meh, ThumbsUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Mood = "Great" | "Good" | "Okay" | "Bad" | "Awful";

const MOODS: { value: Mood; icon: React.ElementType; label: string; color: string }[] = [
  { value: "Great", icon: Heart, label: "Great", color: "text-pink-500" },
  { value: "Good", icon: ThumbsUp, label: "Good", color: "text-green-500" },
  { value: "Okay", icon: Meh, label: "Okay", color: "text-yellow-500" },
  { value: "Bad", icon: Frown, label: "Bad", color: "text-orange-500" },
  { value: "Awful", icon: Frown, label: "Awful", color: "text-red-500" },
];

export function JournalList() {
  const { data: entries = [] } = useJournalEntriesQuery();
  const createEntry = useCreateJournalEntryMutation();
  const deleteEntry = useDeleteJournalEntryMutation();
  const updateEntry = useUpdateJournalEntryMutation();

  const [mounted, setMounted] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood>("Good");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = () => {
    if (!newEntry.trim()) return;
    createEntry.mutate({ content: newEntry, mood: selectedMood });
    setNewEntry("");
    setSelectedMood("Good");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startEditing = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
  };

  const saveEdit = (id: string) => {
    if (editContent.trim()) {
      updateEntry.mutate({ id, content: editContent });
    }
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteEntry.mutate(id);
    }
  };

  // Group entries by date
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = new Date(entry.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, typeof entries>);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full space-y-6">
      <p className="font-semibold text-2xl">Add new entry</p>

      <Card className="p-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MOODS.map((mood) => {
            const Icon = mood.icon;
            return (
              <Button
                key={mood.value}
                variant={selectedMood === mood.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMood(mood.value)}
                className={cn(
                  "flex items-center gap-2 transition-all",
                  selectedMood === mood.value ? "" : "hover:bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    selectedMood === mood.value ? "text-primary-foreground" : mood.color
                  )}
                />
                {mood.label}
              </Button>
            );
          })}
        </div>
        <div className="relative">
          <Textarea
            placeholder="How are you feeling right now?"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] resize-none pr-12"
          />
          <Button
            onClick={handleSubmit}
            disabled={!newEntry.trim() || createEntry.isPending}
            className="absolute bottom-2 right-2 h-8 w-8 p-0"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {Object.entries(groupedEntries).map(([date, dayEntries]) => (
          <div key={date} className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-2 z-10">
              {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </h3>
            <div className="space-y-4">
              {dayEntries.map((entry) => (
                <Card key={entry.id} className="relative group">
                  <CardContent className="p-4 pt-4">
                    {editingId === entry.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={cancelEditing}>
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveEdit(entry.id)}
                            disabled={updateEntry.isPending}
                          >
                            <Check className="h-4 w-4 mr-1" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              {entry.mood && (
                                <span
                                  className={cn(
                                    "text-xs px-2 py-0.5 rounded-full bg-muted font-medium",
                                    MOODS.find((m) => m.value === entry.mood)?.color
                                  )}
                                >
                                  {entry.mood}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(entry.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{entry.content}</p>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/80 backdrop-blur-sm rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => startEditing(entry.id, entry.content)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-center text-muted-foreground py-10">No entries yet. Start writing above!</div>
        )}
      </div>
    </div>
  );
}
