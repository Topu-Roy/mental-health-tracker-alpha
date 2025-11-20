"use client";

import React, { useState } from "react";
import { useJournal } from "@/context/JournalContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Trash2, Edit2, X, Check } from "lucide-react";

export function JournalList() {
  const { entries, addEntry, deleteEntry, updateEntry } = useJournal();
  const [newEntry, setNewEntry] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmit = () => {
    if (!newEntry.trim()) return;
    addEntry(newEntry);
    setNewEntry("");
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
      updateEntry(id, editContent);
    }
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteEntry(id);
    }
  };

  // Group entries by date
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, typeof entries>);

  return (
    <div className="flex flex-col h-full space-y-6">
      <Card className="p-4">
        <div className="flex gap-4">
          <Textarea
            placeholder="How are you feeling right now?"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] resize-none"
          />
          <Button
            onClick={handleSubmit}
            size="icon"
            className="h-auto w-12 self-end mb-1"
            disabled={!newEntry.trim()}
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
                          <Button size="sm" onClick={() => saveEdit(entry.id)}>
                            <Check className="h-4 w-4 mr-1" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start gap-4">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed flex-1">
                            {entry.content}
                          </p>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {new Date(entry.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
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
