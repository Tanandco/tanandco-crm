import { Link, useLocation } from 'wouter';
import { MessageCircle, DoorOpen, BarChart3, UserPlus, Fingerprint, ShoppingCart, Home, Settings } from 'lucide-react';

export default function IconSidebar() {
  const [location] = useLocation();

  const navItems = [
    {
      icon: Home,
      path: '/',
      label: 'בית',
      testId: 'nav-home',
      iconColor: 'text-blue-400',
      iconHover: 'group-hover:text-blue-300',
      activeBg: 'bg-gradient-to-br from-blue-500/30 to-blue-500/20',
      activeBorder: 'border-blue-500/60',
      hoverBorder: 'hover:border-blue-500/40',
      tooltipBorder: 'border-blue-500/30',
      tooltipText: 'text-blue-200',
      indicator: 'bg-gradient-to-b from-blue-500 to-blue-600'
    },
    {
      icon: ShoppingCart,
      path: '/pos',
      label: 'קופה',
      testId: 'nav-pos',
      iconColor: 'text-amber-400',
      iconHover: 'group-hover:text-amber-300',
      activeBg: 'bg-gradient-to-br from-amber-500/30 to-amber-500/20',
      activeBorder: 'border-amber-500/60',
      hoverBorder: 'hover:border-amber-500/40',
      tooltipBorder: 'border-amber-500/30',
      tooltipText: 'text-amber-200',
      indicator: 'bg-gradient-to-b from-amber-500 to-amber-600'
    },
    {
      icon: UserPlus,
      path: '/face-registration',
      label: 'הרשמה',
      testId: 'nav-registration',
      iconColor: 'text-pink-400',
      iconHover: 'group-hover:text-pink-300',
      activeBg: 'bg-gradient-to-br from-pink-500/30 to-pink-500/20',
      activeBorder: 'border-pink-500/60',
      hoverBorder: 'hover:border-pink-500/40',
      tooltipBorder: 'border-pink-500/30',
      tooltipText: 'text-amber-200',
      indicator: 'bg-gradient-to-b from-pink-500 to-pink-600'
    },
    {
      icon: MessageCircle,
      path: '/chat',
      label: 'WhatsApp',
      testId: 'nav-whatsapp',
      iconColor: 'text-green-400',
      iconHover: 'group-hover:text-green-300',
      activeBg: 'bg-gradient-to-br from-green-500/30 to-green-500/20',
      activeBorder: 'border-green-500/60',
      hoverBorder: 'hover:border-green-500/40',
      tooltipBorder: 'border-green-500/30',
      tooltipText: 'text-green-200',
      indicator: 'bg-gradient-to-b from-green-500 to-green-600'
    },
    {
      icon: DoorOpen,
      path: '/remote-door',
      label: 'פתיחת דלת',
      testId: 'nav-door',
      iconColor: 'text-blue-400',
      iconHover: 'group-hover:text-blue-300',
      activeBg: 'bg-gradient-to-br from-blue-500/30 to-blue-500/20',
      activeBorder: 'border-blue-500/60',
      hoverBorder: 'hover:border-blue-500/40',
      tooltipBorder: 'border-blue-500/30',
      tooltipText: 'text-blue-200',
      indicator: 'bg-gradient-to-b from-blue-500 to-blue-600'
    },
    {
      icon: BarChart3,
      path: '/automation-dashboard',
      label: 'אוטומציה',
      testId: 'nav-automation',
      iconColor: 'text-purple-400',
      iconHover: 'group-hover:text-purple-300',
      activeBg: 'bg-gradient-to-br from-purple-500/30 to-purple-500/20',
      activeBorder: 'border-purple-500/60',
      hoverBorder: 'hover:border-purple-500/40',
      tooltipBorder: 'border-purple-500/30',
      tooltipText: 'text-purple-200',
      indicator: 'bg-gradient-to-b from-purple-500 to-purple-600'
    },
    {
      icon: Fingerprint,
      path: '/biostar-test',
      label: 'BioStar',
      testId: 'nav-biostar',
      iconColor: 'text-pink-400',
      iconHover: 'group-hover:text-pink-300',
      activeBg: 'bg-gradient-to-br from-pink-500/30 to-pink-500/20',
      activeBorder: 'border-pink-500/60',
      hoverBorder: 'hover:border-pink-500/40',
      tooltipBorder: 'border-pink-500/30',
      tooltipText: 'text-amber-200',
      indicator: 'bg-gradient-to-b from-pink-500 to-pink-600'
    },
    {
      icon: Settings,
      path: '/products',
      label: 'הגדרות',
      testId: 'nav-settings',
      iconColor: 'text-blue-400',
      iconHover: 'group-hover:text-blue-300',
      activeBg: 'bg-gradient-to-br from-blue-500/30 to-blue-500/20',
      activeBorder: 'border-blue-500/60',
      hoverBorder: 'hover:border-blue-500/40',
      tooltipBorder: 'border-blue-500/30',
      tooltipText: 'text-blue-200',
      indicator: 'bg-gradient-to-b from-blue-500 to-blue-600'
    },
  ];

  return (
    <div 
      className="fixed left-0 top-0 w-screen h-16 backdrop-blur-lg border-b z-50 flex flex-row items-center justify-center px-2 md:px-6 gap-2 md:gap-4"
      style={{
        background: 'linear-gradient(to bottom right, rgba(17, 24, 39, 0.6), rgba(0, 0, 0, 0.6), rgba(31, 41, 55, 0.6))',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        boxShadow: `
          0 0 30px rgba(59, 130, 246, 0.6),
          0 0 60px rgba(59, 130, 246, 0.4),
          0 0 90px rgba(59, 130, 246, 0.3),
          inset 0 1px 2px rgba(59, 130, 246, 0.1)
        `
      }}
    >
      {navItems.map((item) => {
        const isActive = location === item.path;
        const Icon = item.icon;
        
        return (
          <Link key={item.path} href={item.path}>
            <button
              data-testid={item.testId}
              className={`
                relative w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center
                transition-all duration-300 group
                ${isActive 
                  ? `${item.activeBg} border ${item.activeBorder}` 
                  : `bg-slate-900/40 border border-slate-700/50 ${item.hoverBorder}`
                }
              `}
            >
              <Icon 
                className={`w-4 h-4 md:w-6 md:h-6 transition-colors ${item.iconColor}`}
                style={{
                  filter: `drop-shadow(0 0 12px ${item.iconColor.includes('amber') ? 'rgba(236, 72, 153, 1)' : 
                                                 item.iconColor.includes('green') ? 'rgba(34, 197, 94, 1)' :
                                                 item.iconColor.includes('blue') ? 'rgba(59, 130, 246, 1)' :
                                                 item.iconColor.includes('purple') ? 'rgba(168, 85, 247, 1)' :
                                                 'rgba(236, 72, 153, 1)'}) drop-shadow(0 0 20px ${item.iconColor.includes('amber') ? 'rgba(236, 72, 153, 0.6)' : 
                                                 item.iconColor.includes('green') ? 'rgba(34, 197, 94, 0.6)' :
                                                 item.iconColor.includes('blue') ? 'rgba(59, 130, 246, 0.6)' :
                                                 item.iconColor.includes('purple') ? 'rgba(168, 85, 247, 0.6)' :
                                                 'rgba(236, 72, 153, 0.6)'})`
                }}
              />
              
              {/* Tooltip */}
              <div className={`absolute top-full mt-3 px-3 py-1.5 bg-slate-900/95 backdrop-blur-sm border ${item.tooltipBorder} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap`}>
                <span className={`text-sm ${item.tooltipText}`}>{item.label}</span>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-8 ${item.indicator} rounded-b-full`} />
              )}
            </button>
          </Link>
        );
      })}
    </div>
  );
}
