
import React, { useState } from 'react';
import { InvestmentProduct } from '../types';
import { Plus, Search, Tag, Clock, Percent, PlayCircle, AlertCircle } from 'lucide-react';

interface ProductManagementProps {
  products: InvestmentProduct[];
  onAdd: (product: InvestmentProduct) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ products, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const [newProduct, setNewProduct] = useState<Partial<InvestmentProduct>>({
    name: '',
    category: 'T-Bill',
    interestRate: 0,
    duration: '',
    minAmount: 0,
    status: 'Active'
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
        ...newProduct as InvestmentProduct,
        id: Date.now().toString()
    });
    setShowModal(false);
    setNewProduct({ name: '', category: 'T-Bill', interestRate: 0, duration: '', minAmount: 0, status: 'Active' });
  };

  const handleRunInterestEngine = () => {
      setIsSimulating(true);
      setTimeout(() => {
          setIsSimulating(false);
          alert("Daily Interest Calculation Engine ran successfully.\n\nAccrued interest has been applied to all active client portfolios based on product rates.");
      }, 2000);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">Investment Products</h2>
          <p className="text-slate-500 text-sm mt-1">Manage T-Bills, Bonds, and Mutual Fund offerings.</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={handleRunInterestEngine}
                disabled={isSimulating}
                className="bg-white border border-invest-gold text-invest-gold px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-50 flex items-center gap-2"
            >
                {isSimulating ? <span className="animate-spin">⟳</span> : <PlayCircle size={18} />}
                {isSimulating ? 'Calculating...' : 'Run Interest Engine'}
            </button>
            <button 
            onClick={() => setShowModal(true)}
            className="bg-invest-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg"
            >
            <Plus size={18} />
            Add Product
            </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full opacity-10 ${product.status === 'Active' ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-invest-900/5 rounded-lg text-invest-900">
                        <Tag size={20} />
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${product.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {product.status}
                    </span>
                </div>

                <h3 className="font-bold text-invest-900 text-lg mb-1">{product.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{product.category}</p>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 flex items-center gap-2"><Percent size={14}/> Interest Rate</span>
                        <span className="font-bold text-invest-gold">{product.interestRate}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 flex items-center gap-2"><Clock size={14}/> Duration</span>
                        <span className="font-medium text-slate-700">{product.duration}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 flex items-center gap-2"><AlertCircle size={14}/> Min. Amount</span>
                        <span className="font-medium text-slate-700">₵{product.minAmount.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg animate-fade-in-down">
            <h3 className="text-lg font-bold text-invest-900 mb-4">Add Investment Product</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Product Name</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" placeholder="e.g. 91-Day Treasury Bill" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                        <option>T-Bill</option>
                        <option>Bond</option>
                        <option>Mutual Fund</option>
                        <option>Fixed Deposit</option>
                        <option>Savings Plan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Interest Rate (%)</label>
                    <input required type="number" step="0.01" value={newProduct.interestRate} onChange={e => setNewProduct({...newProduct, interestRate: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Duration</label>
                    <input required type="text" value={newProduct.duration} onChange={e => setNewProduct({...newProduct, duration: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" placeholder="e.g. 91 Days" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Min Amount (GHS)</label>
                    <input required type="number" value={newProduct.minAmount} onChange={e => setNewProduct({...newProduct, minAmount: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                  </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select value={newProduct.status} onChange={e => setNewProduct({...newProduct, status: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
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
