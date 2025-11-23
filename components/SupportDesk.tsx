
import React, { useState } from 'react';
import { SupportTicket, Client } from '../types';
import { Search, Filter, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface SupportDeskProps {
  tickets: SupportTicket[];
  clients: Client[];
  onUpdateStatus: (id: string, status: 'Resolved') => void;
}

const SupportDesk: React.FC<SupportDeskProps> = ({ tickets, clients, onUpdateStatus }) => {
  const [filter, setFilter] = useState('');

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Unknown';

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(filter.toLowerCase()) ||
    getClientName(t.clientId).toLowerCase().includes(filter.toLowerCase())
  );

  const getPriorityColor = (p: string) => {
      switch(p) {
          case 'High': return 'text-red-600 bg-red-50 border-red-100';
          case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
          default: return 'text-blue-600 bg-blue-50 border-blue-100';
      }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">Complaints & Support</h2>
          <p className="text-slate-500 text-sm mt-1">Manage client inquiries and technical issues.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
          />
        </div>
        <button className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
             <Filter size={16} /> Status
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map(ticket => (
              <div key={ticket.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${ticket.status === 'Open' ? 'bg-red-100 text-red-600' : ticket.status === 'In Progress' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                          <MessageSquare size={20} />
                      </div>
                      <div>
                          <h4 className="font-bold text-invest-900 text-lg">{ticket.subject}</h4>
                          <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                              <span>{getClientName(ticket.clientId)}</span>
                              <span>•</span>
                              <span>{ticket.dateCreated}</span>
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority} Priority
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {ticket.status !== 'Resolved' ? (
                            <button 
                                onClick={() => onUpdateStatus(ticket.id, 'Resolved')}
                                className="px-3 py-1.5 bg-invest-900 text-white text-xs rounded hover:bg-invest-800 transition-colors flex items-center gap-1"
                            >
                                <CheckCircle size={12} /> Mark Resolved
                            </button>
                        ) : (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1"><CheckCircle size={14}/> Resolved</span>
                        )}
                      </div>
                  </div>
              </div>
          ))}
          {filteredTickets.length === 0 && (
            <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-100">
                No support tickets found.
            </div>
          )}
      </div>
    </div>
  );
};

export default SupportDesk;
