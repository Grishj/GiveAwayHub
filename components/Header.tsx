import React from 'react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'browse' | 'dashboard' | 'donate') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <h1 className="font-display text-2xl font-bold text-primary-green">GiveAwayHub</h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-primary-green transition-colors">Home</button>
              <button onClick={() => onNavigate('browse')} className="text-gray-600 hover:text-primary-green transition-colors">Browse Items</button>
              <button onClick={() => onNavigate('dashboard')} className="text-gray-600 hover:text-primary-green transition-colors">Dashboard</button>
              <button onClick={() => onNavigate('donate')} className="btn-primary px-6 py-2 rounded-full font-semibold">Donate Now</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;