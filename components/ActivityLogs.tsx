import React, { useState } from 'react';
import { LogEntry } from '../types';
import { Search, Filter, AlertTriangle, Info, CheckCircle } from 'lucide-react';

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
          <h2 className="text-2xl font-bold text-invest-900">System Activity</h2>
          <p className="text-slate-500 text-sm mt-1">Audit trail of all system events and user actions.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 shadow-sm">
                <Filter size={16} /> Filter
            </button>
            <button className="px-3 py-2 bg-invest-900 text-white rounded-lg text-sm shadow-lg hover:bg-invest-800">
                Export CSV
            </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search logs by user, action or target..." 
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
              <th className="px-6 py-4 font-medium">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
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
                        <span className="capitalize text-slate-600">{log.type}</span>
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
