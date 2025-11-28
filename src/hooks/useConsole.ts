import { useState, useCallback } from 'react';
import type { ConsoleEntry, HttpMethod } from '@/types/api';

const generateId = () => Math.random().toString(36).substring(2, 15);

export function useConsole() {
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);

  const addEntry = useCallback(
    (
      type: ConsoleEntry['type'],
      message: string,
      details?: Record<string, unknown>,
      method?: HttpMethod,
      url?: string
    ) => {
      const entry: ConsoleEntry = {
        id: generateId(),
        timestamp: new Date(),
        type,
        message,
        details,
        method,
        url,
      };
      setEntries((prev) => [...prev, entry]);
    },
    []
  );

  const logRequest = useCallback(
    (
      method: HttpMethod,
      url: string,
      headers: Record<string, string>,
      body?: string
    ) => {
      addEntry(
        'request',
        `${method} ${url}`,
        {
          headers,
          body: body ? JSON.parse(body).catch?.() ?? body : undefined,
        },
        method,
        url
      );
    },
    [addEntry]
  );

  const logResponse = useCallback(
    (
      method: HttpMethod,
      url: string,
      status: number,
      statusText: string,
      time: number,
      size: number
    ) => {
      addEntry(
        'response',
        `${status} ${statusText} — ${time}ms — ${formatSize(size)}`,
        { status, statusText, time, size },
        method,
        url
      );
    },
    [addEntry]
  );

  const logError = useCallback(
    (method: HttpMethod, url: string, error: string) => {
      addEntry('error', error, { error }, method, url);
    },
    [addEntry]
  );

  const logInfo = useCallback(
    (message: string, details?: Record<string, unknown>) => {
      addEntry('info', message, details);
    },
    [addEntry]
  );

  const clearConsole = useCallback(() => {
    setEntries([]);
  }, []);

  return {
    entries,
    logRequest,
    logResponse,
    logError,
    logInfo,
    clearConsole,
  };
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
