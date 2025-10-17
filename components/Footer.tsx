
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-8 border-t border-slate-800">
      <div className="container mx-auto text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} Gen'Z Hub. Powered by leo.</p>
      </div>
    </footer>
  );
};
