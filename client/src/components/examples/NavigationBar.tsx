import NavigationBar from '../NavigationBar';
import { useState } from 'react';

export default function NavigationBarExample() {
  const [currentPath, setCurrentPath] = useState('/');

  const handleNavigate = (path: string) => {
    console.log(`Navigation to ${path} in example`);
    setCurrentPath(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex flex-col justify-end p-8">
      <div className="text-center text-white mb-8">
        <h2 className="text-2xl font-hebrew mb-2">דוגמה לסרגל ניווט</h2>
        <p className="text-gray-300 font-hebrew">נתיב נוכחי: {currentPath}</p>
      </div>
      <NavigationBar 
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
