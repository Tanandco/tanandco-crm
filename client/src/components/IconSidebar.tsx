import { Link, useLocation } from 'wouter';
import { MessageCircle, DoorOpen, Zap, UserPlus, Activity } from 'lucide-react';

export default function IconSidebar() {
  const [location] = useLocation();

  const navItems = [
    {
      icon: UserPlus,
      path: '/face-registration',
      label: 'הרשמה',
      testId: 'nav-registration'
    },
    {
      icon: MessageCircle,
      path: '/chat',
      label: 'WhatsApp',
      testId: 'nav-whatsapp'
    },
    {
      icon: DoorOpen,
      path: '/remote-door',
      label: 'פתיחת דלת',
      testId: 'nav-door'
    },
    {
      icon: Zap,
      path: '/automation-dashboard',
      label: 'אוטומציה',
      testId: 'nav-automation'
    },
    {
      icon: Activity,
      path: '/biostar-test',
      label: 'BioStar',
      testId: 'nav-biostar'
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-gradient-to-b from-slate-950/95 via-purple-950/40 to-slate-950/95 backdrop-blur-lg border-r border-pink-500/20 z-50 flex flex-col items-center py-6 gap-4">
      {navItems.map((item) => {
        const isActive = location === item.path;
        const Icon = item.icon;
        
        return (
          <Link key={item.path} href={item.path}>
            <button
              data-testid={item.testId}
              className={`
                relative w-12 h-12 rounded-xl flex items-center justify-center
                transition-all duration-300 group
                ${isActive 
                  ? 'bg-gradient-to-br from-pink-500/30 to-purple-500/20 border border-pink-500/60' 
                  : 'bg-slate-900/40 border border-slate-700/50 hover:border-pink-500/40'
                }
              `}
            >
              <Icon 
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-pink-400' : 'text-slate-400 group-hover:text-pink-300'
                }`} 
              />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900/95 backdrop-blur-sm border border-pink-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                <span className="text-sm text-pink-200">{item.label}</span>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-500 rounded-r-full" />
              )}
            </button>
          </Link>
        );
      })}
    </div>
  );
}
