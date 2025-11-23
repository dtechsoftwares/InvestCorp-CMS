
import React, { useState } from 'react';
import { InvestmentProduct, ProductCategory, InterestConfig } from '../types';
import { Plus, Search, Tag, Clock, Percent, PlayCircle, AlertCircle, TrendingUp, BarChart2, DollarSign, Briefcase, RefreshCw, Settings, ShieldCheck, Calculator } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductManagementProps {
  products: InvestmentProduct[];
  onAdd: (product: InvestmentProduct) => void;
  onUpdate?: (product: InvestmentProduct) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ products, onAdd, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<ProductCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSyncingRates, setIsSyncingRates] = useState(false);
  
  // Initial state for new product with Interest Config
  const [newProduct, setNewProduct] = useState<Partial<InvestmentProduct>>({
    name: '',
    category: 'Fixed Deposit',
    interestRate: 0,
    duration: '',
    minAmount: 0,
    status: 'Active',
    penaltyRate: 0,
    managementFee: 0,
    currentNav: 0,
    allowRollover: true,
    autoDebitSupported: false,
    interestConfig: {
        frequency: 'Daily',
        method: 'Simple',
        baseDays: '365',
        payoutDestination: 'Reinvest',
        formula: 'Standard'
    }
  });

  const categories: { id: ProductCategory | 'All', label: string, icon: any }[] = [
      { id: 'All', label: 'All Products', icon: Tag },
      { id: 'Fixed Deposit', label: 'Fixed Deposits', icon: Clock },
      { id: 'T-Bill', label: 'Treasury Bills', icon: TrendingUp },
      { id: 'Mutual Fund', label: 'Mutual Funds', icon: BarChart2 },
      { id: 'Savings Plan', label: 'Savings & Goals', icon: DollarSign },
      { id: 'Asset Management', label: 'Wealth Mgmt', icon: Briefcase },
  ];

  const filteredProducts = products.filter(p => 
    (activeTab === 'All' || p.category === activeTab) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate mock history if Mutual Fund
    let navHistory = undefined;
    if (newProduct.category === 'Mutual Fund') {
        navHistory = Array.from({ length: 7 }, (_, i) => ({
            date: `Day ${i+1}`,
            value: (newProduct.currentNav || 10) + (Math.random() * 0.5 - 0.25)
        }));
    }

    onAdd({
        ...newProduct as InvestmentProduct,
        id: Date.now().toString(),
        navHistory
    });
    setShowModal(false);
    // Reset form
    setNewProduct({ 
        name: '', category: 'Fixed Deposit', interestRate: 0, duration: '', minAmount: 0, status: 'Active',
        penaltyRate: 0, managementFee: 0, currentNav: 0, allowRollover: true, autoDebitSupported: false,
        interestConfig: {
            frequency: 'Daily',
            method: 'Simple',
            baseDays: '365',
            payoutDestination: 'Reinvest',
            formula: 'Standard'
        }
    });
  };

  const handleSyncRates = () => {
      setIsSyncingRates(true);
      setTimeout(() => {
          setIsSyncingRates(false);
          if (onUpdate) {
              // Simulate updating all T-Bills
              products.filter(p => p.category === 'T-Bill').forEach(p => {
                  const newRate = 20 + Math.random() * 5; // Random rate 20-25%
                  onUpdate({...p, interestRate: parseFloat(newRate.toFixed(2)), discountRate: parseFloat(newRate.toFixed(2))});
              });
              alert("Market Rates Synced: T-Bill rates updated from BoG API (Simulated).");
          } else {
              alert("Market Rates Synced (Visual Only).");
          }
      }, 1500);
  };

  const handleUpdateNAV = (product: InvestmentProduct) => {
      const newPrice = prompt("Enter new NAV Price:", product.currentNav?.toString());
      if (newPrice && onUpdate) {
          const val = parseFloat(newPrice);
          if (!isNaN(val)) {
              onUpdate({
                  ...product,
                  currentNav: val,
                  // Add to history if exists, ensuring array
                  navHistory: [...(product.navHistory || []), { date: new Date().toLocaleDateString(), value: val }]
              });
          }
      }
  };

  const updateInterestConfig = (key: keyof InterestConfig, value: any) => {
      setNewProduct(prev => ({
          ...prev,
          interestConfig: {
              ...(prev.interestConfig as InterestConfig),
              [key]: value
          }
      }));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">Investment Products</h2>
          <p className="text-slate-500 text-sm mt-1">Manage instruments, rates, and fund performance.</p>
        </div>
        <div className="flex gap-2">
            {activeTab === 'T-Bill' && (
                <button 
                    onClick={handleSyncRates}
                    disabled={isSyncingRates}
                    className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2"
                >
                    {isSyncingRates ? <span className="animate-spin">⟳</span> : <RefreshCw size={18} />}
                    Sync Market Rates
                </button>
            )}
            <button 
                onClick={() => setShowModal(true)}
                className="bg-invest-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg"
            >
                <Plus size={18} />
                Create Product
            </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 custom-scrollbar">
          {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === cat.id 
                    ? 'bg-invest-gold text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                  <cat.icon size={16} />
                  {cat.label}
              </button>
          ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab === 'All' ? 'all products' : activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full opacity-10 ${product.status === 'Active' ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-50 rounded-lg text-invest-900 group-hover:bg-invest-900 group-hover:text-white transition-colors">
                        {product.category === 'Fixed Deposit' && <Clock size={20} />}
                        {product.category === 'T-Bill' && <TrendingUp size={20} />}
                        {product.category === 'Mutual Fund' && <BarChart2 size={20} />}
                        {product.category === 'Savings Plan' && <DollarSign size={20} />}
                        {product.category === 'Asset Management' && <Briefcase size={20} />}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${product.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {product.status}
                    </span>
                </div>

                <h3 className="font-bold text-invest-900 text-lg mb-1">{product.name}</h3>
                <p className="text-slate-500 text-xs mb-4 uppercase tracking-wider">{product.category}</p>

                {/* Dynamic Content Based on Category */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                    
                    {/* Common: Interest Rate (FD, Savings, Bonds) */}
                    {product.interestRate !== undefined && product.interestRate > 0 && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 flex items-center gap-2"><Percent size={14}/> Interest Rate</span>
                            <span className="font-bold text-invest-gold">{product.interestRate}%</span>
                        </div>
                    )}

                    {/* Common: Duration */}
                    {product.duration && (
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 flex items-center gap-2"><Clock size={14}/> Duration</span>
                            <span className="font-medium text-slate-700">{product.duration}</span>
                        </div>
                    )}

                    {/* Interest Engine Tag */}
                    {product.interestConfig && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 flex items-center gap-2"><Calculator size={14}/> Interest Mode</span>
                            <span className="font-medium text-slate-700">{product.interestConfig.frequency} / {product.interestConfig.method}</span>
                        </div>
                    )}

                    {/* FD Specifics */}
                    {product.category === 'Fixed Deposit' && (
                        <>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center gap-2"><AlertCircle size={14}/> Early Penalty</span>
                                <span className="font-medium text-red-500">{product.penaltyRate}%</span>
                            </div>
                            {product.allowRollover && (
                                <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded text-center mt-2">
                                    Auto Rollover Available
                                </div>
                            )}
                        </>
                    )}

                    {/* T-Bill Specifics */}
                    {product.category === 'T-Bill' && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Discount Rate</span>
                            <span className="font-medium text-invest-900">{product.discountRate || product.interestRate}%</span>
                        </div>
                    )}

                    {/* Mutual Fund Specifics */}
                    {product.category === 'Mutual Fund' && (
                        <>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-slate-500">Current NAV</span>
                                <span className="font-bold text-invest-900">₵{product.currentNav?.toFixed(4)}</span>
                            </div>
                            {product.navHistory && (
                                <div className="h-16 w-full bg-slate-50 rounded overflow-hidden">
                                     <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={product.navHistory}>
                                            <defs>
                                                <linearGradient id={`grad-${product.id}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <Tooltip active={false} />
                                            <Area type="monotone" dataKey="value" stroke="#d97706" strokeWidth={2} fill={`url(#grad-${product.id})`} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                            <button 
                                onClick={() => handleUpdateNAV(product)}
                                className="w-full mt-2 text-xs bg-invest-900 text-white py-1.5 rounded hover:bg-invest-800 transition-colors"
                            >
                                Update NAV Price
                            </button>
                        </>
                    )}

                    {/* Savings Plan Specifics */}
                    {product.category === 'Savings Plan' && (
                        <>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Min. Deposit</span>
                                <span className="font-medium text-slate-700">₵{product.minAmount}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                {product.isRecurring && <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-1 rounded">Recurring</span>}
                                {product.autoDebitSupported && <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded">Auto-Debit</span>}
                            </div>
                        </>
                    )}

                    {/* Asset Mgmt Specifics */}
                    {product.category === 'Asset Management' && (
                        <>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Mgmt Fee</span>
                                <span className="font-medium text-slate-700">{product.managementFee}% /yr</span>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Min. Entry</span>
                                <span className="font-bold text-invest-900">₵{product.minAmount.toLocaleString()}</span>
                            </div>
                            {product.assignedManager && (
                                <div className="mt-2 text-xs flex items-center gap-1 text-slate-500">
                                    <ShieldCheck size={12} /> Mgr: {product.assignedManager}
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto py-10">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl animate-fade-in-down m-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-bold text-invest-900 mb-4">Create New Product</h3>
            <form onSubmit={handleAdd} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Product Name</label>
                        <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" placeholder="e.g. 91-Day Treasury Bill" />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                        <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                            <option value="Fixed Deposit">Fixed Deposit</option>
                            <option value="T-Bill">Treasury Bill</option>
                            <option value="Mutual Fund">Mutual Fund / Unit Trust</option>
                            <option value="Savings Plan">Savings / Target Plan</option>
                            <option value="Asset Management">Asset Management</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Min Amount (GHS)</label>
                            <input required type="number" value={newProduct.minAmount} onChange={e => setNewProduct({...newProduct, minAmount: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                            <select value={newProduct.status} onChange={e => setNewProduct({...newProduct, status: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                      </div>
                  </div>

                  {/* Interest Config */}
                  <div className="bg-invest-900/5 p-4 rounded-lg border border-invest-900/10 space-y-4">
                      <h4 className="font-bold text-invest-900 text-sm flex items-center gap-2">
                          <Calculator size={16} /> Interest Engine Config
                      </h4>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Computation Frequency</label>
                          <select value={newProduct.interestConfig?.frequency} onChange={e => updateInterestConfig('frequency', e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                              <option>Daily</option>
                              <option>Monthly</option>
                              <option>Quarterly</option>
                              <option>Annually</option>
                              <option>Maturity</option>
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">Method</label>
                              <select value={newProduct.interestConfig?.method} onChange={e => updateInterestConfig('method', e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                                  <option>Simple</option>
                                  <option>Compound</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">Base Days</label>
                              <select value={newProduct.interestConfig?.baseDays} onChange={e => updateInterestConfig('baseDays', e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                                  <option>365</option>
                                  <option>360</option>
                                  <option>366</option>
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Formula Type</label>
                          <select value={newProduct.interestConfig?.formula} onChange={e => updateInterestConfig('formula', e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                              <option>Standard</option>
                              <option>Amortized</option>
                              <option>Custom Script</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Earnings Payout</label>
                          <select value={newProduct.interestConfig?.payoutDestination} onChange={e => updateInterestConfig('payoutDestination', e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                              <option>Wallet</option>
                              <option>Reinvest</option>
                          </select>
                      </div>
                  </div>
              </div>

              {/* Specifics */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                  
                  {/* Interest Rate - FD, Savings, T-Bill */}
                  {(newProduct.category === 'Fixed Deposit' || newProduct.category === 'Savings Plan' || newProduct.category === 'T-Bill') && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                {newProduct.category === 'T-Bill' ? 'Discount Rate (%)' : 'Interest Rate (%)'}
                            </label>
                            <input type="number" step="0.01" value={newProduct.interestRate} onChange={e => setNewProduct({...newProduct, interestRate: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Duration / Tenure</label>
                            <input type="text" value={newProduct.duration} onChange={e => setNewProduct({...newProduct, duration: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" placeholder="e.g. 91 Days" />
                        </div>
                    </div>
                  )}

                  {/* FD Specifics */}
                  {newProduct.category === 'Fixed Deposit' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Early Withdrawal Penalty (%)</label>
                            <input type="number" step="0.1" value={newProduct.penaltyRate} onChange={e => setNewProduct({...newProduct, penaltyRate: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                <input type="checkbox" checked={newProduct.allowRollover} onChange={e => setNewProduct({...newProduct, allowRollover: e.target.checked})} className="rounded text-invest-gold focus:ring-invest-gold" />
                                Allow Auto Rollover
                            </label>
                        </div>
                      </div>
                  )}

                  {/* Mutual Fund Specifics */}
                  {newProduct.category === 'Mutual Fund' && (
                       <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Initial NAV Price</label>
                            <input type="number" step="0.0001" value={newProduct.currentNav} onChange={e => setNewProduct({...newProduct, currentNav: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                       </div>
                  )}

                  {/* Savings Specifics */}
                  {newProduct.category === 'Savings Plan' && (
                       <div className="flex gap-4">
                           <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                <input type="checkbox" checked={newProduct.isRecurring} onChange={e => setNewProduct({...newProduct, isRecurring: e.target.checked})} className="rounded text-invest-gold focus:ring-invest-gold" />
                                Recurring Deposits
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                <input type="checkbox" checked={newProduct.autoDebitSupported} onChange={e => setNewProduct({...newProduct, autoDebitSupported: e.target.checked})} className="rounded text-invest-gold focus:ring-invest-gold" />
                                MoMo Auto-Debit
                            </label>
                       </div>
                  )}

                  {/* Asset Mgmt Specifics */}
                  {newProduct.category === 'Asset Management' && (
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Management Fee (%)</label>
                                <input type="number" step="0.1" value={newProduct.managementFee} onChange={e => setNewProduct({...newProduct, managementFee: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                           </div>
                           <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Assigned Manager</label>
                                <input type="text" value={newProduct.assignedManager} onChange={e => setNewProduct({...newProduct, assignedManager: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" placeholder="Optional" />
                           </div>
                       </div>
                  )}

              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-invest-900">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-invest-900 text-white rounded-lg text-sm font-medium hover:bg-invest-800">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
