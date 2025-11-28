import { useState, useCallback, useEffect } from 'react';
import type { HistoryEntry, RequestConfig, ResponseData } from '@/types/api';

const STORAGE_KEY = 'api-tester-history';
const MAX_HISTORY_ITEMS = 50;

const generateId = () => Math.random().toString(36).substring(2, 15);

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const entries = parsed.map((entry: HistoryEntry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        setHistory(entries);
      }
    } catch (error) {
      console.error('Failed to load history from localStorage:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history to localStorage:', error);
    }
  }, [history]);

  // Add a new history entry
  const addToHistory = useCallback(
    (request: RequestConfig, response?: ResponseData) => {
      const entry: HistoryEntry = {
        id: generateId(),
        timestamp: new Date(),
        request: { ...request },
        response: response ? { ...response } : undefined,
      };

      setHistory((prev) => {
        const newHistory = [entry, ...prev];
        // Limit history size
        return newHistory.slice(0, MAX_HISTORY_ITEMS);
      });
    },
    []
  );

  // Remove a history entry
  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
