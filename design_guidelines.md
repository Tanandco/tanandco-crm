# Tan & Co CRM - Design Guidelines

## Design Approach
**Reference-Based Approach**: Premium touch kiosk interface inspired by modern salon/spa applications with Hebrew RTL support and neon aesthetic.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary**:
- Background: `bg-gradient-to-br from-background via-background/95 to-primary/5`
- Primary neon: `#ff69b4` (hot pink)
- Card backgrounds: `bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90`
- Text: White with neon accents
- Borders: `border-primary/60 hover:border-primary`

### B. Typography
- **Primary Font**: Hebrew-optimized fonts (Assistant/Heebo/Noto Sans Hebrew)
- **Direction**: RTL (Right-to-Left) as default
- **Sizes**: Large touch-friendly text for kiosk interface
- **Weights**: Regular and bold for hierarchy

### C. Layout System
**Tailwind Spacing Units**: Primarily use 2, 4, 8, 16 units
- Padding: `p-2`, `p-4`, `p-8`
- Margins: `m-2`, `m-4`, `m-8`  
- Heights: `h-8`, `h-16`
- Touch targets: Minimum 48-64px hit areas

### D. Component Library

**Logo Treatment**:
- Central placement with neon glow effect
- `filter: drop-shadow(0 0 30px rgba(255,105,180,1))`
- Underlined with animated light beam
- `bg-gradient-to-r from-transparent via-[#ff69b4] to-transparent`

**Service Cards**:
- Size: `h-[140px] w-[140px]` (responsive)
- Background: `bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90`
- Borders: `border-primary/60 hover:border-primary`
- Shadow: `boxShadow: 0 4px 12px rgba(0,0,0,0.3)`
- Hover: `group-hover:scale-105` with `backdrop-blur-sm`

**Icons**:
- Neon glow effect: `filter: drop-shadow(0 0 20px hsl(var(--primary)/1))`
- Color: `text-primary group-hover:text-white`
- Radial gradient ripple effects on interaction

**Navigation Buttons**:
- Background: `bg-gradient-to-r from-slate-800/80 to-slate-700/80`
- Effects: `backdrop-blur-xl border border-slate-600/30`
- Hover: `hover:shadow-lg hover:shadow-primary/20`

**Dynamic Elements**:
- Two animated circles with borders based on color palette
- Horizontal scrolling brand banner: `animate-scroll-horizontal`
- Smooth transitions and hover states throughout

### E. Touch Interface Specifications
- **Responsive Design**: Optimized for kiosk touch screens
- **Large Touch Targets**: 48-64px minimum interactive areas
- **Visual Feedback**: Immediate hover/press states with neon effects
- **Error States**: Toast notifications in Hebrew with loading skeletons
- **Navigation**: Bottom tab bar with gradient backgrounds

## Special Features
- **Hebrew RTL Support**: All text, navigation, and layouts flow right-to-left
- **Neon Aesthetic**: Consistent glow effects, gradients, and backdrop blur
- **Touch Optimization**: Large buttons, clear visual hierarchy, immediate feedback
- **Premium Feel**: Dark backgrounds with bright accent colors and smooth animations

## Images
No large hero images specified. Focus on:
- Logo with neon treatment as central focal point
- Service icons with glow effects
- Minimal decorative elements to maintain clean kiosk interface
- Product images in store section with consistent styling