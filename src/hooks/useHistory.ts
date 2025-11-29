import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { HistoryEntry, RequestConfig, ResponseData, KeyValuePair, FormDataPair } from '@/types/api';
import type { Json } from '@/integrations/supabase/types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load history from database on mount and when user changes
  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('request_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Failed to load history:', error);
      } else if (data) {
        const entries: HistoryEntry[] = data.map((row) => ({
          id: row.id,
          timestamp: new Date(row.created_at),
          request: {
            method: row.method as RequestConfig['method'],
            url: row.url,
            params: (row.params as unknown as KeyValuePair[]) || [],
            headers: (row.headers as unknown as KeyValuePair[]) || [],
            bodyType: (row.body_type as RequestConfig['bodyType']) || 'none',
            rawBody: row.raw_body || '',
            rawBodyFormat: (row.raw_body_format as RequestConfig['rawBodyFormat']) || 'json',
            formData: (row.form_data as unknown as FormDataPair[]) || [],
          },
          response: row.response_status
            ? {
                status: row.response_status,
                statusText: row.response_status_text || '',
                headers: (row.response_headers as unknown as Record<string, string>) || {},
                body: row.response_body || '',
                size: row.response_size || 0,
                time: row.response_time || 0,
                error: row.response_error || undefined,
              }
            : undefined,
        }));
        setHistory(entries);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  // Add a new history entry
  const addToHistory = useCallback(
    async (request: RequestConfig, response?: ResponseData) => {
      if (!user) return;

      const insertData = {
        user_id: user.id,
        method: request.method,
        url: request.url,
        params: request.params as unknown as Json,
        headers: request.headers as unknown as Json,
        body_type: request.bodyType,
        raw_body: request.rawBody,
        raw_body_format: request.rawBodyFormat,
        form_data: request.formData.map((fd) => ({
          id: fd.id,
          key: fd.key,
          value: fd.value,
          valueType: fd.valueType,
          enabled: fd.enabled,
        })) as unknown as Json,
        response_status: response?.status ?? null,
        response_status_text: response?.statusText ?? null,
        response_headers: (response?.headers ?? null) as unknown as Json,
        response_body: response?.body ?? null,
        response_size: response?.size ?? null,
        response_time: response?.time ?? null,
        response_error: response?.error ?? null,
      };

      const { data, error } = await supabase
        .from('request_history')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Failed to save history:', error);
      } else if (data) {
        const entry: HistoryEntry = {
          id: data.id,
          timestamp: new Date(data.created_at),
          request: { ...request },
          response: response ? { ...response } : undefined,
        };

        setHistory((prev) => {
          const newHistory = [entry, ...prev];
          return newHistory.slice(0, 50);
        });
      }
    },
    [user]
  );

  // Remove a history entry
  const removeFromHistory = useCallback(
    async (id: string) => {
      if (!user) return;

      const { error } = await supabase
        .from('request_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to delete history entry:', error);
      } else {
        setHistory((prev) => prev.filter((entry) => entry.id !== id));
      }
    },
    [user]
  );

  // Clear all history
  const clearHistory = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('request_history')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to clear history:', error);
    } else {
      setHistory([]);
    }
  }, [user]);

  return {
    history,
    loading,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
