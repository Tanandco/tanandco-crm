import { Home, Store, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Alin from './Alin';

interface NavigationItem {
  icon: React.ElementType | 'alin';
  label: string;
  path: string;
  active?: boolean;
}

interface NavigationBarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export default function NavigationBar({ currentPath = '/', onNavigate }: NavigationBarProps) {
  const navItems: NavigationItem[] = [
    { icon: Home, label: 'בית', path: '/' },
    { icon: Store, label: 'חנות', path: '/store' },
    { icon: History, label: 'היסטוריה', path: '/history' },
    { icon: 'alin', label: 'אלין', path: '/alin' },
  ];

  return (
    <div className="fixed top-1/2 right-4 -translate-y-1/2 z-50">
      <div 
        className="flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-xl backdrop-blur-xl border border-slate-600/30"
        style={{
          background: 'linear-gradient(to bottom, rgba(51, 65, 85, 0.8), rgba(71, 85, 105, 0.8))'
        }}
        data-testid="navigation-bar"
      >
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`
                flex flex-col items-center gap-1 p-3 min-w-[60px] h-auto
                text-white hover:text-primary transition-all duration-300
                ${isActive ? 'text-primary bg-primary/10' : ''}
                ${item.label === 'אלין' ? 'text-pink-400 hover:text-pink-300' : ''}
                hover-elevate active-elevate-2
              `}
              onClick={() => {
                onNavigate?.(item.path);
              }}
              data-testid={`nav-${item.path.replace('/', '') || 'home'}`}
            >
              {item.icon === 'alin' ? (
                <Alin size={39} />
              ) : (
                (() => {
                  const Icon = item.icon as React.ElementType;
                  return (
                    <Icon 
                      size={20}
                      className={isActive ? 'drop-shadow-sm' : ''}
                      style={{
                        filter: isActive 
                          ? 'drop-shadow(0 0 10px hsl(var(--primary)/0.5))' 
                          : 'none'
                      }}
                    />
                  );
                })()
              )}
              <span className="text-xs font-hebrew">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}