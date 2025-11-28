import { Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConsoleEntry } from '@/types/api';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ConsoleProps {
  entries: ConsoleEntry[];
  onClear: () => void;
}

export function Console({ entries, onClear }: ConsoleProps) {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedEntries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getTypeIcon = (type: ConsoleEntry['type']) => {
    switch (type) {
      case 'request':
        return '→';
      case 'response':
        return '←';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
    }
  };

  const getTypeColor = (type: ConsoleEntry['type']) => {
    switch (type) {
      case 'request':
        return 'text-method-post';
      case 'response':
        return 'text-status-success';
      case 'error':
        return 'text-destructive';
      case 'info':
        return 'text-muted-foreground';
    }
  };

  const getMethodColor = (method?: string) => {
    if (!method) return '';
    const colors: Record<string, string> = {
      GET: 'text-method-get',
      POST: 'text-method-post',
      PUT: 'text-method-put',
      DELETE: 'text-method-delete',
      PATCH: 'text-method-patch',
      OPTIONS: 'text-method-options',
      HEAD: 'text-method-head',
    };
    return colors[method] || '';
  };

  const formatTime = (date: Date) => {
    const time = date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${time}.${ms}`;
  };

  return (
    <div className="flex flex-col h-full bg-console-bg border-t border-console-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-panel-header border-b border-console-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Console
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          disabled={entries.length === 0}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-auto font-mono text-xs">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            Console output will appear here
          </div>
        ) : (
          entries.map((entry) => {
            const isExpanded = expandedEntries.has(entry.id);
            const hasDetails = entry.details && Object.keys(entry.details).length > 0;

            return (
              <div
                key={entry.id}
                className="border-b border-console-border/50 hover:bg-muted/10"
              >
                <div
                  className={cn(
                    'flex items-start gap-2 px-3 py-1.5',
                    hasDetails && 'cursor-pointer'
                  )}
                  onClick={() => hasDetails && toggleExpand(entry.id)}
                >
                  {hasDetails ? (
                    isExpanded ? (
                      <ChevronDown className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                    )
                  ) : (
                    <span className="w-3 flex-shrink-0" />
                  )}

                  <span className={cn('w-4 flex-shrink-0', getTypeColor(entry.type))}>
                    {getTypeIcon(entry.type)}
                  </span>

                  <span className="text-muted-foreground flex-shrink-0">
                    {formatTime(entry.timestamp)}
                  </span>

                  {entry.method && (
                    <span className={cn('font-semibold', getMethodColor(entry.method))}>
                      {entry.method}
                    </span>
                  )}

                  <span className={cn('flex-1 break-all', getTypeColor(entry.type))}>
                    {entry.message}
                  </span>
                </div>

                {/* Expanded details */}
                {isExpanded && hasDetails && (
                  <div className="px-3 pb-2 pl-10">
                    <pre className="text-[10px] text-muted-foreground whitespace-pre-wrap bg-background/50 p-2 rounded">
                      {JSON.stringify(entry.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
