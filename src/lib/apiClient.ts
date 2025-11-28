import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type { RequestConfig, ResponseData, KeyValuePair, FormDataPair } from '@/types/api';

// Convert key-value pairs to object (only enabled ones)
function pairsToObject(pairs: KeyValuePair[]): Record<string, string> {
  return pairs
    .filter((pair) => pair.enabled && pair.key.trim())
    .reduce((acc, pair) => {
      acc[pair.key] = pair.value;
      return acc;
    }, {} as Record<string, string>);
}

// Build the full URL with query parameters
function buildUrl(baseUrl: string, params: KeyValuePair[]): string {
  const url = new URL(baseUrl, window.location.origin);
  const enabledParams = params.filter((p) => p.enabled && p.key.trim());
  
  enabledParams.forEach((param) => {
    url.searchParams.append(param.key, param.value);
  });

  // If the original URL was relative, return just the pathname + search
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    return url.pathname + url.search;
  }

  return url.toString();
}

// Prepare request body based on body type
function prepareBody(
  config: RequestConfig
): { data: string | FormData | undefined; contentType: string | undefined } {
  if (config.bodyType === 'none') {
    return { data: undefined, contentType: undefined };
  }

  if (config.bodyType === 'raw') {
    const contentType =
      config.rawBodyFormat === 'json' ? 'application/json' : 'text/plain';
    return { data: config.rawBody, contentType };
  }

  if (config.bodyType === 'form-data') {
    const formData = new FormData();
    config.formData
      .filter((pair) => pair.enabled && pair.key.trim())
      .forEach((pair) => {
        if (pair.valueType === 'file' && pair.file) {
          formData.append(pair.key, pair.file);
        } else if (pair.valueType === 'text') {
          formData.append(pair.key, pair.value);
        }
      });
    return { data: formData, contentType: undefined }; // Let browser set content-type
  }

  return { data: undefined, contentType: undefined };
}

// Execute the API request
export async function executeRequest(
  config: RequestConfig
): Promise<ResponseData> {
  const startTime = performance.now();

  try {
    // Build URL with query params
    const fullUrl = buildUrl(config.url, config.params);

    // Prepare headers
    const headers = pairsToObject(config.headers);

    // Prepare body
    const { data, contentType } = prepareBody(config);
    if (contentType && !headers['Content-Type']) {
      headers['Content-Type'] = contentType;
    }

    // Configure axios request
    const axiosConfig: AxiosRequestConfig = {
      method: config.method,
      url: fullUrl,
      headers,
      data,
      validateStatus: () => true, // Don't throw on any status code
      timeout: 30000,
    };

    // Execute request
    const response = await axios(axiosConfig);
    const endTime = performance.now();

    // Calculate response size
    let responseBody: string;
    if (typeof response.data === 'object') {
      responseBody = JSON.stringify(response.data, null, 2);
    } else {
      responseBody = String(response.data);
    }
    const size = new Blob([responseBody]).size;

    // Convert headers to simple object
    const responseHeaders: Record<string, string> = {};
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        responseHeaders[key] = value;
      } else if (Array.isArray(value)) {
        responseHeaders[key] = value.join(', ');
      }
    });

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      size,
      time: Math.round(endTime - startTime),
    };
  } catch (error) {
    const endTime = performance.now();
    const axiosError = error as AxiosError;

    // Handle network errors
    if (axiosError.code === 'ERR_NETWORK') {
      return {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        body: '',
        size: 0,
        time: Math.round(endTime - startTime),
        error:
          'Network error: Unable to reach the server. This may be due to CORS restrictions, network issues, or the server being unavailable.',
      };
    }

    // Handle timeout
    if (axiosError.code === 'ECONNABORTED') {
      return {
        status: 0,
        statusText: 'Timeout',
        headers: {},
        body: '',
        size: 0,
        time: Math.round(endTime - startTime),
        error: 'Request timeout: The server took too long to respond.',
      };
    }

    // Handle other errors
    return {
      status: 0,
      statusText: 'Error',
      headers: {},
      body: '',
      size: 0,
      time: Math.round(endTime - startTime),
      error: axiosError.message || 'An unexpected error occurred.',
    };
  }
}

// Get request metadata for logging
export function getRequestMetadata(config: RequestConfig) {
  const fullUrl = buildUrl(config.url, config.params);
  const headers = pairsToObject(config.headers);
  const { data, contentType } = prepareBody(config);

  if (contentType && !headers['Content-Type']) {
    headers['Content-Type'] = contentType;
  }

  return {
    method: config.method,
    url: fullUrl,
    headers,
    body: data instanceof FormData ? '[FormData]' : data,
  };
}
