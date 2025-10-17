import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          <span className="text-blue-500">Gen'Z</span> Hub 
          <span className="text-sm font-medium text-slate-400 ml-2">AI Photo Editor</span>
        </h1>
      </div>
    </header>
  );
};