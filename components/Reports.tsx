
import React from 'react';
import { FileText, Download, BarChart, PieChart, Calendar } from 'lucide-react';

const Reports: React.FC = () => {
  const reportTypes = [
      { id: 1, title: 'Daily Transaction Report', desc: 'Detailed log of deposits & withdrawals.', icon: FileText },
      { id: 2, title: 'Portfolio Performance', desc: 'AUM growth and yield analysis.', icon: BarChart },
      { id: 3, title: 'Client Acquisition', desc: 'New signups and KYC status stats.', icon: PieChart },
      { id: 4, title: 'Agent Commissions', desc: 'Monthly sales and payout report.', icon: Calendar },
  ];

  const handleDownload = (title: string) => {
      alert(`Downloading ${title}... (Mock Action)`);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
         <h2 className="text-2xl font-bold text-invest-900">Reporting & Analytics</h2>
         <p className="text-slate-500 text-sm mt-1">Generate and download system reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {reportTypes.map(report => (
              <div key={report.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer" onClick={() => handleDownload(report.title)}>
                  <div className="flex justify-between items-start">
                      <div className="p-3 bg-slate-50 rounded-lg text-invest-900 group-hover:bg-invest-900 group-hover:text-white transition-colors">
                          <report.icon size={24} />
                      </div>
                      <button className="p-2 text-slate-400 hover:text-invest-gold">
                          <Download size={20} />
                      </button>
                  </div>
                  <h3 className="font-bold text-invest-900 text-lg mt-4">{report.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{report.desc}</p>
              </div>
          ))}
      </div>

      <div className="bg-invest-900 text-white p-8 rounded-xl shadow-lg mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
              <h3 className="text-xl font-bold mb-2">Need a custom report?</h3>
              <p className="text-invest-goldlight text-sm max-w-md">Our analytics engine can generate custom insights based on specific parameters. Contact the data team.</p>
          </div>
          <button className="px-6 py-3 bg-white text-invest-900 font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-lg">
              Request Custom Report
          </button>
      </div>
    </div>
  );
};

export default Reports;
