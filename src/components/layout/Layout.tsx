import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans" id="app-layout">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
