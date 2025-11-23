
import React, { useState } from 'react';
import { LogEntry } from '../types';
import { Search, Filter, AlertTriangle, Info, CheckCircle, ShieldAlert, Download, Activity } from 'lucide-react';

interface ActivityLogsProps {
  logs: LogEntry[];
}

const ActivityLogs: React.FC<ActivityLogsProps> = ({ logs }) => {
  const [filter, setFilter] = useState('');

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.user.toLowerCase().includes(filter.toLowerCase()) ||
    log.target.toLowerCase().includes(filter.toLowerCase())
  );

  const errorCount = logs.filter(l => l.type === 'error').length;
  const warningCount = logs.filter(l => l.type === 'warning').length;

  const handleExport = () => {
      const headers = ['Timestamp,User,Action,Target,Type'];
      const csv = logs.map(l => `${l.timestamp},${l.user},${l.action},${l.target},${l.type}`).join('\n');
      const blob = new Blob([headers + '\n' + csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_trail_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  const getIcon = (type: 'info' | 'warning' | 'error') => {
    switch(type) {
      case 'error': return <AlertTriangle size={16} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">Compliance & Audit Trail</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor system integrity, user actions, and risk events.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleExport}
                className="px-3 py-2 bg-invest-900 text-white rounded-lg text-sm shadow-lg hover:bg-invest-800 flex items-center gap-2"
            >
                <Download size={16} /> Export Audit Log
            </button>
        </div>
      </div>

      {/* Compliance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-green-500">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
                  <h3 className="font-bold text-invest-900">System Status</h3>
              </div>
              <div className="text-sm text-slate-500">Operational & Secure</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-amber-500">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><ShieldAlert size={20} /></div>
                  <h3 className="font-bold text-invest-900">Risk Events</h3>
              </div>
              <div className="text-2xl font-bold text-invest-900">{warningCount + errorCount}</div>
              <div className="text-xs text-slate-400">Flagged in last 30 days</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Activity size={20} /></div>
                  <h3 className="font-bold text-invest-900">Total Activities</h3>
              </div>
              <div className="text-2xl font-bold text-invest-900">{logs.length}</div>
              <div className="text-xs text-slate-400">Recorded actions</div>
          </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search audit logs by user, action or target..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">Timestamp</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">Target</th>
              <th className="px-6 py-4 font-medium">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className={`hover:bg-slate-50/50 transition-colors ${log.type === 'error' ? 'bg-red-50/30' : ''}`}>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                  {log.timestamp}
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-invest-900">{log.user}</span>
                </td>
                <td className="px-6 py-4">
                  {log.action}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {log.target}
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        {getIcon(log.type)}
                        <span className={`capitalize ${log.type === 'error' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>{log.type}</span>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-400">
                No logs found matching your search.
            </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
