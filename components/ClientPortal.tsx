import React, { useState, useEffect, useRef } from 'react';
import { Client, Portfolio, Asset, Transaction, ClientDocument, TicketMessage } from '../types';
import { LayoutDashboard, FileText, PieChart, MessageSquare, Download, Calendar, TrendingUp, DollarSign, Clock, Shield, Search, ArrowRight, User, Sparkles, Bot } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ClientPortalProps {
    clients: Client[];
    portfolios: Portfolio[]; // To link portfolio info
    transactions: Transaction[];
    documents: ClientDocument[];
}

const ClientPortal: React.FC<ClientPortalProps> = ({ clients, portfolios, transactions, documents }) => {
    // Simulate Client Login by picking the first client or allowing selection
    const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
    const [activeTab, setActiveTab] = useState<'Dashboard' | 'Investments' | 'History' | 'Documents' | 'Support'>('Dashboard');
    
    // AI Chat State
    const [chatMessages, setChatMessages] = useState<TicketMessage[]>([
        { id: '1', sender: 'AI', text: 'Hello! I am your InvestCorp AI Concierge. How can I assist you with your portfolio today?', timestamp: 'Now' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const activeClient = clients.find(c => c.id === selectedClientId);
    
    // Mock Assets for the active client
    const clientAssets: Asset[] = activeClient ? [
        { id: '1', portfolioId: activeClient.portfolioId, productId: 'prod1', productName: '91-Day T-Bill', type: 'T-Bill', investedAmount: 5000, currentValue: 5200, rate: 28.5, startDate: '2024-09-01', maturityDate: '2024-12-01', status: 'Active' },
        { id: '2', portfolioId: activeClient.portfolioId, productId: 'prod2', productName: 'Balanced Fund', type: 'Mutual Fund', investedAmount: 2000, currentValue: 2150, rate: 18.2, startDate: '2024-05-15', status: 'Active' }
    ] : [];

    const clientTransactions = transactions.filter(t => t.clientId === selectedClientId);
    const clientDocuments = documents.filter(d => d.clientId === selectedClientId);
    
    // Calculations
    const totalInvested = clientAssets.reduce((sum, a) => sum + a.investedAmount, 0);
    const totalValue = clientAssets.reduce((sum, a) => sum + a.currentValue, 0);
    const totalInterest = totalValue - totalInvested;

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    // Mock Chart Data
    const performanceData = [
        { name: 'Jan', value: 5000 },
        { name: 'Mar', value: 5200 },
        { name: 'May', value: 6000 },
        { name: 'Jul', value: 6800 },
        { name: 'Sep', value: 7200 },
        { name: 'Now', value: totalValue }
    ];

    const handleChatSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg: TicketMessage = {
            id: Date.now().toString(),
            sender: 'Client',
            text: chatInput,
            timestamp: new Date().toLocaleTimeString()
        };
        setChatMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            let aiText = "I can help with that. Could you clarify?";
            const input = userMsg.text?.toLowerCase() || '';
            
            if (input.includes('balance') || input.includes('money') || input.includes('worth')) {
                aiText = `Your total portfolio value is currently ${new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(totalValue)}. You are up ${((totalInterest/totalInvested)*100).toFixed(1)}%.`;
            } else if (input.includes('withdraw')) {
                aiText = "To process a withdrawal, please visit the 'Investments' tab and click 'Request Withdrawal'. Transfers typically take 24 hours.";
            } else if (input.includes('invest') || input.includes('deposit')) {
                aiText = "Great! You can top up via Mobile Money instantly. Would you like me to generate a payment invoice?";
            } else if (input.includes('hello') || input.includes('hi')) {
                aiText = `Welcome back, ${activeClient?.name.split(' ')[0]}. Is there a specific transaction I can look up for you?`;
            }

            const aiMsg: TicketMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'AI',
                text: aiText,
                timestamp: new Date().toLocaleTimeString()
            };
            setChatMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    if (!activeClient) return <div className="p-10 text-center">No Clients Available for Demo</div>;

    return (
        <div className="bg-slate-50 min-h-screen pb-20 font-sans">
            {/* Simulation Header */}
            <div className="bg-invest-900 text-white p-4 sticky top-0 z-30 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-white/10 rounded-lg"><User size={20} /></div>
                         <div>
                             <div className="text-xs opacity-60 uppercase tracking-wider">Viewing as Client</div>
                             <select 
                                value={selectedClientId} 
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                className="bg-transparent font-bold border-none outline-none cursor-pointer text-invest-gold"
                             >
                                 {clients.map(c => <option key={c.id} value={c.id} className="text-invest-900">{c.name}</option>)}
                             </select>
                         </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                        {['Dashboard', 'Investments', 'History', 'Documents', 'Support'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-3 py-1 rounded transition-colors ${activeTab === tab ? 'bg-invest-gold text-invest-900 font-bold' : 'hover:bg-white/10 opacity-80'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 animate-fade-in">
                
                {/* Dashboard View */}
                {activeTab === 'Dashboard' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Main Balance Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-invest-gold/10 rounded-full -mr-10 -mt-10"></div>
                                <h3 className="text-slate-500 font-medium text-sm mb-2">Total Portfolio Value</h3>
                                <div className="text-4xl font-bold text-invest-900 mb-2">
                                    {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(totalValue)}
                                </div>
                                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                    <TrendingUp size={16} /> +{((totalInterest/totalInvested)*100).toFixed(2)}% Return
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <h3 className="text-slate-500 font-medium text-sm mb-2">Total Interest Earned</h3>
                                <div className="text-3xl font-bold text-invest-gold mb-2">
                                    {new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(totalInterest)}
                                </div>
                                <div className="text-slate-400 text-xs">Accrued across all assets</div>
                            </div>

                            <div className="bg-invest-900 rounded-2xl p-6 shadow-sm border border-slate-100 text-white">
                                <h3 className="opacity-80 font-medium text-sm mb-2">Active Investments</h3>
                                <div className="text-3xl font-bold mb-2">{clientAssets.length}</div>
                                <div className="text-xs opacity-60">Next maturity: {clientAssets[0]?.maturityDate || 'N/A'}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                             <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                 <h3 className="font-bold text-invest-900 mb-6">Portfolio Growth</h3>
                                 <div className="h-64">
                                     <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={performanceData}>
                                            <defs>
                                                <linearGradient id="colorClient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                            <Tooltip formatter={(value: number) => `₵${value.toLocaleString()}`} />
                                            <Area type="monotone" dataKey="value" stroke="#d97706" strokeWidth={3} fill="url(#colorClient)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                 </div>
                             </div>

                             <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                 <h3 className="font-bold text-invest-900 mb-4">Quick Actions</h3>
                                 <div className="space-y-3">
                                     <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-invest-gold hover:bg-amber-50 transition-all group">
                                         <span className="text-sm font-medium text-slate-700">Top-up Investment</span>
                                         <DollarSign size={18} className="text-slate-400 group-hover:text-invest-gold" />
                                     </button>
                                     <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-invest-gold hover:bg-amber-50 transition-all group">
                                         <span className="text-sm font-medium text-slate-700">Request Withdrawal</span>
                                         <Download size={18} className="text-slate-400 group-hover:text-invest-gold" />
                                     </button>
                                     <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-invest-gold hover:bg-amber-50 transition-all group">
                                         <span className="text-sm font-medium text-slate-700">Contact Agent</span>
                                         <MessageSquare size={18} className="text-slate-400 group-hover:text-invest-gold" />
                                     </button>
                                 </div>
                             </div>
                        </div>
                    </div>
                )}

                {/* Investments List */}
                {activeTab === 'Investments' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-invest-900">Your Active Holdings</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Start Date</th>
                                        <th className="px-6 py-4">Maturity</th>
                                        <th className="px-6 py-4 text-right">Invested</th>
                                        <th className="px-6 py-4 text-right">Current Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {clientAssets.map(asset => (
                                        <tr key={asset.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-invest-900">{asset.productName}</div>
                                                <div className="text-xs text-slate-500">{asset.type} • {asset.rate}% Rate</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{asset.startDate}</td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {asset.maturityDate ? (
                                                    <span className="flex items-center gap-1"><Clock size={12}/> {asset.maturityDate}</span>
                                                ) : 'Open-Ended'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium">₵{asset.investedAmount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-bold text-invest-gold">₵{asset.currentValue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Documents */}
                {activeTab === 'Documents' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-invest-900 mb-4 flex items-center gap-2"><FileText size={20}/> Statements</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded shadow-sm text-red-500"><FileText size={20} /></div>
                                        <div>
                                            <div className="font-medium text-sm text-invest-900">Portfolio Statement - Oct 2024</div>
                                            <div className="text-xs text-slate-500">Generated on Nov 1, 2024</div>
                                        </div>
                                    </div>
                                    <button className="text-invest-900 hover:text-invest-gold"><Download size={20}/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* AI Concierge Support Chat */}
                {activeTab === 'Support' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-[600px] flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-invest-gold/5 rounded-full -mr-20 -mt-20"></div>
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl z-10">
                            <div className="flex items-center gap-2">
                                <div className="bg-invest-gold text-white p-1.5 rounded-lg"><Bot size={20} /></div>
                                <div>
                                    <h3 className="font-bold text-invest-900">InvestCorp AI Concierge</h3>
                                    <span className="text-xs text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 z-10">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'Client' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm ${
                                        msg.sender === 'Client' 
                                        ? 'bg-invest-900 text-white rounded-br-none' 
                                        : 'bg-white border border-slate-100 rounded-bl-none'
                                    }`}>
                                        {msg.sender === 'AI' && <div className="text-[10px] uppercase font-bold text-invest-gold mb-1 flex items-center gap-1"><Sparkles size={10}/> AI Assistant</div>}
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></span>
                                            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <form onSubmit={handleChatSend} className="p-4 border-t border-slate-100 flex gap-2 z-10 bg-white">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask about your balance, withdrawals, or rates..." 
                                className="flex-1 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold" 
                            />
                            <button type="submit" className="bg-invest-gold text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20">
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </div>
                )}

                {/* History View */}
                {activeTab === 'History' && (
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Transaction Ref</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {clientTransactions.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-slate-600">{t.date.split(',')[0]}</td>
                                            <td className="px-6 py-4 font-mono text-xs">{t.reference}</td>
                                            <td className="px-6 py-4">{t.type}</td>
                                            <td className={`px-6 py-4 text-right font-medium ${t.type === 'Withdrawal' ? 'text-red-600' : 'text-green-600'}`}>
                                                {t.type === 'Withdrawal' ? '-' : '+'}₵{t.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">{t.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                     </div>
                )}

            </div>
        </div>
    );
};

export default ClientPortal;