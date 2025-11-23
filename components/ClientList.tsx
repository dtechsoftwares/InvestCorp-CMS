
import React, { useState } from 'react';
import { Client, Portfolio } from '../types';
import { Plus, Search, MoreVertical, CheckCircle, XCircle, Clock, CreditCard, Calendar, Smartphone, Mail, Building2, User, FileText, Lock } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  portfolios: Portfolio[];
  onAdd: (client: Partial<Client>) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, portfolios, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  // Validation pattern from register-account.html
  const securityPattern = "[^()/><\\][\\\\x22,;|]+";

  const [newClient, setNewClient] = useState<Partial<Client>>({
    accountNumber: '',
    name: '',
    clientType: 'Individual',
    dob: '',
    email: '',
    phone: '',
    verificationMethod: 'SMS',
    portfolioId: '',
    status: 'Active',
    kycStatus: 'Pending',
    termsAccepted: true,
    initialPin: ''
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const clientToAdd = {
        ...newClient,
        onboardingDate: new Date().toISOString().split('T')[0]
    }
    onAdd(clientToAdd);
    setShowModal(false);
    setNewClient({ 
      accountNumber: '', 
      name: '', 
      clientType: 'Individual',
      dob: '', 
      email: '', 
      phone: '', 
      verificationMethod: 'SMS', 
      portfolioId: '', 
      status: 'Active', 
      kycStatus: 'Pending',
      termsAccepted: true,
      initialPin: ''
    });
  };

  const getPortfolioName = (id: string) => {
      return portfolios.find(p => p.id === id)?.name || 'Unassigned';
  }

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
          Create Account
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
                <th className="px-6 py-4 font-medium">KYC Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-invest-gold" />
                        <span className="font-mono font-medium text-invest-900">{client.accountNumber}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Joined {client.onboardingDate}</div>
                  </td>
                  <td className="px-6 py-4">
                      <div className="font-semibold text-invest-900">{client.name}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="text-slate-500 text-xs flex items-center gap-1">
                          <Calendar size={12} /> {client.dob}
                        </div>
                        <div className="text-slate-500 text-xs flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                          {client.clientType === 'Corporate' ? <Building2 size={10} /> : <User size={10} />}
                          {client.clientType}
                        </div>
                      </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900">{client.email}</div>
                    <div className="text-slate-500 text-xs">{client.phone}</div>
                    <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600">
                      {client.verificationMethod === 'SMS' ? <Smartphone size={10} /> : <Mail size={10} />}
                      Verify via {client.verificationMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-invest-gold font-medium">{getPortfolioName(client.portfolioId)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 text-xs font-medium
                      ${client.kycStatus === 'Verified' ? 'text-green-600' : 
                        client.kycStatus === 'Rejected' ? 'text-red-600' : 'text-amber-600'}`}>
                      {client.kycStatus === 'Verified' ? <CheckCircle size={14} /> : 
                       client.kycStatus === 'Rejected' ? <XCircle size={14} /> : <Clock size={14} />}
                      {client.kycStatus}
                    </div>
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

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl animate-fade-in-down m-4">
            <h3 className="text-lg font-bold text-invest-900 mb-4 border-b border-slate-100 pb-2">Register New Client Account</h3>
            <form onSubmit={handleAdd} className="space-y-6">
              
              {/* Account Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Account Number</label>
                    <input required type="text" pattern={securityPattern} minLength={8} placeholder="e.g. 00400412345" value={newClient.accountNumber} onChange={e => setNewClient({...newClient, accountNumber: e.target.value})} className="w-full bg-white text-invest-900 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none font-mono" />
                    <p className="text-[10px] text-slate-400 mt-1">Min length: 8. No special characters.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Client Type</label>
                    <select required value={newClient.clientType} onChange={e => setNewClient({...newClient, clientType: e.target.value as any})} className="w-full bg-white text-invest-900 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                       <option value="Individual">Individual</option>
                       <option value="Corporate">Corporate</option>
                    </select>
                  </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Full Name / Corporate Name</label>
                  <input required type="text" pattern={securityPattern} value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full bg-white text-invest-900 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Date of Birth / Incorporation</label>
                  <input required type="date" value={newClient.dob} onChange={e => setNewClient({...newClient, dob: e.target.value})} className="w-full bg-white text-invest-900 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Email Address</label>
                    <input required type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full bg-white text-invest-900 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Phone Number</label>
                    <input required type="tel" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full bg-white text-invest-900 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                  </div>
              </div>

              {/* Portfolio & Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Linked Portfolio</label>
                    <select required value={newClient.portfolioId} onChange={e => setNewClient({...newClient, portfolioId: e.target.value})} className="w-full bg-white text-invest-900 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                       <option value="">Select Portfolio...</option>
                       {portfolios.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
                    </select>
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1">Verification Method</label>
                     <select value={newClient.verificationMethod} onChange={e => setNewClient({...newClient, verificationMethod: e.target.value as any})} className="w-full bg-white text-invest-900 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                        <option value="SMS">SMS (Phone)</option>
                        <option value="EMAIL">Email</option>
                     </select>
                  </div>
              </div>

              {/* Corporate PIN (Only if Corporate) */}
              {newClient.clientType === 'Corporate' && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                   <h4 className="text-sm font-bold text-invest-900 mb-3 flex items-center gap-2"><Lock size={14} /> Corporate Security</h4>
                   <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Initial PIN (4 Digits)</label>
                      <input 
                        type="password" 
                        maxLength={4} 
                        placeholder="****" 
                        value={newClient.initialPin} 
                        onChange={e => setNewClient({...newClient, initialPin: e.target.value})} 
                        className="w-full bg-white text-invest-900 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none font-mono tracking-widest" 
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Required for first-time corporate login.</p>
                   </div>
                </div>
              )}
              
              <div className="border-t border-slate-100 pt-4">
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
                            I agree with the <button type="button" onClick={() => setShowTerms(true)} className="text-invest-gold hover:underline font-medium">Site Terms & Conditions</button>
                        </label>
                   </div>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-invest-900">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-invest-900 text-white rounded-lg text-sm font-medium hover:bg-invest-800">Create Account</button>
              </div>
            </form>
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
                    
                    <p className="font-bold mt-4">Access to the Web Portal and Mobile App</p>
                    <ul className="list-decimal pl-5 space-y-2">
                        <li>To use the InvestCorp mobile app you will be required to download the app from the Apple App Store or the Android Google Play Store.</li>
                        <li>Our online service portal can be accessed at www.investcorpgh.com.</li>
                        <li>Key functions of our self-service platforms will require that your device has active internet connection.</li>
                        <li>You will be required to create your log-in details with a password. Security features such as One-time PIN (OTP) will be used.</li>
                        <li>The InvestCorp self-service platforms are created for your convenience.</li>
                    </ul>

                    <p className="font-bold mt-4">Your Responsibilities for Security</p>
                    <p>The InvestCorp self-service platforms store and process personal information. It is your responsibility to keep your computer and phone secure. You should change your password regularly.</p>
                    
                    <p className="font-bold mt-4">My Consent</p>
                    <p>I have fully read and accept without reservations the content of these Terms and Conditions. I acknowledge that my password is the ultimate security check.</p>
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