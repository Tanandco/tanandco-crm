import Logo from '../Logo';

export default function LogoExample() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-8">
      <div className="space-y-12">
        {/* Logo with glow and underline */}
        <Logo showGlow={true} showUnderline={true} />
        
        {/* Logo without glow */}
        <Logo showGlow={false} showUnderline={true} className="opacity-75" />
        
        {/* Logo without underline */}
        <Logo showGlow={true} showUnderline={false} className="opacity-75" />
      </div>
    </div>
  );
}