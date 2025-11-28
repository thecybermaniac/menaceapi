import { useState, useCallback } from 'react';
import type {
  RequestConfig,
  HttpMethod,
  BodyType,
  RawBodyFormat,
  KeyValuePair,
  FormDataPair,
} from '@/types/api';

// Generate a simple unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Create an empty key-value pair
const createEmptyPair = (): KeyValuePair => ({
  id: generateId(),
  key: '',
  value: '',
  enabled: true,
});

// Create an empty form data pair
const createEmptyFormDataPair = (): FormDataPair => ({
  id: generateId(),
  key: '',
  value: '',
  valueType: 'text',
  file: null,
  enabled: true,
});

// Initial request state
const initialRequest: RequestConfig = {
  method: 'GET',
  url: '',
  params: [createEmptyPair()],
  headers: [createEmptyPair()],
  bodyType: 'none',
  rawBody: '',
  rawBodyFormat: 'json',
  formData: [createEmptyFormDataPair()],
};

export function useRequestState() {
  const [request, setRequest] = useState<RequestConfig>(initialRequest);

  // Update HTTP method
  const setMethod = useCallback((method: HttpMethod) => {
    setRequest((prev) => ({ ...prev, method }));
  }, []);

  // Update URL
  const setUrl = useCallback((url: string) => {
    setRequest((prev) => ({ ...prev, url }));
  }, []);

  // Update body type
  const setBodyType = useCallback((bodyType: BodyType) => {
    setRequest((prev) => ({ ...prev, bodyType }));
  }, []);

  // Update raw body content
  const setRawBody = useCallback((rawBody: string) => {
    setRequest((prev) => ({ ...prev, rawBody }));
  }, []);

  // Update raw body format
  const setRawBodyFormat = useCallback((rawBodyFormat: RawBodyFormat) => {
    setRequest((prev) => ({ ...prev, rawBodyFormat }));
  }, []);

  // Generic function to update key-value pairs
  const updateKeyValuePair = useCallback(
    (
      field: 'params' | 'headers',
      id: string,
      updates: Partial<KeyValuePair>
    ) => {
      setRequest((prev) => ({
        ...prev,
        [field]: prev[field].map((pair) =>
          pair.id === id ? { ...pair, ...updates } : pair
        ),
      }));
    },
    []
  );

  // Add a new key-value pair
  const addKeyValuePair = useCallback(
    (field: 'params' | 'headers') => {
      setRequest((prev) => ({
        ...prev,
        [field]: [...prev[field], createEmptyPair()],
      }));
    },
    []
  );

  // Remove a key-value pair
  const removeKeyValuePair = useCallback(
    (field: 'params' | 'headers', id: string) => {
      setRequest((prev) => {
        const filtered = prev[field].filter((pair) => pair.id !== id);
        // Always keep at least one empty row
        return {
          ...prev,
          [field]: filtered.length === 0 ? [createEmptyPair()] : filtered,
        };
      });
    },
    []
  );

  // Update form data pair
  const updateFormDataPair = useCallback(
    (id: string, updates: Partial<FormDataPair>) => {
      setRequest((prev) => ({
        ...prev,
        formData: prev.formData.map((pair) =>
          pair.id === id ? { ...pair, ...updates } : pair
        ),
      }));
    },
    []
  );

  // Add a new form data pair
  const addFormDataPair = useCallback(() => {
    setRequest((prev) => ({
      ...prev,
      formData: [...prev.formData, createEmptyFormDataPair()],
    }));
  }, []);

  // Remove a form data pair
  const removeFormDataPair = useCallback((id: string) => {
    setRequest((prev) => {
      const filtered = prev.formData.filter((pair) => pair.id !== id);
      return {
        ...prev,
        formData: filtered.length === 0 ? [createEmptyFormDataPair()] : filtered,
      };
    });
  }, []);

  // Reset request to initial state
  const resetRequest = useCallback(() => {
    setRequest(initialRequest);
  }, []);

  // Load a request configuration
  const loadRequest = useCallback((config: RequestConfig) => {
    setRequest(config);
  }, []);

  return {
    request,
    setMethod,
    setUrl,
    setBodyType,
    setRawBody,
    setRawBodyFormat,
    updateKeyValuePair,
    addKeyValuePair,
    removeKeyValuePair,
    updateFormDataPair,
    addFormDataPair,
    removeFormDataPair,
    resetRequest,
    loadRequest,
  };
}
