import { useState } from 'react';
import {
  FolderOpen,
  Clock,
  Trash2,
  ChevronRight,
  Plus,
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

type SidebarTab = 'collections' | 'history';

export function Sidebar({
  history,
  onSelectHistory,
  onRemoveHistory,
  onClearHistory,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('history');

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
      {/* Tabs */}
      <div className="flex border-b border-sidebar-border">
        <button
          onClick={() => setActiveTab('collections')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors',
            activeTab === 'collections'
              ? 'text-sidebar-primary border-b-2 border-sidebar-primary'
              : 'text-sidebar-foreground hover:text-foreground'
          )}
        >
          <FolderOpen className="h-3.5 w-3.5" />
          Collections
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors',
            activeTab === 'history'
              ? 'text-sidebar-primary border-b-2 border-sidebar-primary'
              : 'text-sidebar-foreground hover:text-foreground'
          )}
        >
          <Clock className="h-3.5 w-3.5" />
          History
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'collections' && (
          <div className="p-4">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FolderOpen className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Collections help you organize your API requests
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                disabled
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Collection
              </Button>
              <p className="text-[10px] text-muted-foreground/70 mt-2">
                Coming soon
              </p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
