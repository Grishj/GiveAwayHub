import React, { useState } from 'react';
import { Requester } from '../types';
import { CURRENT_USER } from '../constants';
import { GoogleIcon } from './Icons';

interface AuthProps {
    onLogin: (user: Requester) => void;
    onSignup: (newUser: Requester) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignup }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            // In a real app, you'd fetch the user profile based on email/password.
            // Here, we'll just log in with the mock CURRENT_USER.
            onLogin(CURRENT_USER);
        } else {
            const newUser: Requester = {
                name,
                email,
                phone: 'N/A',
                address: 'N/A',
                avatar: `https://i.pravatar.cc/150?u=${email}`
            };
            onSignup(newUser);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-soft-gray p-4 hero-bg">
            <div className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                    <h1 className="font-display text-3xl font-bold text-primary-green">GiveAwayHub</h1>
                    <p className="mt-2 text-gray-600">{isLogin ? "Welcome back! Please sign in." : "Create your account to get started."}</p>
                </div>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-lg"
                                placeholder="John Doe"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-lg"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-lg"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button type="submit" className="w-full btn-primary px-6 py-3 rounded-lg font-semibold text-lg">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button 
                    type="button" 
                    onClick={() => onLogin(CURRENT_USER)}
                    className="w-full flex justify-center items-center gap-3 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-charcoal hover:bg-gray-50 transition-colors"
                >
                    <GoogleIcon />
                    Continue with Google
                </button>

                <div className="text-center mt-6">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-medium text-primary-green hover:underline">
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;