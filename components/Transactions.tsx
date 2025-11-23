

import React, { useState } from 'react';
import { Transaction, Client, PaymentChannel, InvestmentProduct } from '../types';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Search, Filter, PlusCircle, MinusCircle, Smartphone, CreditCard, Building, BookOpen, CheckCircle, RotateCcw, AlertTriangle, FileSpreadsheet, Upload, ArrowRightLeft, Clock, Eye, EyeOff, ShieldAlert, Flag } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  clients: Client[];
  products?: InvestmentProduct[]; 
  onAddTransaction: (t: Partial<Transaction>) => void;
  onUpdateTransaction?: (t: Transaction) => void;
  isPrivacyMode?: boolean;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, clients, products = [], onAddTransaction, onUpdateTransaction, isPrivacyMode = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [txType, setTxType] = useState<'Deposit' | 'Withdrawal' | 'Transfer'>('Deposit');
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Bulk'>('All');
  
  // State for Bulk Upload Simulation
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  const [bulkPreview, setBulkPreview] = useState<any[]>([]);

  const [newTx, setNewTx] = useState({
    clientId: '',
    amount: '',
    paymentChannel: 'MTN MoMo' as PaymentChannel,
    reference: '',
    paymentNumber: '', // For MoMo/Bank Account
    targetProductId: '',
    sourceProductId: ''
  });

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown Client';
  const getProductName = (id?: string) => products.find(p => p.id === id)?.name || 'General Wallet';

  const formatValue = (val: string | number) => {
      if (isPrivacyMode) return '•••••••';
      if (typeof val === 'number') return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(val);
      return val;
  };

  const filteredTx = transactions.filter(t => {
      const matchesSearch = getClientName(t.clientId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.reference.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === 'Pending') return matchesSearch && t.status === 'Pending';
      return matchesSearch; // For 'All' and 'Bulk' (bulk just shows upload UI mainly)
  });

  const calculateFee = (amount: number, channel: PaymentChannel, type: string) => {
      let fee = 0;
      // Fee Rules
      if (type === 'Deposit') {
          // Deposits usually free or low
          if (channel === 'Visa/Mastercard') fee = amount * 0.025; // 2.5% card fee
      } else if (type === 'Withdrawal') {
          // Withdrawals
          if (channel === 'MTN MoMo' || channel === 'Vodafone Cash' || channel === 'AirtelTigo') fee = Math.min(amount * 0.01, 10); // Capped 1%
          if (channel === 'Bank Transfer') fee = 10; // Fixed GHS 10
      }
      return fee;
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const amountVal = parseFloat(newTx.amount);
      const feeVal = calculateFee(amountVal, newTx.paymentChannel, txType);
      
      onAddTransaction({
          clientId: newTx.clientId,
          type: txType,
          amount: amountVal,
          fee: feeVal,
          netAmount: txType === 'Deposit' ? amountVal - feeVal : amountVal, 
          paymentChannel: newTx.paymentChannel,
          status: 'Pending', // Default to Pending for approval workflow
          reference: newTx.reference || `TX-${Date.now().toString().slice(-6)}`,
          date: new Date().toLocaleString(),
          ledgerStatus: 'Pending',
          targetProductId: newTx.targetProductId,
          sourceProductId: newTx.sourceProductId,
          approvalStatus: 'Pending'
      });
      setShowModal(false);
      setNewTx({ clientId: '', amount: '', paymentChannel: 'MTN MoMo', reference: '', paymentNumber: '', targetProductId: '', sourceProductId: '' });
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setBulkFile(e.target.files[0]);
          // Simulate Parsing
          setBulkPreview([
              { row: 1, client: 'Kwame Mensah', amount: 5000, type: 'Deposit', status: 'Valid' },
              { row: 2, client: 'Ama Osei', amount: 2000, type: 'Deposit', status: 'Valid' },
              { row: 3, client: 'Tech Solutions', amount: 15000, type: 'Deposit', status: 'Valid' },
              { row: 4, client: 'Unknown Ref', amount: 1000, type: 'Deposit', status: 'Error: Client Not Found' },
          ]);
      }
  };

  const processBulk = () => {
      setIsProcessingBulk(true);
      setTimeout(() => {
          setIsProcessingBulk(false);
          alert("Bulk Processing Complete. 3 Transactions Added.");
          setBulkFile(null);
          setBulkPreview([]);
      }, 2000);
  };

  const handleApprove = (tx: Transaction) => {
      if (onUpdateTransaction) {
          onUpdateTransaction({
              ...tx,
              status: 'Completed',
              approvalStatus: 'Approved',
              ledgerStatus: 'Posted'
          });
      }
  };

  const handleFlagSuspicious = (tx: Transaction) => {
      if (confirm(`Flag Transaction ${tx.reference} as Suspicious Activity (AML)? This will be reported to Compliance.`)) {
          if (onUpdateTransaction) {
              onUpdateTransaction({
                  ...tx,
                  isFlagged: true,
                  riskScore: 100 // High Risk
              });
              alert("Transaction Flagged. An incident report has been created.");
          }
      }
  };

  const handleReverse = (tx: Transaction) => {
      if (confirm(`Are you sure you want to reverse transaction ${tx.reference}? This will create a contra-entry.`)) {
         onAddTransaction({
             clientId: tx.clientId,
             type: 'Reversal',
             amount: tx.amount, // Negative or contra
             paymentChannel: tx.paymentChannel,
             date: new Date().toLocaleString(),
             status: 'Reversed',
             reference: `REV-${tx.reference}`,
             ledgerStatus: 'Posted',
             isReversal: true,
             reversedTxId: tx.id
         });
         // Also update original status if needed
         if (onUpdateTransaction) {
             onUpdateTransaction({...tx, status: 'Reversed'});
         }
      }
  };

  const getChannelIcon = (channel?: string) => {
      if (channel?.includes('MoMo') || channel?.includes('Vodafone') || channel?.includes('Airtel')) return <Smartphone size={16} className="text-yellow-600" />;
      if (channel?.includes('Visa') || channel?.includes('Card')) return <CreditCard size={16} className="text-blue-600" />;
      if (channel?.includes('Bank')) return <Building size={16} className="text-slate-600" />;
      return <RefreshCw size={16} />;
  };

  return (
    <div className="animate-fade-in space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">Payment Engine & Wallet</h2>
          <p className="text-slate-500 text-sm mt-1">Manage fund transfers, ledger postings, and channel settlements.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => { setTxType('Transfer'); setShowModal(true); }}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm"
            >
                <ArrowRightLeft size={18} /> Transfer Funds
            </button>
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
                <PlusCircle size={18} /> Top-Up Wallet
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('All')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'All' ? 'border-invest-gold text-invest-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
              All Transactions
          </button>
          <button 
            onClick={() => setActiveTab('Pending')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'Pending' ? 'border-invest-gold text-invest-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
              <Clock size={16} /> Approval Queue
              {transactions.filter(t => t.status === 'Pending').length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs">{transactions.filter(t => t.status === 'Pending').length}</span>
              )}
          </button>
          <button 
            onClick={() => setActiveTab('Bulk')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'Bulk' ? 'border-invest-gold text-invest-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
              <FileSpreadsheet size={16} /> Bulk Operations
          </button>
      </div>

      {activeTab === 'Bulk' ? (
          /* Bulk Upload Interface */
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
              {!bulkFile ? (
                  <div className="max-w-xl mx-auto border-2 border-dashed border-slate-300 rounded-xl p-10 hover:bg-slate-50 transition-colors">
                      <FileSpreadsheet className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                      <h3 className="text-lg font-medium text-slate-900">Upload Bulk Transaction File</h3>
                      <p className="text-slate-500 text-sm mt-2 mb-6">Drag and drop CSV or Excel file here to process bulk deposits or payroll.</p>
                      <label className="bg-invest-900 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-invest-800 transition-colors inline-flex items-center gap-2">
                          <Upload size={18} /> Select File
                          <input type="file" className="hidden" accept=".csv,.xlsx" onChange={handleBulkUpload} />
                      </label>
                  </div>
              ) : (
                  <div className="max-w-4xl mx-auto">
                      <div className="flex justify-between items-center mb-6">
                          <div className="text-left">
                              <h3 className="font-bold text-invest-900">Preview: {bulkFile.name}</h3>
                              <p className="text-xs text-slate-500">4 records found</p>
                          </div>
                          <div className="flex gap-2">
                              <button onClick={() => { setBulkFile(null); setBulkPreview([]); }} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded">Cancel</button>
                              <button onClick={processBulk} disabled={isProcessingBulk} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2">
                                  {isProcessingBulk ? <span className="animate-spin">⟳</span> : <CheckCircle size={18} />}
                                  Process Transactions
                              </button>
                          </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                          <table className="w-full text-left text-sm">
                              <thead className="bg-slate-100 text-slate-500">
                                  <tr>
                                      <th className="px-4 py-3">Row</th>
                                      <th className="px-4 py-3">Client</th>
                                      <th className="px-4 py-3">Type</th>
                                      <th className="px-4 py-3 text-right">Amount</th>
                                      <th className="px-4 py-3">Validation</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {bulkPreview.map((row, idx) => (
                                      <tr key={idx} className="border-t border-slate-200">
                                          <td className="px-4 py-3">{row.row}</td>
                                          <td className="px-4 py-3">{row.client}</td>
                                          <td className="px-4 py-3">{row.type}</td>
                                          <td className="px-4 py-3 text-right font-mono">{row.amount.toLocaleString()}</td>
                                          <td className="px-4 py-3">
                                              <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                  {row.status}
                                              </span>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}
          </div>
      ) : (
          /* Transaction Table */
          <>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md w-full">
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-medium">Date / Ref</th>
                            <th className="px-6 py-4 font-medium">Client</th>
                            <th className="px-6 py-4 font-medium">Channel</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium text-right">Amount</th>
                            <th className="px-6 py-4 font-medium text-right">Fee</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredTx.map((t) => (
                            <tr key={t.id} className={`hover:bg-slate-50/50 transition-colors ${t.isFlagged ? 'bg-red-50/50' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="text-invest-900 font-medium text-xs">{t.date.split(',')[0]}</div>
                                    <div className="text-slate-400 text-[10px] font-mono mt-0.5">{isPrivacyMode ? '••••••••' : t.reference}</div>
                                </td>
                                <td className="px-6 py-4 font-medium text-invest-900">{getClientName(t.clientId)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        {getChannelIcon(t.paymentChannel)}
                                        <span className="text-xs">{t.paymentChannel || 'System'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 ${
                                        t.type === 'Deposit' || t.type === 'Top-up' || t.type === 'Interest Payout' ? 'text-green-600' : 
                                        t.type === 'Withdrawal' || t.type === 'Reversal' ? 'text-red-600' : 'text-blue-600'
                                    }`}>
                                        {t.type === 'Deposit' || t.type === 'Top-up' || t.type === 'Interest Payout' ? <ArrowDownLeft size={16} /> : 
                                        t.type === 'Withdrawal' || t.type === 'Reversal' ? <ArrowUpRight size={16} /> : <RefreshCw size={16} />}
                                        {t.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-700 text-right">
                                    {formatValue(t.amount)}
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-xs text-right">
                                    {t.fee ? formatValue(t.fee) : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    {t.isFlagged ? (
                                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center w-fit gap-1">
                                            <Flag size={10} fill="currentColor" /> Suspicious
                                        </span>
                                    ) : (
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            t.status === 'Completed' ? 'bg-green-50 text-green-700' : 
                                            t.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 
                                            t.status === 'Reversed' ? 'bg-slate-200 text-slate-600 line-through' : 'bg-red-50 text-red-700'
                                        }`}>
                                            {t.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {t.status === 'Pending' && (
                                            <>
                                                <button onClick={() => handleApprove(t)} title="Approve" className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button title="Reject" className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                                    <MinusCircle size={16} />
                                                </button>
                                            </>
                                        )}
                                        {!t.isFlagged && (
                                             <button onClick={() => handleFlagSuspicious(t)} title="Flag Suspicious (AML)" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded">
                                                 <Flag size={16} />
                                             </button>
                                        )}
                                        {t.status === 'Completed' && (
                                            <button onClick={() => handleReverse(t)} title="Reverse Transaction (Admin)" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                                                <RotateCcw size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </>
      )}

      {/* Payment/Transfer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto py-10">
          <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg animate-fade-in-down m-4 overflow-hidden">
            {/* Modal Header */}
            <div className={`p-6 text-white ${txType === 'Withdrawal' ? 'bg-red-600' : 'bg-invest-900'}`}>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    {txType === 'Deposit' ? <PlusCircle /> : txType === 'Transfer' ? <ArrowRightLeft /> : <MinusCircle />}
                    {txType === 'Deposit' ? 'Top-up Wallet' : txType === 'Transfer' ? 'Fund Transfer' : 'Withdraw Funds'}
                </h3>
                <p className="text-white/80 text-sm mt-1">
                    {txType === 'Transfer' ? 'Move funds between products' : 'Select channel and enter details.'}
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
               <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Select Client</label>
                <select required value={newTx.clientId} onChange={e => setNewTx({...newTx, clientId: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                    <option value="">Select Client...</option>
                    {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name} - {c.accountNumber} (Bal: {formatValue(c.walletBalance)})</option>
                    ))}
                </select>
              </div>

              {txType === 'Transfer' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-medium text-slate-500 mb-1">Source Product</label>
                             <select value={newTx.sourceProductId} onChange={e => setNewTx({...newTx, sourceProductId: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                                <option value="">Wallet (Cash)</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                             </select>
                        </div>
                        <div>
                             <label className="block text-xs font-medium text-slate-500 mb-1">Destination Product</label>
                             <select value={newTx.targetProductId} onChange={e => setNewTx({...newTx, targetProductId: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                                <option value="">Select Product...</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                             </select>
                        </div>
                    </div>
                  </>
              ) : (
                /* Payment Channel Grid */
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">Payment Channel</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['MTN MoMo', 'Vodafone Cash', 'AirtelTigo', 'Visa/Mastercard', 'Bank Transfer'].map((channel) => (
                            <button
                                key={channel}
                                type="button"
                                onClick={() => setNewTx({...newTx, paymentChannel: channel as PaymentChannel})}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                                    newTx.paymentChannel === channel 
                                    ? 'border-invest-gold bg-amber-50 text-invest-900 ring-1 ring-invest-gold' 
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                }`}
                            >
                                {getChannelIcon(channel)}
                                <span className="text-[10px] font-medium mt-1">{channel}</span>
                            </button>
                        ))}
                    </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Amount (GHS)</label>
                    <input required type="number" step="0.01" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none font-bold" />
                </div>
                {txType !== 'Transfer' && (
                    <div>
                        {/* Dynamic Field based on channel */}
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                            {newTx.paymentChannel.includes('Card') ? 'Card Last 4 Digits' : newTx.paymentChannel.includes('Bank') ? 'Bank Account No.' : 'Mobile Number'}
                        </label>
                        <input required type="text" value={newTx.paymentNumber} onChange={e => setNewTx({...newTx, paymentNumber: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" placeholder={newTx.paymentChannel.includes('Card') ? '**** 1234' : '024xxxxxxx'} />
                    </div>
                )}
              </div>

              {/* Fee Preview Box (Hide for transfer) */}
              {txType !== 'Transfer' && newTx.amount && (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500">Transaction Fee</span>
                          <span className="font-medium">
                              {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(calculateFee(parseFloat(newTx.amount), newTx.paymentChannel, txType))}
                          </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-invest-900 pt-2 border-t border-slate-200 mt-2">
                          <span>Total {txType === 'Deposit' ? 'Payable' : 'Deductible'}</span>
                          <span>
                              {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(
                                  txType === 'Deposit' 
                                  ? parseFloat(newTx.amount) // Deposit: Client pays amount, fee deducted internally usually, or added. Let's assume deducted from net.
                                  : parseFloat(newTx.amount) + calculateFee(parseFloat(newTx.amount), newTx.paymentChannel, txType) // Withdrawal: Amount + Fee deducted
                              )}
                          </span>
                      </div>
                  </div>
              )}

              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-invest-900">Cancel</button>
                <button type="submit" className={`px-6 py-2 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg ${txType === 'Withdrawal' ? 'bg-red-600 hover:bg-red-700' : 'bg-invest-900 hover:bg-invest-800'}`}>
                    <CheckCircle size={16} /> Confirm Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
