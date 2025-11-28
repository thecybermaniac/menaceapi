import { useState } from 'react';
import { KeyValueTable } from './KeyValueTable';
import { BodyEditor } from './BodyEditor';
import type {
  RequestConfig,
  RequestTab,
  KeyValuePair,
  FormDataPair,
  BodyType,
  RawBodyFormat,
} from '@/types/api';
import { cn } from '@/lib/utils';

interface RequestPanelProps {
  request: RequestConfig;
  onUpdateParams: (id: string, updates: Partial<KeyValuePair>) => void;
  onAddParams: () => void;
  onRemoveParams: (id: string) => void;
  onUpdateHeaders: (id: string, updates: Partial<KeyValuePair>) => void;
  onAddHeaders: () => void;
  onRemoveHeaders: (id: string) => void;
  onBodyTypeChange: (type: BodyType) => void;
  onRawBodyChange: (content: string) => void;
  onRawBodyFormatChange: (format: RawBodyFormat) => void;
  onUpdateFormData: (id: string, updates: Partial<FormDataPair>) => void;
  onAddFormData: () => void;
  onRemoveFormData: (id: string) => void;
}

const tabs: { id: RequestTab; label: string }[] = [
  { id: 'params', label: 'Params' },
  { id: 'headers', label: 'Headers' },
  { id: 'body', label: 'Body' },
];

export function RequestPanel({
  request,
  onUpdateParams,
  onAddParams,
  onRemoveParams,
  onUpdateHeaders,
  onAddHeaders,
  onRemoveHeaders,
  onBodyTypeChange,
  onRawBodyChange,
  onRawBodyFormatChange,
  onUpdateFormData,
  onAddFormData,
  onRemoveFormData,
}: RequestPanelProps) {
  const [activeTab, setActiveTab] = useState<RequestTab>('params');

  // Count enabled items for badges
  const paramsCount = request.params.filter((p) => p.enabled && p.key).length;
  const headersCount = request.headers.filter((h) => h.enabled && h.key).length;

  return (
    <div className="flex flex-col h-full panel">
      {/* Tabs */}
      <div className="flex border-b border-panel-border">
        {tabs.map((tab) => {
          const count =
            tab.id === 'params'
              ? paramsCount
              : tab.id === 'headers'
              ? headersCount
              : 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'tab-button relative',
                activeTab === tab.id ? 'tab-button-active' : 'tab-button-inactive'
              )}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded-full">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'params' && (
          <KeyValueTable
            pairs={request.params}
            onUpdate={onUpdateParams}
            onAdd={onAddParams}
            onRemove={onRemoveParams}
            keyPlaceholder="Parameter"
            valuePlaceholder="Value"
          />
        )}

        {activeTab === 'headers' && (
          <KeyValueTable
            pairs={request.headers}
            onUpdate={onUpdateHeaders}
            onAdd={onAddHeaders}
            onRemove={onRemoveHeaders}
            keyPlaceholder="Header"
            valuePlaceholder="Value"
          />
        )}

        {activeTab === 'body' && (
          <BodyEditor
            bodyType={request.bodyType}
            rawBody={request.rawBody}
            rawBodyFormat={request.rawBodyFormat}
            formData={request.formData}
            onBodyTypeChange={onBodyTypeChange}
            onRawBodyChange={onRawBodyChange}
            onRawBodyFormatChange={onRawBodyFormatChange}
            onFormDataUpdate={onUpdateFormData}
            onFormDataAdd={onAddFormData}
            onFormDataRemove={onRemoveFormData}
          />
        )}
      </div>
    </div>
  );
}
