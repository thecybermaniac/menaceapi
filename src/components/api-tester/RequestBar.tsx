import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MethodSelector } from './MethodSelector';
import type { HttpMethod } from '@/types/api';

interface RequestBarProps {
  method: HttpMethod;
  url: string;
  isLoading: boolean;
  onMethodChange: (method: HttpMethod) => void;
  onUrlChange: (url: string) => void;
  onSend: () => void;
}

export function RequestBar({
  method,
  url,
  isLoading,
  onMethodChange,
  onUrlChange,
  onSend,
}: RequestBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      onSend();
    }
  };

  return (
    <div className="flex items-center gap-0 bg-card rounded-lg border border-border overflow-hidden">
      <MethodSelector value={method} onChange={onMethodChange} />
      
      <Input
        type="text"
        placeholder="Enter request URL"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 h-10 border-0 rounded-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm placeholder:text-muted-foreground"
      />
      
      <Button
        onClick={onSend}
        disabled={isLoading || !url.trim()}
        className="h-10 px-6 rounded-none rounded-r-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send
          </>
        )}
      </Button>
    </div>
  );
}
