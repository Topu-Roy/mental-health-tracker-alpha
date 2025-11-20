"use client";

import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';


import { Send } from 'lucide-react';

export function JournalList() {
  const { entries, addEntry } = useJournal();
  const [newEntry, setNewEntry] = useState('');

  const handleSubmit = () => {
    if (!newEntry.trim()) return;
    addEntry(newEntry);
    setNewEntry('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Group entries by date
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = new Date(entry.timestamp).toISOString().split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, typeof entries>);

  return (
    <div className="flex flex-col h-full space-y-4">
      <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold">Daily Journal</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <div className="h-[calc(100vh-300px)] pr-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-8">
              {Object.entries(groupedEntries).map(([date, dayEntries]) => (
                <div key={date} className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <div className="space-y-4">
                    {dayEntries.map((entry) => (
                      <div key={entry.id} className="bg-card p-4 rounded-lg border shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <p className="whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                        <p className="text-xs text-muted-foreground mt-2 text-right">
                          {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <div className="text-center text-muted-foreground py-20">
                  <p>No entries yet. Start writing about your day...</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          className="min-h-[100px] pr-12 resize-none bg-card/50 backdrop-blur focus:bg-card transition-colors"
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={!newEntry.trim()}
          className="absolute bottom-3 right-3 h-8 w-8"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
