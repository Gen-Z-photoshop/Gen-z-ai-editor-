import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-950/70 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-5">
        <h1 className="text-3xl md:text-4xl font-bold text-center font-display tracking-wider">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">Gen'Z Hub</span>
          <span className="text-sm font-sans font-medium text-slate-500 ml-2 tracking-normal align-middle">AI PHOTO EDITOR</span>
        </h1>
      </div>
    </header>
  );
};