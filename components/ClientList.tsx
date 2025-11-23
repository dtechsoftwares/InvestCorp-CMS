

import React, { useState } from 'react';
import { Client, Portfolio, Beneficiary } from '../types';
import { Plus, Search, MoreVertical, CheckCircle, XCircle, Clock, CreditCard, Calendar, Smartphone, Mail, Building2, User, ScanLine, Camera, UploadCloud, ShieldCheck, ChevronRight, ChevronLeft, Trash2, ScanFace, FileText } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  portfolios: Portfolio[];
  onAdd: (client: Partial<Client>) => void;
  isPrivacyMode?: boolean;
}

const steps = [
    { id: 1, title: 'Identity & Registration', icon: User },
    { id: 2, title: 'KYC & Biometrics', icon: ScanFace },
    { id: 3, title: 'Financial Profile', icon: Building2 },
    { id: 4, title: 'Risk Assessment', icon: ShieldCheck },
    { id: 5, title: 'Beneficiaries', icon: User },
];

const ClientList: React.FC<ClientListProps> = ({ clients, portfolios, onAdd, isPrivacyMode = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Simulations
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [isVerifyingFace, setIsVerifyingFace] = useState(false);

  const securityPattern = "[^()/><\\][\\\\x22,;|]+";

  const emptyClient: Partial<Client> = {
    accountNumber: '',
    name: '',
    clientType: 'Individual',
    registrationSource: 'Offline',
    dob: '',
    email: '',
    phone: '',
    verificationMethod: 'SMS',
    portfolioId: '',
    status: 'Active',
    kycStatus: 'Pending',
    termsAccepted: true,
    initialPin: '',
    ghanaCardNumber: '',
    tin: '',
    residentialAddress: '',
    digitalAddress: '',
    employerName: '',
    occupation: '',
    annualIncomeRange: '',
    sourceOfFunds: '',
    riskScore: 0,
    riskProfileCategory: 'Balanced',
    beneficiaries: [],
    faceMatchScore: 0,
    documents: {}
  };

  const [newClient, setNewClient] = useState<Partial<Client>>(emptyClient);

  // Risk Questionnaire State
  const [riskAnswers, setRiskAnswers] = useState({ q1: 0, q2: 0, q3: 0 });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maskString = (str: string, visibleStart = 2, visibleEnd = 2) => {
      if (!isPrivacyMode) return str;
      if (!str || str.length <= visibleStart + visibleEnd) return '••••••';
      return `${str.substring(0, visibleStart)}••••${str.substring(str.length - visibleEnd)}`;
  };

  const handleNext = () => {
      if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
      if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const clientToAdd = {
        ...newClient,
        onboardingDate: new Date().toISOString().split('T')[0]
    }
    onAdd(clientToAdd);
    setShowModal(false);
    setNewClient(emptyClient);
    setCurrentStep(1);
  };

  const getPortfolioName = (id: string) => {
      return portfolios.find(p => p.id === id)?.name || 'Unassigned';
  }

  // --- Feature Simulations ---
  const simulateOCR = () => {
      setIsScanningOCR(true);
      setTimeout(() => {
          setNewClient(prev => ({
              ...prev,
              name: prev.name || 'Kwame Mensah', // Simulate extracting name
              dob: prev.dob || '1985-05-12',    // Simulate extracting DOB
              ghanaCardNumber: 'GHA-721345982-1'
          }));
          setIsScanningOCR(false);
      }, 2000);
  };

  const simulateFaceMatch = () => {
      setIsVerifyingFace(true);
      setTimeout(() => {
          const score = Math.floor(Math.random() * (99 - 85 + 1) + 85); // Random score between 85-99
          setNewClient(prev => ({ ...prev, faceMatchScore: score }));
          setIsVerifyingFace(false);
      }, 2500);
  };

  const calculateRisk = () => {
      const score = riskAnswers.q1 + riskAnswers.q2 + riskAnswers.q3;
      let category: 'Conservative' | 'Balanced' | 'Aggressive' = 'Balanced';
      if (score <= 4) category = 'Conservative';
      else if (score >= 8) category = 'Aggressive';
      
      setNewClient(prev => ({
          ...prev,
          riskScore: score,
          riskProfileCategory: category
      }));
  };

  const addBeneficiary = () => {
      const b: Beneficiary = { id: Date.now().toString(), name: '', relation: '', percentage: 0, dob: '' };
      setNewClient(prev => ({
          ...prev,
          beneficiaries: [...(prev.beneficiaries || []), b]
      }));
  };

  const updateBeneficiary = (id: string, field: keyof Beneficiary, value: any) => {
      setNewClient(prev => ({
          ...prev,
          beneficiaries: prev.beneficiaries?.map(b => b.id === id ? { ...b, [field]: value } : b)
      }));
  };

  const removeBeneficiary = (id: string) => {
      setNewClient(prev => ({
          ...prev,
          beneficiaries: prev.beneficiaries?.filter(b => b.id !== id)
      }));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">Client Accounts</h2>
          <p className="text-slate-500 text-sm mt-1">Manage investor accounts, verification settings, and KYC.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-invest-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg"
        >
          <Plus size={18} />
          Onboard Client
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or account #..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-invest-900 pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Account Details</th>
                <th className="px-6 py-4 font-medium">Client Profile</th>
                <th className="px-6 py-4 font-medium">Contact & Verification</th>
                <th className="px-6 py-4 font-medium">Portfolio</th>
                <th className="px-6 py-4 font-medium">Risk & KYC</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-invest-gold" />
                        <span className="font-mono font-medium text-invest-900">{isPrivacyMode ? '••••••••' : client.accountNumber}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Joined {client.onboardingDate}</div>
                      {client.registrationSource && (
                          <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">{client.registrationSource}</span>
                      )}
                  </td>
                  <td className="px-6 py-4">
                      <div className="font-semibold text-invest-900">{client.name}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="text-slate-500 text-xs flex items-center gap-1">
                          <Calendar size={12} /> {isPrivacyMode ? '••••-••-••' : client.dob}
                        </div>
                        <div className="text-slate-500 text-xs flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                          {client.clientType === 'Corporate' ? <Building2 size={10} /> : <User size={10} />}
                          {client.clientType}
                        </div>
                      </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900">{maskString(client.email)}</div>
                    <div className="text-slate-500 text-xs">{maskString(client.phone)}</div>
                    <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600">
                      {client.verificationMethod === 'SMS' ? <Smartphone size={10} /> : <Mail size={10} />}
                      Verify via {client.verificationMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-invest-gold font-medium">{getPortfolioName(client.portfolioId)}</span>
                    <div className="text-xs text-slate-400 mt-1">Risk: {client.riskProfileCategory}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 text-xs font-medium mb-1
                      ${client.kycStatus === 'Verified' ? 'text-green-600' : 
                        client.kycStatus === 'Rejected' ? 'text-red-600' : 'text-amber-600'}`}>
                      {client.kycStatus === 'Verified' ? <CheckCircle size={14} /> : 
                       client.kycStatus === 'Rejected' ? <XCircle size={14} /> : <Clock size={14} />}
                      {client.kycStatus}
                    </div>
                    {client.riskScore !== undefined && (
                        <div className={`text-[10px] px-1.5 py-0.5 rounded border flex w-fit items-center gap-1 ${
                            client.riskScore >= 7 ? 'bg-red-50 text-red-600 border-red-100' : 
                            client.riskScore >= 4 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-green-50 text-green-600 border-green-100'
                        }`}>
                             <ShieldCheck size={10} /> Score: {client.riskScore}/9
                        </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-invest-900 rounded hover:bg-slate-100">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredClients.length === 0 && (
           <div className="p-12 text-center text-slate-400">
             <p>No clients found matching your search.</p>
           </div>
        )}
      </div>

      {/* Onboarding Wizard Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-fade-in-down m-4 flex flex-col h-[85vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-invest-900">Client Onboarding Wizard</h3>
                    <p className="text-sm text-slate-500">Step {currentStep} of 5: {steps[currentStep-1].title}</p>
                </div>
                <button onClick={() => setShowModal(false)}><XCircle className="text-slate-400 hover:text-slate-600" /></button>
            </div>

            {/* Stepper */}
            <div className="px-8 pt-6 pb-2">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10"></div>
                    {steps.map((step) => {
                        const active = currentStep >= step.id;
                        const current = currentStep === step.id;
                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${active ? 'bg-invest-900 border-invest-900 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
                                    <step.icon size={18} />
                                </div>
                                <span className={`text-xs font-medium ${current ? 'text-invest-900' : 'text-slate-400'}`}>{step.title}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <form id="onboardingForm" onSubmit={handleFinish} className="space-y-6">
                    
                    {/* STEP 1: IDENTITY */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="source" checked={newClient.registrationSource === 'Offline'} onChange={() => setNewClient({...newClient, registrationSource: 'Offline'})} className="accent-invest-gold" />
                                    <span className="text-sm font-medium text-invest-900">In-Branch (Offline)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="source" checked={newClient.registrationSource === 'Online'} onChange={() => setNewClient({...newClient, registrationSource: 'Online'})} className="accent-invest-gold" />
                                    <span className="text-sm font-medium text-invest-900">Online Request</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Account Number</label>
                                    <input required type="text" pattern={securityPattern} minLength={8} placeholder="e.g. 00400412345" value={newClient.accountNumber} onChange={e => setNewClient({...newClient, accountNumber: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none font-mono" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Client Type</label>
                                    <select required value={newClient.clientType} onChange={e => setNewClient({...newClient, clientType: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                                        <option value="Individual">Individual</option>
                                        <option value="Corporate">Corporate</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                                    <input required type="text" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Date of Birth</label>
                                    <input required type="date" value={newClient.dob} onChange={e => setNewClient({...newClient, dob: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                                    <input required type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                                    <input required type="tel" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: KYC & BIOMETRICS */}
                    {currentStep === 2 && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Ghana Card Section */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-invest-900 mb-4 flex items-center gap-2"><CreditCard size={18} /> Identification</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Ghana Card Number</label>
                                        <div className="flex gap-2">
                                            <input type="text" value={newClient.ghanaCardNumber} onChange={e => setNewClient({...newClient, ghanaCardNumber: e.target.value})} className="flex-1 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none font-mono" placeholder="GHA-000000000-0" />
                                            <button type="button" onClick={simulateOCR} disabled={isScanningOCR} className="bg-invest-900 text-white px-4 rounded-lg flex items-center gap-2 text-sm hover:bg-invest-800 disabled:opacity-70">
                                                {isScanningOCR ? <span className="animate-spin">⟳</span> : <ScanLine size={16} />}
                                                {isScanningOCR ? 'Scanning...' : 'OCR Scan'}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1">OCR will auto-fill Name and DOB if detected.</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Passport / Voter ID (Optional)</label>
                                        <div className="flex items-center gap-2">
                                            <input type="file" className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white file:text-invest-900 border border-slate-200 rounded-lg" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Proof of Address</label>
                                        <input type="file" className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white file:text-invest-900 border border-slate-200 rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            {/* Biometrics Section */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="font-bold text-invest-900 mb-4 flex items-center gap-2"><ScanFace size={18} /> Biometric Verification</h4>
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden group cursor-pointer hover:border-invest-gold">
                                        <Camera className="text-slate-400 group-hover:text-invest-gold" size={32} />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">Upload Selfie</div>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <button 
                                            type="button" 
                                            onClick={simulateFaceMatch}
                                            disabled={isVerifyingFace}
                                            className="w-full py-3 bg-white border border-invest-gold text-invest-gold rounded-lg font-medium hover:bg-amber-50 flex items-center justify-center gap-2 mb-2"
                                        >
                                            {isVerifyingFace ? <span className="animate-spin">⟳</span> : <ShieldCheck size={18} />}
                                            {isVerifyingFace ? 'Analyzing Biometrics...' : 'Run Face Match Analysis'}
                                        </button>
                                        {newClient.faceMatchScore ? (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
                                                <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle size={20} /></div>
                                                <div>
                                                    <div className="font-bold text-green-800">Match Confirmed ({newClient.faceMatchScore}%)</div>
                                                    <div className="text-xs text-green-600">Selfie matches ID document photo.</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 text-center">Upload a selfie to verify against ID.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Residential Address</label>
                                    <textarea rows={2} value={newClient.residentialAddress} onChange={e => setNewClient({...newClient, residentialAddress: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none resize-none"></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Digital Address (GPS)</label>
                                    <input type="text" value={newClient.digitalAddress} onChange={e => setNewClient({...newClient, digitalAddress: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" placeholder="GA-123-4567" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: FINANCIALS */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <h4 className="font-bold text-invest-900 mb-2">Employment & Financial Background</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Employer / Business Name</label>
                                    <input type="text" value={newClient.employerName} onChange={e => setNewClient({...newClient, employerName: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Occupation / Nature of Business</label>
                                    <input type="text" value={newClient.occupation} onChange={e => setNewClient({...newClient, occupation: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Annual Income Range</label>
                                    <select value={newClient.annualIncomeRange} onChange={e => setNewClient({...newClient, annualIncomeRange: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                                        <option value="">Select Range...</option>
                                        <option>Under ₵50,000</option>
                                        <option>₵50,000 - ₵150,000</option>
                                        <option>₵150,000 - ₵500,000</option>
                                        <option>Over ₵500,000</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Source of Funds</label>
                                    <select value={newClient.sourceOfFunds} onChange={e => setNewClient({...newClient, sourceOfFunds: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                                        <option value="">Select Source...</option>
                                        <option>Salary</option>
                                        <option>Business Profit</option>
                                        <option>Inheritance</option>
                                        <option>Investment Returns</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Tax Identification Number (TIN)</label>
                                    <input type="text" value={newClient.tin} onChange={e => setNewClient({...newClient, tin: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Initial Portfolio Assignment</label>
                                    <select required value={newClient.portfolioId} onChange={e => setNewClient({...newClient, portfolioId: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                                        <option value="">Select Portfolio...</option>
                                        {portfolios.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: RISK ASSESSMENT */}
                    {currentStep === 4 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                                <h4 className="font-bold text-invest-900 mb-4">Risk Profiling Questionnaire</h4>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 mb-2">1. What is your investment time horizon?</p>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="q1" onChange={() => setRiskAnswers({...riskAnswers, q1: 1})} /> Less than 1 year</label>
                                            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="q1" onChange={() => setRiskAnswers({...riskAnswers, q1: 2})} /> 1 - 5 years</label>
                                            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="q1" onChange={() => setRiskAnswers({...riskAnswers, q1: 3})} /> More than 5 years</label>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 mb-2">2. How do you react to a 10% drop in your portfolio?</p>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="q2" onChange={() => setRiskAnswers({...riskAnswers, q2: 1})} /> Sell immediately</label>
                                            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="q2" onChange={() => setRiskAnswers({...riskAnswers, q2: 2})} /> Hold and wait</label>
                                            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="q2" onChange={() => setRiskAnswers({...riskAnswers, q2: 3})} /> Buy more</label>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 mb-2">3. What is your primary investment goal?</p>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="q3" onChange={() => setRiskAnswers({...riskAnswers, q3: 1})} /> Capital Preservation</label>
                                            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="q3" onChange={() => setRiskAnswers({...riskAnswers, q3: 2})} /> Steady Income</label>
                                            <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="q3" onChange={() => setRiskAnswers({...riskAnswers, q3: 3})} /> Maximum Growth</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <button type="button" onClick={calculateRisk} className="text-sm text-invest-gold font-bold hover:underline">Calculate Profile Score</button>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div>
                                    <div className="text-xs text-slate-400">Calculated Profile</div>
                                    <div className="text-xl font-bold text-invest-900">{newClient.riskProfileCategory}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-400">Risk Score</div>
                                    <div className="text-xl font-bold text-invest-gold">{newClient.riskScore}/9</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: BENEFICIARIES */}
                    {currentStep === 5 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-invest-900">Beneficiaries</h4>
                                <button type="button" onClick={addBeneficiary} className="text-xs bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 text-slate-700 font-medium">+ Add New</button>
                            </div>
                            
                            {newClient.beneficiaries?.map((b, idx) => (
                                <div key={b.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
                                    <button type="button" onClick={() => removeBeneficiary(b.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                                            <input type="text" value={b.name} onChange={e => updateBeneficiary(b.id, 'name', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-invest-gold" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Relationship</label>
                                            <input type="text" value={b.relation} onChange={e => updateBeneficiary(b.id, 'relation', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-invest-gold" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Percentage (%)</label>
                                            <input type="number" value={b.percentage} onChange={e => updateBeneficiary(b.id, 'percentage', parseFloat(e.target.value))} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-invest-gold" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {(!newClient.beneficiaries || newClient.beneficiaries.length === 0) && (
                                <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
                                    No beneficiaries added.
                                </div>
                            )}

                             <div className="border-t border-slate-100 pt-4 mt-6">
                                <div className="flex items-start gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="terms" 
                                            checked={newClient.termsAccepted}
                                            onChange={e => setNewClient({...newClient, termsAccepted: e.target.checked})}
                                            className="mt-1 rounded border-slate-300 text-invest-gold focus:ring-invest-gold"
                                            required 
                                        />
                                        <label htmlFor="terms" className="text-sm text-slate-600">
                                            I confirm all KYC information is accurate and agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-invest-gold hover:underline font-medium">Terms & Conditions</button>
                                        </label>
                                </div>
                            </div>
                        </div>
                    )}

                </form>
            </div>

            {/* Footer Navigation */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between rounded-b-xl">
                <button 
                    onClick={handlePrev} 
                    disabled={currentStep === 1}
                    className="px-6 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <ChevronLeft size={16} /> Previous
                </button>
                
                {currentStep < 5 ? (
                    <button 
                        onClick={handleNext} 
                        className="px-6 py-2 rounded-lg text-sm font-medium bg-invest-900 text-white hover:bg-invest-800 flex items-center gap-2"
                    >
                        Next Step <ChevronRight size={16} />
                    </button>
                ) : (
                    <button 
                        onClick={handleFinish}
                        className="px-8 py-2 rounded-lg text-sm font-bold bg-invest-gold text-white hover:bg-amber-600 shadow-lg flex items-center gap-2"
                    >
                        <CheckCircle size={18} /> Complete Onboarding
                    </button>
                )}
            </div>

          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-invest-900">Terms and Conditions</h3>
                    <button onClick={() => setShowTerms(false)}><XCircle className="text-slate-400 hover:text-slate-600" /></button>
                </div>
                <div className="p-6 overflow-y-auto text-sm text-slate-600 space-y-4 leading-relaxed">
                    <p className="font-bold text-invest-900">Terms and Conditions of Using InvestCorp’s e-Hub / Self-service Platforms</p>
                    <p>InvestCorp Asset Management Limited’s self-service platforms provide a convenient means of managing your investment accounts and transactions with us.</p>
                    <p>...</p>
                    <p>I acknowledge that this digital KYC process is binding.</p>
                </div>
                <div className="p-4 border-t border-slate-100 text-right">
                    <button onClick={() => setShowTerms(false)} className="px-4 py-2 bg-invest-900 text-white rounded-lg text-sm font-medium hover:bg-invest-800">Close</button>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
