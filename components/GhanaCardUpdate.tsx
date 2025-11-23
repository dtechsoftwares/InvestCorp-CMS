
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import Logo from './Logo';
import { GhanaCardSubmission } from '../types';

interface GhanaCardUpdateProps {
  onBack: () => void;
  onSubmit: (data: GhanaCardSubmission) => void;
  backgroundImage?: string;
  overlayOpacity?: number;
  blurLevel?: number;
}

const GhanaCardUpdate: React.FC<GhanaCardUpdateProps> = ({ 
  onBack, 
  onSubmit,
  backgroundImage, 
  overlayOpacity = 0.8, 
  blurLevel = 4 
}) => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    ghanaCardNumber: '',
    firstName: '',
    lastName: ''
  });
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Exact pattern from reference HTML: [^()/><\][\\\x22,;|]+
  // Escaped for JS string: [^()/><\\][\\\\x22,;|]+
  const securityPattern = "[^()/><\\][\\\\x22,;|]+";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Construct submission data
    const submission: GhanaCardSubmission = {
        id: Date.now().toString(),
        accountNumber: formData.accountNumber,
        ghanaCardNumber: formData.ghanaCardNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        frontImageName: frontFile?.name || 'No file',
        backImageName: backFile?.name || 'No file',
        submittedAt: new Date().toLocaleString(),
        status: 'Pending'
    };

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSubmit(submission);
      setSubmitted(true);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
      if (e.target.files && e.target.files[0]) {
          setFile(e.target.files[0]);
      }
  };

  // Input sanitizer from reference HTML
  const sanitizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Basic sanitization to remove some special chars if strictly needed, 
    // but rely mainly on pattern validation for UX
    // Reference logic: var sanitizedValue = inputValue.replace(/[^\w\s]/gi, '');
    // We'll just update state normally but the pattern will enforce validity on submit
    setFormData({ ...formData, [e.target.name]: val });
  };
  
  const handleAccountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Reference: oninput="this.value = this.value.replace(/[^0-9]/g, '')"
      const val = e.target.value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, accountNumber: val });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center relative bg-invest-900 p-4">
        {/* Background Overlay Reuse */}
        <div className="absolute inset-0 z-0">
          <img 
            src={backgroundImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 transition-all duration-500"
            style={{ 
                backgroundColor: `rgba(0, 61, 105, ${overlayOpacity})`,
                backdropFilter: `blur(${blurLevel}px)`,
                WebkitBackdropFilter: `blur(${blurLevel}px)`
            }}
          ></div>
        </div>

        <div className="bg-white w-full max-w-xs p-8 rounded-lg shadow-2xl animate-fade-in-down relative z-10 text-center">
           {/* Success Modal Style from reference */}
           <div className="mb-4 flex justify-center">
              <img src="https://media.giphy.com/media/7efs/giphy.gif" alt="Success" className="w-32 h-32 object-contain" onError={(e) => e.currentTarget.style.display='none'} />
              <div className="hidden"><CheckCircle size={64} className="text-green-500" /></div> {/* Fallback */}
           </div>
           <h2 className="text-xl font-bold text-invest-900 mb-2">Upload Complete!</h2>
           <p className="text-sm text-slate-500 mb-6">Your details have been updated.</p>
           
           <button 
            onClick={onBack}
            className="w-full bg-invest-900 text-white py-2 rounded-md font-medium hover:bg-invest-800 transition-colors text-sm"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-invest-900 p-4">
      {/* Background Overlay Reuse */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{ 
              backgroundColor: `rgba(0, 61, 105, ${overlayOpacity})`,
              backdropFilter: `blur(${blurLevel}px)`,
              WebkitBackdropFilter: `blur(${blurLevel}px)`
          }}
        ></div>
      </div>

      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down relative z-10 flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Lottie Animation */}
        <div className="hidden md:flex md:w-5/12 bg-white items-center justify-center p-0 border-r border-slate-100 relative overflow-hidden">
           <div className="relative z-10 w-full h-full flex items-center justify-center p-8 text-center">
              <Player
                src="https://assets7.lottiefiles.com/packages/lf20_rqaycnwn.json"
                loop
                autoplay
                style={{ width: '300px', height: '300px' }}
                background="transparent"
              />
           </div>
           
           {/* Decorative background circles */}
           <div className="absolute top-10 left-10 w-32 h-32 bg-invest-gold/5 rounded-full blur-2xl"></div>
           <div className="absolute bottom-10 right-10 w-40 h-40 bg-invest-900/5 rounded-full blur-2xl"></div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 md:p-10 flex flex-col">
          <div className="flex justify-between items-start mb-6">
             <div className="transform scale-75 origin-top-left">
                <Logo size="md" />
             </div>
             <button 
                onClick={onBack}
                className="text-slate-400 hover:text-invest-900 transition-colors flex items-center gap-1 text-sm"
             >
                <ArrowLeft size={16} /> Back
             </button>
          </div>

          <p className="text-sm text-slate-600 text-center mb-8 max-w-sm mx-auto">
            Complete the fields below to update your account details with your Ghana Card
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-invest-900 mb-1.5">Account Number</label>
                    <input 
                        type="text"
                        name="accountNumber"
                        id="accountNumber"
                        required
                        minLength={7}
                        pattern={securityPattern}
                        className="w-full border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-invest-gold focus:border-transparent outline-none transition-all bg-slate-50/50"
                        value={formData.accountNumber}
                        onChange={handleAccountInput}
                    />
                    <div className="hidden peer-invalid:block text-red-500 text-xs mt-1">Please fill in your account no</div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-invest-900 mb-1.5">Ghana Card Number</label>
                    <input 
                        type="text"
                        name="ghanaCardNumber"
                        id="ghanaCardNumber"
                        required
                        minLength={7}
                        pattern={securityPattern}
                        className="w-full border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-invest-gold focus:border-transparent outline-none transition-all bg-slate-50/50"
                        value={formData.ghanaCardNumber}
                        onChange={(e) => setFormData({...formData, ghanaCardNumber: e.target.value})}
                    />
                    <div className="hidden peer-invalid:block text-red-500 text-xs mt-1">Please fill in your ghana card no</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-invest-900 mb-1.5">First Name</label>
                        <input 
                            type="text"
                            name="firstName"
                            id="firstName"
                            required
                            className="w-full border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-invest-gold focus:border-transparent outline-none transition-all bg-slate-50/50"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-invest-900 mb-1.5">Last Name</label>
                        <input 
                            type="text"
                            name="lastName"
                            id="lastName"
                            required
                            className="w-full border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-invest-gold focus:border-transparent outline-none transition-all bg-slate-50/50"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                    </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                        <label className="block text-sm font-medium text-invest-900 mb-1.5">Attach picture of your Ghana Card (Front)</label>
                        <div className="relative">
                            <input 
                                type="file" 
                                accept=".jpg, .png, .jpeg, image/*"
                                required
                                onChange={(e) => handleFileChange(e, setFrontFile)}
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-slate-100 file:text-invest-900
                                hover:file:bg-slate-200
                                border border-slate-200 rounded-md p-1
                            "/>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                            {frontFile ? <span className="text-green-600 font-medium">{frontFile.name}</span> : "The file must have a maximum size of 1Mb"}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-invest-900 mb-1.5">Attach picture of your Ghana Card (Back)</label>
                        <div className="relative">
                             <input 
                                type="file" 
                                accept=".jpg, .png, .jpeg, image/*"
                                required
                                onChange={(e) => handleFileChange(e, setBackFile)}
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-slate-100 file:text-invest-900
                                hover:file:bg-slate-200
                                border border-slate-200 rounded-md p-1
                            "/>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                            {backFile ? <span className="text-green-600 font-medium">{backFile.name}</span> : "The file must have a maximum size of 1Mb"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-invest-900 text-white font-bold py-3 rounded-lg hover:bg-invest-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                >
                   {isLoading ? (
                       <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Uploading...</span>
                       </>
                   ) : (
                       "Submit"
                   )}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GhanaCardUpdate;
