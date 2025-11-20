"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JournalEntry, DailyReflection, EmotionTally, Emotion } from '@/types/journal';

interface JournalContextType {
  entries: JournalEntry[];
  reflections: DailyReflection[];
  addEntry: (content: string) => void;
  saveReflection: (reflection: Omit<DailyReflection, 'id' | 'timestamp'>) => void;
  getEntriesByDate: (date: Date) => JournalEntry[];
  todayReflection: DailyReflection | undefined;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [reflections, setReflections] = useState<DailyReflection[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journal_entries');
    const savedReflections = localStorage.getItem('journal_reflections');
    if (savedEntries) setEntries(JSON.parse(savedEntries, (key, value) => key === 'timestamp' ? new Date(value) : value));
    if (savedReflections) setReflections(JSON.parse(savedReflections, (key, value) => key === 'timestamp' ? new Date(value) : value));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('journal_reflections', JSON.stringify(reflections));
  }, [reflections]);

  const addEntry = (content: string) => {
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      content,
      timestamp: new Date(),
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const saveReflection = (data: Omit<DailyReflection, 'id' | 'timestamp'>) => {
    const newReflection: DailyReflection = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    // Replace existing reflection for the same date if exists, or add new
    setReflections(prev => {
      const filtered = prev.filter(r => r.date !== data.date);
      return [...filtered, newReflection];
    });
  };

  const getEntriesByDate = (date: Date) => {
    const dateStr = date.toDateString();
    return entries.filter(e => new Date(e.timestamp).toDateString() === dateStr);
  };

  const todayReflection = reflections.find(r => r.date === new Date().toISOString().split('T')[0]);

  return (
    <JournalContext.Provider value={{ entries, reflections, addEntry, saveReflection, getEntriesByDate, todayReflection }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
