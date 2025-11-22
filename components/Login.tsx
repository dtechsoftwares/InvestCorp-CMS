
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-invest-900 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fade-in-down mx-4">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4 transform scale-90">
             <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-bold text-invest-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Sign in to access the Invest Corp CMS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-invest-gold focus:border-transparent outline-none transition-all"
                placeholder="admin@investcorp.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-invest-gold focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-invest-gold hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-invest-gold hover:underline">Forgot your password?</a>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Invest Corp. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
