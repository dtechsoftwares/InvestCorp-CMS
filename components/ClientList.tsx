import React, { useState } from 'react';
import { Client, Portfolio } from '../types';
import { Plus, Search, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  portfolios: Portfolio[];
  onAdd: (client: Partial<Client>) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, portfolios, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    portfolioId: '',
    status: 'Active',
    kycStatus: 'Pending'
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const clientToAdd = {
        ...newClient,
        onboardingDate: new Date().toISOString().split('T')[0]
    }
    onAdd(clientToAdd);
    setShowModal(false);
    setNewClient({ name: '', email: '', phone: '', portfolioId: '', status: 'Active', kycStatus: 'Pending' });
  };

  const getPortfolioName = (id: string) => {
      return portfolios.find(p => p.id === id)?.name || 'Unassigned';
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">Client Directory</h2>
          <p className="text-slate-500 text-sm mt-1">Manage investor profiles and KYC status.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-invest-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg"
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search clients by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">Client Name</th>
              <th className="px-6 py-4 font-medium">Contact Info</th>
              <th className="px-6 py-4 font-medium">Linked Portfolio</th>
              <th className="px-6 py-4 font-medium">KYC Status</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                    <div className="font-semibold text-invest-900">{client.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-900">{client.email}</div>
                  <div className="text-slate-400 text-xs">{client.phone}</div>
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
                <td className="px-6 py-4 text-slate-500">
                  {client.onboardingDate}
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

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg animate-fade-in-down">
            <h3 className="text-lg font-bold text-invest-900 mb-4">Onboard New Client</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input required type="text" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                    <input required type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                    <input required type="tel" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                  </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Assign Portfolio</label>
                <select required value={newClient.portfolioId} onChange={e => setNewClient({...newClient, portfolioId: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                   <option value="">Select Portfolio...</option>
                   {portfolios.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">KYC Status</label>
                <select value={newClient.kycStatus} onChange={e => setNewClient({...newClient, kycStatus: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                   <option>Pending</option>
                   <option>Verified</option>
                   <option>Rejected</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-invest-900">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-invest-900 text-white rounded-lg text-sm font-medium hover:bg-invest-800">Onboard Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
