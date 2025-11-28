import { useRef } from 'react';
import { Plus, Trash2, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FormDataPair, FormDataValueType } from '@/types/api';
import { cn } from '@/lib/utils';

interface FormDataTableProps {
  pairs: FormDataPair[];
  onUpdate: (id: string, updates: Partial<FormDataPair>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function FormDataTable({
  pairs,
  onUpdate,
  onAdd,
  onRemove,
}: FormDataTableProps) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="grid grid-cols-[32px_1fr_100px_1fr_32px] gap-2 px-3 py-2 bg-panel-header border-b border-panel-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <div></div>
        <div>Key</div>
        <div>Type</div>
        <div>Value</div>
        <div></div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-panel-border">
        {pairs.map((pair) => (
          <FormDataRow
            key={pair.id}
            pair={pair}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Add button */}
      <div className="px-3 py-2 border-t border-panel-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAdd}
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}

interface FormDataRowProps {
  pair: FormDataPair;
  onUpdate: (id: string, updates: Partial<FormDataPair>) => void;
  onRemove: (id: string) => void;
}

function FormDataRow({ pair, onUpdate, onRemove }: FormDataRowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onUpdate(pair.id, { file, value: file?.name || '' });
  };

  const handleTypeChange = (valueType: FormDataValueType) => {
    onUpdate(pair.id, { 
      valueType, 
      value: '', 
      file: null 
    });
  };

  return (
    <div
      className={cn(
        'grid grid-cols-[32px_1fr_100px_1fr_32px] gap-2 items-center px-3 py-1 group',
        'hover:bg-muted/30 transition-colors'
      )}
    >
      <Checkbox
        checked={pair.enabled}
        onCheckedChange={(checked) =>
          onUpdate(pair.id, { enabled: checked === true })
        }
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />

      <input
        type="text"
        value={pair.key}
        onChange={(e) => onUpdate(pair.id, { key: e.target.value })}
        placeholder="Key"
        className={cn(
          'kv-input font-mono',
          !pair.enabled && 'opacity-50'
        )}
      />

      <Select
        value={pair.valueType}
        onValueChange={handleTypeChange}
      >
        <SelectTrigger 
          className={cn(
            "h-7 text-xs border-border/50 bg-transparent",
            !pair.enabled && 'opacity-50'
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">
            <span className="flex items-center gap-1.5">
              <FileText className="h-3 w-3" />
              Text
            </span>
          </SelectItem>
          <SelectItem value="file">
            <span className="flex items-center gap-1.5">
              <Upload className="h-3 w-3" />
              File
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      {pair.valueType === 'text' ? (
        <input
          type="text"
          value={pair.value}
          onChange={(e) => onUpdate(pair.id, { value: e.target.value })}
          placeholder="Value"
          className={cn(
            'kv-input font-mono',
            !pair.enabled && 'opacity-50'
          )}
        />
      ) : (
        <div className={cn('flex items-center gap-2', !pair.enabled && 'opacity-50')}>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-7 text-xs flex-shrink-0"
          >
            <Upload className="h-3 w-3 mr-1" />
            {pair.file ? 'Change' : 'Select'}
          </Button>
          {pair.file && (
            <span className="text-xs text-muted-foreground truncate font-mono" title={pair.file.name}>
              {pair.file.name}
            </span>
          )}
          {!pair.file && (
            <span className="text-xs text-muted-foreground/60 italic">
              No file selected
            </span>
          )}
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(pair.id)}
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
