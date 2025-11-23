
import React, { useState } from 'react';
import { GhanaCardSubmission } from '../types';
import { Search, Filter, Eye, CheckCircle, XCircle, FileText, Download } from 'lucide-react';

interface KycUpdatesProps {
  submissions: GhanaCardSubmission[];
}

const KycUpdates: React.FC<KycUpdatesProps> = ({ submissions }) => {
  const [filter, setFilter] = useState('');

  const filteredSubmissions = submissions.filter(sub => 
    sub.accountNumber.includes(filter) ||
    sub.ghanaCardNumber.toLowerCase().includes(filter.toLowerCase()) ||
    sub.lastName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">KYC Updates</h2>
          <p className="text-slate-500 text-sm mt-1">Review Ghana Card submissions from clients.</p>
        </div>
        <div className="flex gap-2">
             <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 shadow-sm">
                <Filter size={16} /> Filter Status
            </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by account number, name or card ID..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                <th className="px-6 py-4 font-medium">Submission Date</th>
                <th className="px-6 py-4 font-medium">Account Number</th>
                <th className="px-6 py-4 font-medium">Client Name</th>
                <th className="px-6 py-4 font-medium">Ghana Card No.</th>
                <th className="px-6 py-4 font-medium">Attachments</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {sub.submittedAt}
                    </td>
                    <td className="px-6 py-4 font-medium text-invest-900">
                    {sub.accountNumber}
                    </td>
                    <td className="px-6 py-4">
                    {sub.firstName} {sub.lastName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                    {sub.ghanaCardNumber}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-500 flex items-center gap-1"><FileText size={12}/> {sub.frontImageName}</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1"><FileText size={12}/> {sub.backImageName}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${sub.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                            {sub.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                            <button title="Download Files" className="p-1.5 text-slate-400 hover:text-invest-900 rounded hover:bg-slate-100">
                                <Download size={16} />
                            </button>
                            <button title="Review" className="p-1.5 text-slate-400 hover:text-invest-900 rounded hover:bg-slate-100">
                                <Eye size={16} />
                            </button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        {filteredSubmissions.length === 0 && (
            <div className="p-12 text-center text-slate-400">
                <p>No submissions found matching your search.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default KycUpdates;