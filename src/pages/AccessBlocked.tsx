import { Monitor, Smartphone } from 'lucide-react';

const AccessBlocked = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 items-center">
          <Smartphone className="w-12 h-12 text-muted-foreground opacity-50" />
          <span className="text-2xl text-muted-foreground">/</span>
          <Monitor className="w-12 h-12 text-primary" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            Desktop Only
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Menace API is designed for desktop use only. Please visit this site from a personal computer for the best experience.
          </p>
        </div>
        
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            API testing requires a larger screen for viewing requests, responses, and console output effectively.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessBlocked;
