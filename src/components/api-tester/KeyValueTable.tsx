import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { KeyValuePair } from '@/types/api';
import { cn } from '@/lib/utils';

interface KeyValueTableProps {
  pairs: KeyValuePair[];
  onUpdate: (id: string, updates: Partial<KeyValuePair>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export function KeyValueTable({
  pairs,
  onUpdate,
  onAdd,
  onRemove,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}: KeyValueTableProps) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="grid grid-cols-[32px_1fr_1fr_32px] gap-2 px-3 py-2 bg-panel-header border-b border-panel-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <div></div>
        <div>Key</div>
        <div>Value</div>
        <div></div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-panel-border">
        {pairs.map((pair, index) => (
          <div
            key={pair.id}
            className={cn(
              'grid grid-cols-[32px_1fr_1fr_32px] gap-2 items-center px-3 py-1 group',
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
              placeholder={keyPlaceholder}
              className={cn(
                'kv-input font-mono',
                !pair.enabled && 'opacity-50'
              )}
            />
            
            <input
              type="text"
              value={pair.value}
              onChange={(e) => onUpdate(pair.id, { value: e.target.value })}
              placeholder={valuePlaceholder}
              className={cn(
                'kv-input font-mono',
                !pair.enabled && 'opacity-50'
              )}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(pair.id)}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
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
