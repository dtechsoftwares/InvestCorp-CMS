

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ArrowLeft, Key, CreditCard, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

interface LoginProps {
  onLogin: () => void;
  onUpdateGhanaCard: () => void;
  backgroundImage?: string;
  overlayOpacity?: number;
  blurLevel?: number;
}

const Login: React.FC<LoginProps> = ({ onLogin, onUpdateGhanaCard, backgroundImage, overlayOpacity, blurLevel }) => {
  const [view, setView] = useState<'login' | 'forgot' | '2fa'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Default opacity to 0.8 if not provided
  const opacity = overlayOpacity ?? 0.8;
  // Default blur to 4 if not provided
  const blur = blurLevel ?? 4;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth check
    setTimeout(() => {
      setIsLoading(false);
      setView('2fa'); // Move to 2FA step instead of direct login
    }, 1000);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      // Simulate OTP verification
      setTimeout(() => {
          setIsLoading(false);
          onLogin(); // Complete login
      }, 1000);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          alert("If this account exists, a reset link has been sent.");
          setView('login');
      }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-invest-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{ 
              backgroundColor: `rgba(0, 61, 105, ${opacity})`,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`
          }}
        ></div>
      </div>

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fade-in-down mx-4 relative z-10">
        
        {view === 'login' && (
            <>
                <div className="text-center mb-8 flex flex-col items-center">
                <div className="mb-4 transform scale-90">
                    <Logo size="lg" />
                </div>
                <h2 className="text-2xl font-bold text-invest-900">Welcome Back</h2>
                <p className="text-slate-500 mt-2">Sign in to access the Invest Corp CMS</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-6">
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
                    className="w-full bg-invest-900 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:bg-invest-800 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                    <>
                        Continue <ArrowRight size={18} />
                    </>
                    )}
                </button>
                </form>

                <div className="mt-6 text-center">
                  <button onClick={() => setView('forgot')} className="text-sm text-invest-gold hover:underline">Forgot your password?</button>
                </div>

                <div className="mt-8 text-center border-t border-slate-100 pt-4">
                   <p className="text-slate-500 text-sm mb-3">Need to update your records?</p>
                   <button onClick={onUpdateGhanaCard} className="text-sm font-bold text-invest-900 hover:text-invest-gold transition-colors flex items-center justify-center gap-2 w-full py-2 rounded hover:bg-slate-50">
                      <CreditCard size={16} /> Update Ghana Card Details
                   </button>
                </div>
            </>
        )}

        {view === '2fa' && (
             <div className="animate-fade-in">
                 <div className="text-center mb-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-invest-900">Security Verification</h2>
                    <p className="text-slate-500 mt-2 text-sm">Enter the 6-digit code sent to your device ending in **89</p>
                </div>

                <form onSubmit={handle2FASubmit} className="space-y-6">
                    <div>
                        <input 
                            type="text" 
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full text-center text-3xl font-bold tracking-[0.5em] py-3 border-b-2 border-slate-200 focus:border-invest-gold outline-none transition-all bg-transparent"
                            placeholder="000000"
                            autoFocus
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading || otp.length < 6}
                        className="w-full bg-invest-gold text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:bg-amber-600 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                         {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            "Verify & Login"
                        )}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => setView('login')}
                        className="w-full text-slate-500 text-sm hover:text-invest-900"
                    >
                        Back to Login
                    </button>
                </form>
             </div>
        )}

        {view === 'forgot' && (
            <div className="animate-fade-in">
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-invest-gold">
                        <Key size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-invest-900">Forgot Password</h2>
                    <p className="text-slate-500 mt-2 text-sm">We will send a link to reset your password</p>
                </div>

                <form onSubmit={handleForgotSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email or Account No</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                required
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-invest-gold focus:border-transparent outline-none transition-all"
                                placeholder="Enter your registered ID"
                                autoFocus
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
                            "Reset Password"
                        )}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => setView('login')}
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        )}
        
        <div className="mt-6 pt-4 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Invest Corp. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
