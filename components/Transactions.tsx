
import React, { useState } from 'react';
import { Transaction, Client } from '../types';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Search, Filter, PlusCircle, MinusCircle } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  clients: Client[];
  onAddTransaction: (t: Partial<Transaction>) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, clients, onAddTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [txType, setTxType] = useState<'Deposit' | 'Withdrawal'>('Deposit');
  
  const [newTx, setNewTx] = useState({
    clientId: '',
    amount: '',
    reference: ''
  });

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown Client';

  const filteredTx = transactions.filter(t => 
    getClientName(t.clientId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onAddTransaction({
          clientId: newTx.clientId,
          type: txType,
          amount: parseFloat(newTx.amount),
          status: 'Completed',
          reference: newTx.reference || `REF-${Date.now()}`,
          date: new Date().toLocaleString()
      });
      setShowModal(false);
      setNewTx({ clientId: '', amount: '', reference: '' });
  };

  return (
    <div className="animate-fade-in space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">Transactions & Wallet</h2>
          <p className="text-slate-500 text-sm mt-1">Process deposits, withdrawals, and view history.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => { setTxType('Withdrawal'); setShowModal(true); }}
                className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center gap-2 shadow-sm"
            >
                <MinusCircle size={18} /> Process Withdrawal
            </button>
            <button 
                onClick={() => { setTxType('Deposit'); setShowModal(true); }}
                className="px-4 py-2 bg-invest-900 text-white rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg"
            >
                <PlusCircle size={18} /> New Deposit
            </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <div className="text-sm text-slate-500 mb-1">Total Deposits (Today)</div>
             <div className="text-2xl font-bold text-green-600">₵45,200.00</div>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <div className="text-sm text-slate-500 mb-1">Total Withdrawals (Today)</div>
             <div className="text-2xl font-bold text-red-600">₵12,500.00</div>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <div className="text-sm text-slate-500 mb-1">Net Flow</div>
             <div className="text-2xl font-bold text-invest-900">₵32,700.00</div>
         </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by client or reference..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
          />
        </div>
        <button className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
             <Filter size={16} /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Reference</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
            {filteredTx.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 text-xs font-mono">{t.date}</td>
                    <td className="px-6 py-4 font-mono text-xs">{t.reference}</td>
                    <td className="px-6 py-4 font-medium text-invest-900">{getClientName(t.clientId)}</td>
                    <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 ${
                            t.type === 'Deposit' || t.type === 'Top-up' ? 'text-green-600' : 
                            t.type === 'Withdrawal' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                            {t.type === 'Deposit' || t.type === 'Top-up' ? <ArrowDownLeft size={16} /> : 
                             t.type === 'Withdrawal' ? <ArrowUpRight size={16} /> : <RefreshCw size={16} />}
                            {t.type}
                        </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                        {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(t.amount)}
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            t.status === 'Completed' ? 'bg-green-50 text-green-700' : 
                            t.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}>
                            {t.status}
                        </span>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-down">
            <h3 className="text-lg font-bold text-invest-900 mb-4">{txType} Funds</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Client Account</label>
                <select required value={newTx.clientId} onChange={e => setNewTx({...newTx, clientId: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                    <option value="">Select Client...</option>
                    {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name} - {c.accountNumber}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Amount (GHS)</label>
                <input required type="number" step="0.01" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Reference / Description</label>
                <input type="text" value={newTx.reference} onChange={e => setNewTx({...newTx, reference: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" placeholder="e.g. Bank Transfer ID" />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-invest-900">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-invest-900 text-white rounded-lg text-sm font-medium hover:bg-invest-800">Confirm {txType}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
