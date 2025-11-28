import { useState, Suspense, lazy } from 'react';
import { AlertCircle, Clock, HardDrive, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ResponseData, ResponseTab } from '@/types/api';
import { cn } from '@/lib/utils';

// Lazy load Monaco for response viewer
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

interface ResponsePanelProps {
  response: ResponseData | null;
  isLoading: boolean;
}

const tabs: { id: ResponseTab; label: string }[] = [
  { id: 'body', label: 'Body' },
  { id: 'headers', label: 'Headers' },
  { id: 'cookies', label: 'Cookies' },
];

export function ResponsePanel({ response, isLoading }: ResponsePanelProps) {
  const [activeTab, setActiveTab] = useState<ResponseTab>('body');
  const [copied, setCopied] = useState(false);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'status-success';
    if (status >= 300 && status < 400) return 'status-redirect';
    return 'status-error';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const copyToClipboard = async () => {
    if (response?.body) {
      await navigator.clipboard.writeText(response.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isJson = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  // Extract cookies from headers
  const cookies = response?.headers['set-cookie']?.split(';') || [];

  if (isLoading) {
    return (
      <div className="flex flex-col h-full panel">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Sending request...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex flex-col h-full panel">
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p className="text-sm">Enter a URL and click Send to get a response</p>
            <p className="text-xs mt-1 opacity-70">Response will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  if (response.error) {
    return (
      <div className="flex flex-col h-full panel">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3 text-destructive max-w-md text-center px-4">
            <AlertCircle className="h-10 w-10" />
            <p className="font-medium">Request Failed</p>
            <p className="text-sm text-muted-foreground">{response.error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full panel">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-panel-header border-b border-panel-border">
        <div className="flex items-center gap-4">
          <span className={cn('font-semibold', getStatusColor(response.status))}>
            {response.status} {response.statusText}
          </span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {response.time} ms
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <HardDrive className="h-3.5 w-3.5" />
            {formatSize(response.size)}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-7 text-xs"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 mr-1 text-status-success" />
          ) : (
            <Copy className="h-3.5 w-3.5 mr-1" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-panel-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'tab-button',
              activeTab === tab.id ? 'tab-button-active' : 'tab-button-inactive'
            )}
          >
            {tab.label}
            {tab.id === 'headers' && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground rounded-full">
                {Object.keys(response.headers).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'body' && (
          <div className="h-full">
            {isJson(response.body) ? (
              <Suspense
                fallback={
                  <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
                    {response.body}
                  </pre>
                }
              >
                <MonacoEditor
                  height="100%"
                  language="json"
                  value={response.body}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', monospace",
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                  }}
                />
              </Suspense>
            ) : (
              <pre className="p-4 font-mono text-sm whitespace-pre-wrap overflow-auto h-full">
                {response.body || '(empty response)'}
              </pre>
            )}
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="divide-y divide-panel-border">
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="grid grid-cols-[200px_1fr] gap-4 px-4 py-2 text-sm">
                <span className="font-medium text-muted-foreground truncate">{key}</span>
                <span className="font-mono text-foreground break-all">{value}</span>
              </div>
            ))}
            {Object.keys(response.headers).length === 0 && (
              <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                No headers in response
              </div>
            )}
          </div>
        )}

        {activeTab === 'cookies' && (
          <div className="divide-y divide-panel-border">
            {cookies.length > 0 ? (
              cookies.map((cookie, index) => (
                <div key={index} className="px-4 py-2 text-sm font-mono break-all">
                  {cookie.trim()}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                No cookies in response
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
