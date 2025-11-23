
import React, { useState } from 'react';
import { SystemDocument } from '../types';
import { FileText, Upload, Search, Filter, FolderOpen, PenTool, Download, Trash2, CheckCircle, Clock } from 'lucide-react';

interface DocumentsManagerProps {
    documents: SystemDocument[];
    onUpload: (doc: SystemDocument) => void;
    onSign: (id: string) => void;
    onDelete: (id: string) => void;
}

const DocumentsManager: React.FC<DocumentsManagerProps> = ({ documents, onUpload, onSign, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const filteredDocs = documents.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setTimeout(() => {
                const newDoc: SystemDocument = {
                    id: `doc_${Date.now()}`,
                    name: file.name,
                    category: 'Contract', // Default for now
                    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                    uploadDate: new Date().toLocaleDateString(),
                    requiresSignature: true, // Default true for simulation
                    isSigned: false
                };
                onUpload(newDoc);
                setIsUploading(false);
            }, 1500);
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
             <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-invest-900 dark:text-white">Document Center</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage system files, contracts, and e-signatures.</p>
                </div>
                <div className="flex gap-2">
                    <label className={`bg-invest-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg cursor-pointer ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
                        {isUploading ? <span className="animate-spin">⟳</span> : <Upload size={18} />}
                        {isUploading ? 'Uploading...' : 'Upload Document'}
                        <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4 items-center">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search documents..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
                    />
                </div>
                <button className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                    <Filter size={16} /> Filter
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4 font-medium">Document Name</th>
                            <th className="px-6 py-4 font-medium">Category</th>
                            <th className="px-6 py-4 font-medium">Size</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Signature Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredDocs.map(doc => (
                            <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded">
                                            <FileText size={18} />
                                        </div>
                                        <span className="font-medium text-invest-900 dark:text-white">{doc.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs">
                                        {doc.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{doc.size}</td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{doc.uploadDate}</td>
                                <td className="px-6 py-4">
                                    {doc.requiresSignature ? (
                                        doc.isSigned ? (
                                            <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                                <CheckCircle size={14} /> Signed
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-amber-600 text-xs font-medium">
                                                <Clock size={14} /> Pending Sig
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-slate-400 text-xs">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {doc.requiresSignature && !doc.isSigned && (
                                            <button 
                                                onClick={() => onSign(doc.id)} 
                                                className="p-1.5 text-invest-gold hover:bg-amber-50 rounded" 
                                                title="E-Sign Document"
                                            >
                                                <PenTool size={16} />
                                            </button>
                                        )}
                                        <button className="p-1.5 text-slate-400 hover:text-invest-900 hover:bg-slate-100 rounded">
                                            <Download size={16} />
                                        </button>
                                        <button onClick={() => onDelete(doc.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {filteredDocs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center p-8 text-slate-400">
                                    <FolderOpen size={48} className="mx-auto mb-2 opacity-50" />
                                    No documents found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentsManager;
