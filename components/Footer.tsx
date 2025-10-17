
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-12 border-t border-slate-800/50">
      <div className="container mx-auto text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Gen'Z Hub. Powered by Leo.</p>
      </div>
    </footer>
  );
};
