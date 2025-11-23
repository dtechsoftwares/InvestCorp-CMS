
import React, { useState, useEffect } from 'react';
import { SupportTicket, Client, User, TicketMessage } from '../types';
import { Search, Filter, MessageSquare, CheckCircle, Clock, AlertCircle, User as UserIcon, Send, Mic, Paperclip, MoreVertical, AlertTriangle, ArrowLeft, Plus } from 'lucide-react';

interface SupportDeskProps {
  tickets: SupportTicket[];
  clients: Client[];
  users: User[];
  onTicketUpdate: (ticket: SupportTicket) => void;
  onTicketAdd?: (ticket: SupportTicket) => void;
}

// Chat Bubble Component
const ChatBubble: React.FC<{ msg: TicketMessage }> = ({ msg }) => {
    const isSupport = msg.sender === 'Support' || msg.sender === 'System';
    return (
        <div className={`flex ${isSupport ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[80%] rounded-xl p-3 ${isSupport ? 'bg-invest-900 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                {msg.sender === 'System' ? (
                    <div className="text-xs text-center italic opacity-80 flex items-center gap-1 justify-center">
                        <AlertTriangle size={12} /> {msg.text}
                    </div>
                ) : (
                    <>
                    {msg.text && <p className="text-sm">{msg.text}</p>}
                    {msg.attachmentType === 'Voice' && (
                        <div className="flex items-center gap-2 bg-white/10 p-2 rounded mt-1 min-w-[150px]">
                            <div className="w-8 h-8 rounded-full bg-white text-invest-900 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-current border-b-[5px] border-b-transparent ml-1"></div>
                            </div>
                            <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                                <div className="h-full w-1/3 bg-invest-gold"></div>
                            </div>
                            <span className="text-xs opacity-80">0:15</span>
                        </div>
                    )}
                    <div className={`text-[10px] mt-1 text-right ${isSupport ? 'text-slate-300' : 'text-slate-400'}`}>
                        {msg.timestamp.split(',')[1]}
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};

const SupportDesk: React.FC<SupportDeskProps> = ({ tickets, clients, users, onTicketUpdate, onTicketAdd }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicketData, setNewTicketData] = useState<Partial<SupportTicket>>({
      clientId: '', subject: '', category: 'Technical', priority: 'Medium'
  });

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const client = selectedTicket ? clients.find(c => c.id === selectedTicket.clientId) : null;

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown';
  const getUserName = (id?: string) => users.find(u => u.id === id)?.name || 'Unassigned';

  const filteredTickets = tickets.filter(t => 
    (statusFilter === 'All' || t.status === statusFilter) &&
    (t.subject.toLowerCase().includes(filter.toLowerCase()) ||
    getClientName(t.clientId).toLowerCase().includes(filter.toLowerCase()))
  );

  const getPriorityColor = (p: string) => {
      switch(p) {
          case 'High': return 'text-red-600 bg-red-50 border-red-100';
          case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
          default: return 'text-blue-600 bg-blue-50 border-blue-100';
      }
  };

  const getSlaStatus = (deadline?: string) => {
      if (!deadline) return { text: 'No SLA', color: 'text-slate-400' };
      const now = new Date();
      const due = new Date(deadline);
      const diffHrs = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (diffHrs < 0) return { text: `Overdue by ${Math.abs(Math.round(diffHrs))}h`, color: 'text-red-600 font-bold' };
      if (diffHrs < 4) return { text: `Due in ${Math.round(diffHrs)}h`, color: 'text-amber-600 font-bold' };
      return { text: `Due in ${Math.round(diffHrs)}h`, color: 'text-green-600' };
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedTicket || !newMessage.trim()) return;

      const msg: TicketMessage = {
          id: Date.now().toString(),
          sender: 'Support',
          text: newMessage,
          timestamp: new Date().toLocaleString()
      };

      const updatedTicket: SupportTicket = {
          ...selectedTicket,
          messages: [...selectedTicket.messages, msg],
          status: 'In Progress' // Auto update status on reply
      };

      onTicketUpdate(updatedTicket);
      setNewMessage('');
  };

  const handleVoiceNote = () => {
      if (!selectedTicket) return;
      setIsRecording(true);
      
      // Simulate recording delay
      setTimeout(() => {
          setIsRecording(false);
          const msg: TicketMessage = {
              id: Date.now().toString(),
              sender: 'Support',
              attachmentType: 'Voice',
              timestamp: new Date().toLocaleString()
          };
          onTicketUpdate({
              ...selectedTicket,
              messages: [...selectedTicket.messages, msg]
          });
      }, 2000);
  };

  const handleAssign = (userId: string) => {
      if (!selectedTicket) return;
      onTicketUpdate({ ...selectedTicket, assignedTo: userId });
  };

  const handleStatusChange = (status: any) => {
      if (!selectedTicket) return;
      onTicketUpdate({ ...selectedTicket, status });
  };

  const handleEscalate = () => {
      if (!selectedTicket) return;
      const confirm = window.confirm("Are you sure you want to escalate this ticket? This will notify senior management.");
      if (confirm) {
          onTicketUpdate({ 
              ...selectedTicket, 
              status: 'Escalated', 
              priority: 'High',
              messages: [...selectedTicket.messages, {
                  id: Date.now().toString(),
                  sender: 'System',
                  text: 'Ticket escalated to Senior Management.',
                  timestamp: new Date().toLocaleString()
              }]
          });
      }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
      e.preventDefault();
      if (!onTicketAdd) return;

      // SLA Calc: 24h for High, 48h Medium, 72h Low
      const hours = newTicketData.priority === 'High' ? 24 : newTicketData.priority === 'Medium' ? 48 : 72;
      const deadline = new Date();
      deadline.setHours(deadline.getHours() + hours);

      const newTicket: SupportTicket = {
          id: `TCK-${Date.now()}`,
          clientId: newTicketData.clientId!,
          subject: newTicketData.subject!,
          category: newTicketData.category as any,
          priority: newTicketData.priority as any,
          status: 'Open',
          dateCreated: new Date().toLocaleString(),
          slaDeadline: deadline.toISOString(),
          messages: [{
              id: `msg_${Date.now()}`,
              sender: 'System',
              text: 'Ticket created by staff.',
              timestamp: new Date().toLocaleString()
          }]
      };

      onTicketAdd(newTicket);
      setShowCreateModal(false);
      setNewTicketData({ clientId: '', subject: '', category: 'Technical', priority: 'Medium' });
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      
      {/* LEFT: Ticket List */}
      <div className={`flex-col w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${selectedTicketId ? 'hidden md:flex' : 'flex'}`}>
        {/* Header & Filter */}
        <div className="p-4 border-b border-slate-100 space-y-3">
             <div className="flex justify-between items-center">
                 <h2 className="font-bold text-invest-900">Support Queue</h2>
                 <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-invest-900 text-white text-xs px-2 py-1.5 rounded flex items-center gap-1 hover:bg-invest-800"
                 >
                     <Plus size={12} /> New Ticket
                 </button>
             </div>
             <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                    type="text" 
                    placeholder="Search tickets..." 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-invest-gold"
                 />
             </div>
             <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                 {['All', 'Open', 'In Progress', 'Escalated', 'Resolved'].map(st => (
                     <button 
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${statusFilter === st ? 'bg-invest-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                     >
                         {st}
                     </button>
                 ))}
             </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
            {filteredTickets.map(ticket => {
                const sla = getSlaStatus(ticket.slaDeadline);
                return (
                    <div 
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${selectedTicketId === ticket.id ? 'bg-blue-50/50 border-l-4 border-l-invest-gold' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                            <span className="text-xs text-slate-400">{ticket.dateCreated.split(' ')[0]}</span>
                        </div>
                        <h4 className={`font-bold text-sm mb-1 ${selectedTicketId === ticket.id ? 'text-invest-900' : 'text-slate-700'}`}>{ticket.subject}</h4>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 truncate max-w-[120px]">{getClientName(ticket.clientId)}</span>
                            <div className={`flex items-center gap-1 ${sla.color}`}>
                                <Clock size={10} /> {sla.text}
                            </div>
                        </div>
                        {ticket.status === 'Escalated' && (
                            <div className="mt-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1 justify-center">
                                <AlertTriangle size={10} /> Escalated
                            </div>
                        )}
                    </div>
                );
            })}
            {filteredTickets.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">No tickets found.</div>
            )}
        </div>
      </div>

      {/* RIGHT: Ticket Detail & Chat */}
      <div className={`flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex-col overflow-hidden ${selectedTicketId ? 'flex' : 'hidden md:flex'}`}>
        {selectedTicket ? (
            <>
                {/* Detail Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                         <button className="md:hidden p-1 text-slate-500" onClick={() => setSelectedTicketId(null)}><ArrowLeft size={20}/></button>
                         <div>
                             <h2 className="font-bold text-invest-900 text-lg flex items-center gap-2">
                                 {selectedTicket.subject}
                                 <span className={`text-xs px-2 py-0.5 rounded-full font-normal ${selectedTicket.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                     {selectedTicket.status}
                                 </span>
                             </h2>
                             <div className="text-sm text-slate-500 flex items-center gap-4 mt-1">
                                 <span className="flex items-center gap-1"><UserIcon size={14}/> {client?.name}</span>
                                 <span>•</span>
                                 <span>{client?.accountNumber}</span>
                             </div>
                         </div>
                    </div>
                    
                    {/* Actions Toolbar */}
                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 text-slate-600">
                                <UserIcon size={14} /> {getUserName(selectedTicket.assignedTo)}
                            </button>
                            {/* Dropdown Mock */}
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 shadow-lg rounded-lg hidden group-hover:block z-20">
                                {users.map(u => (
                                    <button 
                                        key={u.id} 
                                        onClick={() => handleAssign(u.id)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                                    >
                                        {u.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedTicket.status !== 'Resolved' && (
                             <button 
                                onClick={() => handleStatusChange('Resolved')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded border border-transparent hover:border-green-100" 
                                title="Mark Resolved"
                             >
                                <CheckCircle size={18} />
                            </button>
                        )}
                        
                        <div className="relative group">
                             <button className="p-2 text-slate-500 hover:bg-slate-100 rounded">
                                <MoreVertical size={18} />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 shadow-lg rounded-lg hidden group-hover:block z-20 overflow-hidden">
                                <button onClick={handleEscalate} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
                                    <AlertTriangle size={14} /> Escalate
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">
                                    View Client Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar">
                    {/* SLA Warning Banner */}
                    {getSlaStatus(selectedTicket.slaDeadline).text.includes('Overdue') && (
                        <div className="bg-red-50 border border-red-100 p-2 rounded-lg text-red-700 text-xs text-center mb-4 flex items-center justify-center gap-2">
                            <AlertCircle size={14} /> SLA Breach: This ticket is overdue. Please resolve immediately.
                        </div>
                    )}
                    
                    {selectedTicket.messages.map(msg => (
                        <ChatBubble key={msg.id} msg={msg} />
                    ))}
                    
                    {selectedTicket.messages.length === 0 && (
                        <div className="text-center text-slate-400 mt-10">
                            <MessageSquare size={40} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Start the conversation...</p>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-end gap-2">
                     <button type="button" className="p-3 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors" title="Attach File">
                        <Paperclip size={20} />
                     </button>
                     <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-2">
                        <textarea
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="Type your reply..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 resize-none max-h-32"
                            rows={1}
                        />
                     </div>
                     <button 
                        type="button" 
                        onClick={handleVoiceNote}
                        className={`p-3 rounded-lg transition-all ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:bg-slate-100'}`}
                        title="Record Voice Note"
                     >
                        <Mic size={20} />
                     </button>
                     <button 
                        type="submit" 
                        disabled={!newMessage.trim()}
                        className="p-3 bg-invest-900 text-white rounded-lg hover:bg-invest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <Send size={20} />
                     </button>
                </form>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare size={48} className="opacity-50" />
                </div>
                <p className="font-medium">Select a ticket to view details</p>
            </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-down">
                <h3 className="text-lg font-bold text-invest-900 mb-4">Log New Ticket</h3>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Client</label>
                        <select required value={newTicketData.clientId} onChange={e => setNewTicketData({...newTicketData, clientId: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                            <option value="">Select Client...</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.accountNumber})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Subject</label>
                        <input required type="text" value={newTicketData.subject} onChange={e => setNewTicketData({...newTicketData, subject: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" placeholder="e.g. Withdrawal issue" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                            <select value={newTicketData.category} onChange={e => setNewTicketData({...newTicketData, category: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                                <option>Technical</option>
                                <option>Account</option>
                                <option>Investment</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Priority</label>
                            <select value={newTicketData.priority} onChange={e => setNewTicketData({...newTicketData, priority: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-invest-900">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-invest-900 text-white rounded-lg text-sm font-medium hover:bg-invest-800">Create Ticket</button>
                    </div>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};

export default SupportDesk;
