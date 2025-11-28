// HTTP Methods supported by the API client
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

// Body types for requests
export type BodyType = 'none' | 'raw' | 'form-data';
export type RawBodyFormat = 'text' | 'json';

// Key-value pair with enable/disable toggle
export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

// Form data value type
export type FormDataValueType = 'text' | 'file';

// Form data pair with file support
export interface FormDataPair {
  id: string;
  key: string;
  value: string;
  valueType: FormDataValueType;
  file: File | null;
  enabled: boolean;
}

// Request configuration
export interface RequestConfig {
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  bodyType: BodyType;
  rawBody: string;
  rawBodyFormat: RawBodyFormat;
  formData: FormDataPair[];
}

// Response data structure
export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  size: number;
  time: number;
  error?: string;
}

// Console log entry
export interface ConsoleEntry {
  id: string;
  timestamp: Date;
  type: 'request' | 'response' | 'error' | 'info';
  method?: HttpMethod;
  url?: string;
  message: string;
  details?: Record<string, unknown>;
}

// History entry for storing past requests
export interface HistoryEntry {
  id: string;
  timestamp: Date;
  request: RequestConfig;
  response?: ResponseData;
}

// Tab types for request panel
export type RequestTab = 'params' | 'headers' | 'body';

// Tab types for response panel
export type ResponseTab = 'body' | 'headers' | 'cookies';
