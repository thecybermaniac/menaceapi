import { useState, useCallback } from 'react';
import { RequestBar } from './RequestBar';
import { RequestPanel } from './RequestPanel';
import { ResponsePanel } from './ResponsePanel';
import { Console } from './Console';
import { Sidebar } from './Sidebar';
import { ProfileButton } from './ProfileButton';
import { useRequestState } from '@/hooks/useRequestState';
import { useConsole } from '@/hooks/useConsole';
import { useHistory } from '@/hooks/useHistory';
import { executeRequest, getRequestMetadata } from '@/lib/apiClient';
import type { ResponseData, HistoryEntry } from '@/types/api';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Zap } from 'lucide-react';

export function ApiTester() {
  const {
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
    loadRequest,
  } = useRequestState();

  const { entries, logRequest, logResponse, logError, clearConsole, logInfo } =
    useConsole();

  const { history, addToHistory, removeFromHistory, clearHistory } = useHistory();

  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(async () => {
    if (!request.url.trim()) return;

    setIsLoading(true);
    setResponse(null);

    // Log request info
    const metadata = getRequestMetadata(request);
    logInfo(`Sending ${request.method} request to ${metadata.url}`);
    logRequest(
      request.method,
      metadata.url,
      metadata.headers,
      typeof metadata.body === 'string' ? metadata.body : undefined
    );

    try {
      const result = await executeRequest(request);
      setResponse(result);

      if (result.error) {
        logError(request.method, metadata.url, result.error);
      } else {
        logResponse(
          request.method,
          metadata.url,
          result.status,
          result.statusText,
          result.time,
          result.size
        );
      }

      // Add to history
      addToHistory(request, result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      logError(request.method, metadata.url, errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [request, logRequest, logResponse, logError, logInfo, addToHistory]);

  const handleSelectHistory = useCallback(
    (entry: HistoryEntry) => {
      loadRequest(entry.request);
      if (entry.response) {
        setResponse(entry.response);
      }
    },
    [loadRequest]
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0">
        <Sidebar
          history={history}
          onSelectHistory={handleSelectHistory}
          onRemoveHistory={removeFromHistory}
          onClearHistory={clearHistory}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with request bar */}
        <div className="flex-shrink-0 p-4 border-b border-border">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 pr-4 border-r border-border">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Menace API</span>
            </div>

            {/* Request bar */}
            <div className="flex-1">
              <RequestBar
                method={request.method}
                url={request.url}
                isLoading={isLoading}
                onMethodChange={setMethod}
                onUrlChange={setUrl}
                onSend={handleSend}
              />
            </div>

            {/* Profile button */}
            <ProfileButton />
          </div>
        </div>

        {/* Main panels */}
        <ResizablePanelGroup direction="vertical" className="flex-1">
          {/* Request + Response */}
          <ResizablePanel defaultSize={70} minSize={30}>
            <ResizablePanelGroup direction="horizontal">
              {/* Request panel */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full p-4 pr-2">
                  <RequestPanel
                    request={request}
                    onUpdateParams={(id, updates) =>
                      updateKeyValuePair('params', id, updates)
                    }
                    onAddParams={() => addKeyValuePair('params')}
                    onRemoveParams={(id) => removeKeyValuePair('params', id)}
                    onUpdateHeaders={(id, updates) =>
                      updateKeyValuePair('headers', id, updates)
                    }
                    onAddHeaders={() => addKeyValuePair('headers')}
                    onRemoveHeaders={(id) => removeKeyValuePair('headers', id)}
                    onBodyTypeChange={setBodyType}
                    onRawBodyChange={setRawBody}
                    onRawBodyFormatChange={setRawBodyFormat}
                    onUpdateFormData={updateFormDataPair}
                    onAddFormData={addFormDataPair}
                    onRemoveFormData={removeFormDataPair}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle className="resize-handle w-1" />

              {/* Response panel */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full p-4 pl-2">
                  <ResponsePanel response={response} isLoading={isLoading} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle className="resize-handle h-1" />

          {/* Console */}
          <ResizablePanel defaultSize={30} minSize={15} maxSize={50}>
            <Console entries={entries} onClear={clearConsole} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
