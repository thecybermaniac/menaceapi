import {
  Clock,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HistoryEntry, HttpMethod } from '@/types/api';
import { cn } from '@/lib/utils';

interface SidebarProps {
  history: HistoryEntry[];
  onSelectHistory: (entry: HistoryEntry) => void;
  onRemoveHistory: (id: string) => void;
  onClearHistory: () => void;
}

export function Sidebar({
  history,
  onSelectHistory,
  onRemoveHistory,
  onClearHistory,
}: SidebarProps) {
  const getMethodColor = (method: HttpMethod) => {
    const colors: Record<HttpMethod, string> = {
      GET: 'text-method-get',
      POST: 'text-method-post',
      PUT: 'text-method-put',
      DELETE: 'text-method-delete',
      PATCH: 'text-method-patch',
      OPTIONS: 'text-method-options',
      HEAD: 'text-method-head',
    };
    return colors[method];
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getUrlPath = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.pathname + parsed.search;
    } catch {
      return url;
    }
  };

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-3 py-4 border-b border-sidebar-border">
        <Clock className="h-3.5 w-3.5 text-sidebar-primary" />
        <span className="text-xs font-medium text-sidebar-primary">History</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {history.length > 0 && (
              <div className="flex items-center justify-between px-3 py-2 border-b border-sidebar-border">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {history.length} request{history.length !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearHistory}
                  className="h-6 px-2 text-[10px] text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
            )}

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <Clock className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Your request history will appear here
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Send a request to get started
            </p>
          </div>
        ) : (
              <div className="divide-y divide-sidebar-border/50">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="group flex items-center gap-2 px-3 py-2 hover:bg-sidebar-accent cursor-pointer transition-colors"
                    onClick={() => onSelectHistory(entry)}
                  >
                    <span
                      className={cn(
                        'text-[10px] font-semibold w-12 flex-shrink-0',
                        getMethodColor(entry.request.method)
                      )}
                    >
                      {entry.request.method}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground truncate font-mono">
                        {getUrlPath(entry.request.url)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatTime(entry.timestamp)}
                        {entry.response && (
                          <span
                            className={cn(
                              'ml-2',
                              entry.response.status >= 200 && entry.response.status < 300
                                ? 'text-status-success'
                                : 'text-status-error'
                            )}
                          >
                            {entry.response.status}
                          </span>
                        )}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveHistory(entry.id);
                      }}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
