import React, { useState, useEffect, useRef } from 'react';
import { Requester } from '../types';
import { ChevronDownIcon, LogoutIcon, MyItemsIcon } from './Icons';

interface HeaderProps {
  onNavigate: (view: 'home' | 'browse' | 'dashboard' | 'donate') => void;
  currentUser: Requester | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentUser, onLogout }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!currentUser) return null;

    return (
        <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
                        <h1 className="font-display text-2xl font-bold text-primary-green">GiveAwayHub</h1>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-primary-green transition-colors">Home</button>
                            <button onClick={() => onNavigate('browse')} className="text-gray-600 hover:text-primary-green transition-colors">Browse Items</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => onNavigate('donate')} className="btn-primary px-6 py-2 rounded-full font-semibold hidden sm:block">Donate Now</button>
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100">
                                <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full"/>
                                <ChevronDownIcon className={`w-5 h-5 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-2 z-20 ring-1 ring-black ring-opacity-5">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-semibold text-charcoal">{currentUser.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                                    </div>
                                    <button 
                                        onClick={() => { onNavigate('dashboard'); setIsProfileOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                                    >
                                        <MyItemsIcon className="w-5 h-5 text-gray-500" /> Dashboard
                                    </button>
                                    <button
                                        onClick={() => { onLogout(); setIsProfileOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-coral hover:bg-gray-100 flex items-center gap-3"
                                    >
                                        <LogoutIcon className="w-5 h-5" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;