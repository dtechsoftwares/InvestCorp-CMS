

import React, { useState } from 'react';
import { InterestRun, InvestmentProduct } from '../types';
import { Calculator, Play, History, Calendar, CheckCircle, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

interface InterestEngineProps {
    runs: InterestRun[];
    onRun: (type: 'Daily Accrual' | 'Monthly Posting') => void;
    products: InvestmentProduct[];
}

const InterestEngine: React.FC<InterestEngineProps> = ({ runs, onRun, products }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState<'Dashboard' | 'History' | 'Calculator'>('Dashboard');
    
    // Calculator State
    const [calcAmount, setCalcAmount] = useState<number>(10000);
    const [calcRate, setCalcRate] = useState<number>(20);
    const [calcDays, setCalcDays] = useState<number>(30);
    const [calcResult, setCalcResult] = useState<number | null>(null);

    const handleRun = (type: 'Daily Accrual' | 'Monthly Posting') => {
        setIsRunning(true);
        setTimeout(() => {
            onRun(type);
            setIsRunning(false);
        }, 3000); // Simulate processing time
    };

    const calculateInterest = () => {
        // Simple Interest: P * R * T / 365
        const interest = (calcAmount * (calcRate / 100) * calcDays) / 365;
        setCalcResult(interest);
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-invest-900 flex items-center gap-2">
                        <Calculator className="text-invest-gold" /> Interest Computation Engine
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Automated accruals, postings, and interest simulations.</p>
                </div>
                <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                    <button 
                        onClick={() => setActiveTab('Dashboard')}
                        className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'Dashboard' ? 'bg-invest-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                    >Dashboard</button>
                    <button 
                         onClick={() => setActiveTab('History')}
                        className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'History' ? 'bg-invest-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                    >Run Logs</button>
                    <button 
                         onClick={() => setActiveTab('Calculator')}
                        className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'Calculator' ? 'bg-invest-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                    >Calculator</button>
                </div>
            </div>

            {activeTab === 'Dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Status Card */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-invest-900 to-invest-700 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <TrendingUp size={100} />
                        </div>
                        <h3 className="text-lg font-medium opacity-80 mb-2">System Status</h3>
                        <div className="text-4xl font-bold mb-6 flex items-center gap-3">
                             <CheckCircle className="text-green-400" size={32} /> Operational
                        </div>
                        <div className="flex gap-8 text-sm">
                            <div>
                                <div className="opacity-60 mb-1">Last Run</div>
                                <div className="font-mono">{runs[0]?.runDate || 'Never'}</div>
                            </div>
                            <div>
                                <div className="opacity-60 mb-1">Next Scheduled</div>
                                <div className="font-mono">{new Date().toLocaleDateString()} 23:59</div>
                            </div>
                            <div>
                                <div className="opacity-60 mb-1">Active Products</div>
                                <div className="font-mono">{products.length}</div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button 
                                onClick={() => handleRun('Daily Accrual')}
                                disabled={isRunning}
                                className="bg-white text-invest-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 flex items-center gap-2 transition-all disabled:opacity-70"
                            >
                                {isRunning ? <span className="animate-spin">⟳</span> : <Play size={18} />}
                                Run Daily Accrual
                            </button>
                            <button 
                                onClick={() => handleRun('Monthly Posting')}
                                disabled={isRunning}
                                className="bg-invest-gold text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-600 flex items-center gap-2 transition-all disabled:opacity-70"
                            >
                                {isRunning ? <span className="animate-spin">⟳</span> : <Calendar size={18} />}
                                Post Monthly Interest
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-6">
                         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                             <h4 className="text-sm font-bold text-slate-500 uppercase">Total Interest Posted (YTD)</h4>
                             <div className="text-3xl font-bold text-invest-900 mt-2">₵ 1,240,500.00</div>
                             <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                 <TrendingUp size={12} /> +12% vs last month
                             </div>
                         </div>
                         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                             <h4 className="text-sm font-bold text-slate-500 uppercase">Accrued (Unposted)</h4>
                             <div className="text-3xl font-bold text-slate-700 mt-2">₵ 45,200.00</div>
                             <div className="text-xs text-slate-400 mt-1">
                                 Pending month-end posting
                             </div>
                         </div>
                    </div>
                </div>
            )}

            {activeTab === 'History' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-medium">Run ID</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Products Processed</th>
                                <th className="px-6 py-4 font-medium text-right">Interest Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Initiated By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {runs.map(run => (
                                <tr key={run.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{run.id}</td>
                                    <td className="px-6 py-4">{run.runDate}</td>
                                    <td className="px-6 py-4 font-medium text-invest-900">{run.type}</td>
                                    <td className="px-6 py-4">{run.productsProcessed}</td>
                                    <td className="px-6 py-4 text-right font-mono text-invest-900">
                                        {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(run.totalInterestPosted)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${run.status === 'Success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {run.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">{run.initiatedBy}</td>
                                </tr>
                            ))}
                            {runs.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center p-8 text-slate-400">No runs recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'Calculator' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                         <h3 className="font-bold text-invest-900 mb-6">Interest Simulator</h3>
                         <div className="space-y-4">
                             <div>
                                 <label className="block text-xs font-medium text-slate-500 mb-1">Principal Amount (GHS)</label>
                                 <input type="number" value={calcAmount} onChange={e => setCalcAmount(parseFloat(e.target.value))} className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-invest-gold outline-none font-bold text-lg" />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                     <label className="block text-xs font-medium text-slate-500 mb-1">Annual Rate (%)</label>
                                     <input type="number" value={calcRate} onChange={e => setCalcRate(parseFloat(e.target.value))} className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-invest-gold outline-none" />
                                 </div>
                                 <div>
                                     <label className="block text-xs font-medium text-slate-500 mb-1">Duration (Days)</label>
                                     <input type="number" value={calcDays} onChange={e => setCalcDays(parseFloat(e.target.value))} className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-invest-gold outline-none" />
                                 </div>
                             </div>
                             <div>
                                 <label className="block text-xs font-medium text-slate-500 mb-1">Formula</label>
                                 <select className="w-full border border-slate-200 rounded-lg p-3 text-sm bg-slate-50" disabled>
                                     <option>Simple Interest (Standard)</option>
                                     <option>Compound Daily</option>
                                 </select>
                             </div>

                             <button onClick={calculateInterest} className="w-full bg-invest-900 text-white py-3 rounded-lg font-bold hover:bg-invest-800 transition-colors mt-4">
                                 Calculate Projection
                             </button>
                         </div>
                     </div>

                     <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 flex flex-col justify-center items-center text-center">
                         {calcResult !== null ? (
                             <>
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Projected Interest</h4>
                                <div className="text-4xl font-bold text-invest-gold mb-2">
                                    {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(calcResult)}
                                </div>
                                <div className="text-2xl font-bold text-invest-900 opacity-50">
                                    Total: {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(calcAmount + calcResult)}
                                </div>
                                <div className="mt-8 p-4 bg-white rounded-lg text-xs text-left text-slate-500 w-full border border-slate-200">
                                    <strong>Formula Used:</strong><br/>
                                    (Principal × Rate × Days) / 365<br/>
                                    ({calcAmount} × {calcRate/100} × {calcDays}) / 365
                                </div>
                             </>
                         ) : (
                             <div className="text-slate-400">
                                 <Calculator size={48} className="mx-auto mb-4 opacity-50" />
                                 <p>Enter values to simulate interest earnings.</p>
                             </div>
                         )}
                     </div>
                </div>
            )}
        </div>
    );
};

export default InterestEngine;
