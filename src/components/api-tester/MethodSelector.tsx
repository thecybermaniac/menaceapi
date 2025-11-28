import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { HttpMethod } from '@/types/api';
import { cn } from '@/lib/utils';

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
}

export function MethodSelector({ value, onChange }: MethodSelectorProps) {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'h-10 px-3 font-mono font-semibold text-sm min-w-[100px] justify-between',
            'bg-secondary hover:bg-secondary/80 border-r border-border rounded-none rounded-l-md',
            getMethodColor(value)
          )}
        >
          {value}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[100px]">
        {methods.map((method) => (
          <DropdownMenuItem
            key={method}
            onClick={() => onChange(method)}
            className={cn(
              'font-mono font-semibold cursor-pointer',
              getMethodColor(method)
            )}
          >
            {method}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
