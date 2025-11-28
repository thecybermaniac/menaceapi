import { Suspense, lazy } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { KeyValueTable } from './KeyValueTable';
import { Wand2 } from 'lucide-react';
import type { BodyType, RawBodyFormat, KeyValuePair } from '@/types/api';
import { cn } from '@/lib/utils';

// Lazy load Monaco Editor for performance
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

interface BodyEditorProps {
  bodyType: BodyType;
  rawBody: string;
  rawBodyFormat: RawBodyFormat;
  formData: KeyValuePair[];
  onBodyTypeChange: (type: BodyType) => void;
  onRawBodyChange: (content: string) => void;
  onRawBodyFormatChange: (format: RawBodyFormat) => void;
  onFormDataUpdate: (id: string, updates: Partial<KeyValuePair>) => void;
  onFormDataAdd: () => void;
  onFormDataRemove: (id: string) => void;
}

export function BodyEditor({
  bodyType,
  rawBody,
  rawBodyFormat,
  formData,
  onBodyTypeChange,
  onRawBodyChange,
  onRawBodyFormatChange,
  onFormDataUpdate,
  onFormDataAdd,
  onFormDataRemove,
}: BodyEditorProps) {
  const formatJson = () => {
    try {
      const parsed = JSON.parse(rawBody);
      onRawBodyChange(JSON.stringify(parsed, null, 2));
    } catch {
      // Invalid JSON, ignore
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Body type selector */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-panel-border">
        <div className="flex items-center gap-4">
          {(['none', 'raw', 'form-data'] as BodyType[]).map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="bodyType"
                checked={bodyType === type}
                onChange={() => onBodyTypeChange(type)}
                className="w-4 h-4 text-primary bg-input border-border focus:ring-primary"
              />
              <span
                className={cn(
                  'text-sm',
                  bodyType === type ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {type === 'none' ? 'none' : type === 'raw' ? 'raw' : 'form-data'}
              </span>
            </label>
          ))}
        </div>

        {/* Raw format selector */}
        {bodyType === 'raw' && (
          <div className="flex items-center gap-2 ml-auto">
            <Select
              value={rawBodyFormat}
              onValueChange={(v) => onRawBodyFormatChange(v as RawBodyFormat)}
            >
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>

            {rawBodyFormat === 'json' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={formatJson}
                className="h-8 text-xs"
                title="Format JSON (Ctrl+Shift+F)"
              >
                <Wand2 className="h-3.5 w-3.5 mr-1" />
                Format
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Body content */}
      <div className="flex-1 overflow-hidden">
        {bodyType === 'none' && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            This request does not have a body
          </div>
        )}

        {bodyType === 'raw' && rawBodyFormat === 'text' && (
          <Textarea
            value={rawBody}
            onChange={(e) => onRawBodyChange(e.target.value)}
            placeholder="Enter request body..."
            className="w-full h-full resize-none border-0 rounded-none font-mono text-sm bg-transparent focus-visible:ring-0"
          />
        )}

        {bodyType === 'raw' && rawBodyFormat === 'json' && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading editor...
              </div>
            }
          >
            <MonacoEditor
              height="100%"
              language="json"
              value={rawBody}
              onChange={(value) => onRawBodyChange(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </Suspense>
        )}

        {bodyType === 'form-data' && (
          <KeyValueTable
            pairs={formData}
            onUpdate={onFormDataUpdate}
            onAdd={onFormDataAdd}
            onRemove={onFormDataRemove}
            keyPlaceholder="Key"
            valuePlaceholder="Value"
          />
        )}
      </div>
    </div>
  );
}
