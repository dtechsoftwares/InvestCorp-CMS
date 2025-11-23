
import React, { useState, useEffect, useRef } from 'react';
import { Save, Image as ImageIcon, RefreshCw, Upload, Sliders, Droplets, Database, Download, FileJson, Check, AlertCircle, X, FileType, FileSpreadsheet, FileCode, Bell, Moon, Sun, Smartphone, Mail, Globe, Key, Shield, Copy } from 'lucide-react';
import { AppData, NotificationConfig } from '../types';

interface SettingsProps {
  currentBg: string;
  currentOpacity: number;
  currentBlur: number;
  onSave: (url: string, opacity: number, blur: number) => void;
  onExportData: (sections: string[]) => void;
  onImportData: (data: AppData, sections: string[]) => void;
  // New Props
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  notificationConfig: NotificationConfig;
  onUpdateNotifications: (config: NotificationConfig) => void;
}

const SECTIONS = {
  posts: 'Market Insights',
  portfolios: 'Portfolios',
  clients: 'Client Accounts',
  kycUpdates: 'KYC Submissions',
  users: 'Team Members',
  logs: 'Activity Logs',
  settings: 'System Settings',
  branches: 'Branch Network'
};

type ExportFormat = 'JSON' | 'SQL' | 'CSV';

const Settings: React.FC<SettingsProps> = ({ 
    currentBg, currentOpacity, currentBlur, onSave, 
    onExportData, onImportData, 
    isDarkMode, toggleDarkMode, notificationConfig, onUpdateNotifications 
}) => {
  const [bgUrl, setBgUrl] = useState(currentBg);
  const [opacity, setOpacity] = useState(currentOpacity);
  const [blur, setBlur] = useState(currentBlur);
  const [localFileError, setLocalFileError] = useState('');

  // Export State
  const [exportSelection, setExportSelection] = useState<Record<string, boolean>>({
    posts: true, portfolios: true, clients: true, kycUpdates: true, users: true, logs: true, settings: true
  });
  const [exportFormat, setExportFormat] = useState<ExportFormat>('JSON');

  // Import State
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [importAnalysis, setImportAnalysis] = useState<AppData | null>(null);
  const [importSelection, setImportSelection] = useState<Record<string, boolean>>({});
  const [importError, setImportError] = useState('');
  const [detectedType, setDetectedType] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // API Keys
  const [apiKey, setApiKey] = useState('sk_live_51M...');
  const [webhookUrl, setWebhookUrl] = useState('https://api.investcorp.com/hooks/v1/payments');

  useEffect(() => {
    setBgUrl(currentBg);
    setOpacity(currentOpacity);
    setBlur(currentBlur);
  }, [currentBg, currentOpacity, currentBlur]);

  const handleSave = () => {
    onSave(bgUrl, opacity, blur);
  };

  const handleReset = () => {
    const defaultUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
    setBgUrl(defaultUrl);
    setOpacity(0.8);
    setBlur(4);
    onSave(defaultUrl, 0.8, 4);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) { 
        setLocalFileError('File is too large. Max 4MB.');
        return;
    }
    setLocalFileError('');

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result as string;
        setBgUrl(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleImportFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportedFile(file);
    setImportError('');
    setDetectedType('');

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const content = event.target?.result as string;
            // Simplified for brevity - assumes JSON
            const parsedData = JSON.parse(content);
            setImportAnalysis(parsedData);
            setDetectedType('JSON Database');
            
            const available: Record<string, boolean> = {};
            Object.keys(SECTIONS).forEach(key => {
                 available[key] = true;
            });
            setImportSelection(available);

        } catch (err: any) {
            setImportError(err.message || 'Failed to parse file.');
            setImportAnalysis(null);
        }
    };
    reader.readAsText(file);
  };

  const handleCustomExport = () => {
    const selectedKeys = Object.entries(exportSelection).filter(([_, val]) => val).map(([key]) => key);
    onExportData(selectedKeys);
  };

  const toggleNotification = (key: keyof NotificationConfig['triggers']) => {
      onUpdateNotifications({
          ...notificationConfig,
          triggers: {
              ...notificationConfig.triggers,
              [key]: !notificationConfig.triggers[key]
          }
      });
  };
  
  const generateNewKey = () => {
      setApiKey(`sk_live_${Math.random().toString(36).substring(2, 15)}...`);
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl pb-20">
      <div>
        <h2 className="text-2xl font-bold text-invest-900 dark:text-white">System Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Configure application behavior, appearance, and automation.</p>
      </div>

      {/* Theme & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Appearance */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-invest-900 dark:text-white mb-6 flex items-center gap-2">
                  <Moon size={20} /> Appearance
              </h3>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div>
                      <div className="font-medium text-invest-900 dark:text-white">Dark Mode</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Enable modern dark interface</div>
                  </div>
                  <button 
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-invest-gold' : 'bg-slate-200'}`}
                  >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
              </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-invest-900 dark:text-white mb-6 flex items-center gap-2">
                  <Bell size={20} /> Automated Alerts
              </h3>
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <Smartphone size={16} /> SMS Alerts
                      </div>
                      <input type="checkbox" checked={notificationConfig.enableSMS} onChange={() => onUpdateNotifications({...notificationConfig, enableSMS: !notificationConfig.enableSMS})} className="accent-invest-gold" />
                  </div>
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <Mail size={16} /> Email Reports
                      </div>
                      <input type="checkbox" checked={notificationConfig.enableEmail} onChange={() => onUpdateNotifications({...notificationConfig, enableEmail: !notificationConfig.enableEmail})} className="accent-invest-gold" />
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.keys(notificationConfig.triggers).map(key => (
                          <label key={key} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={(notificationConfig.triggers as any)[key]} onChange={() => toggleNotification(key as any)} className="accent-invest-gold" />
                              <span className="capitalize text-slate-600 dark:text-slate-400">{key}</span>
                          </label>
                      ))}
                  </div>
              </div>
          </div>
      </div>
      
      {/* API & Security Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-invest-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
              <Globe size={20} /> Developer API & Security
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Live API Key</label>
                      <div className="flex gap-2">
                          <input type="password" value={apiKey} readOnly className="flex-1 border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-700 dark:text-white" />
                          <button onClick={generateNewKey} className="px-3 py-2 bg-invest-900 text-white rounded-lg text-xs font-medium hover:bg-invest-800">Roll Key</button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Used for 3rd-party integrations (Mobile App, POS).</p>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Webhook URL</label>
                      <input type="text" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 text-sm font-mono bg-white dark:bg-slate-800 dark:text-white" />
                  </div>
              </div>
              <div className="space-y-4">
                   <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                       <h4 className="font-bold text-green-800 dark:text-green-400 text-sm flex items-center gap-2 mb-2">
                           <Shield size={16} /> Security Status
                       </h4>
                       <div className="space-y-2">
                           <div className="flex justify-between items-center text-sm">
                               <span className="text-slate-600 dark:text-slate-300">2-Factor Auth</span>
                               <span className="text-green-600 font-bold text-xs bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded">Enforced</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                               <span className="text-slate-600 dark:text-slate-300">End-to-End Encryption</span>
                               <span className="text-green-600 font-bold text-xs bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded">Active</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                               <span className="text-slate-600 dark:text-slate-300">Session Timeout</span>
                               <span className="text-slate-500 text-xs">15 mins</span>
                           </div>
                       </div>
                   </div>
              </div>
          </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-bold text-invest-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
          <Database size={20} /> Intelligent Data Hub
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Export Column */}
            <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-100 dark:border-slate-600 h-full">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-invest-900 dark:text-white text-sm flex items-center gap-2">
                            <Download size={16} /> Export Database
                        </h4>
                        <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 p-0.5">
                            <button 
                                onClick={() => setExportFormat('JSON')}
                                className={`px-2 py-1 text-[10px] font-bold rounded ${exportFormat === 'JSON' ? 'bg-invest-900 text-white' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400'}`}
                            >JSON</button>
                             <button 
                                onClick={() => setExportFormat('CSV')}
                                className={`px-2 py-1 text-[10px] font-bold rounded ${exportFormat === 'CSV' ? 'bg-invest-900 text-white' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400'}`}
                            >CSV</button>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleCustomExport}
                        className="w-full bg-invest-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center justify-center gap-2 transition-all shadow-md mt-4"
                    >
                        {exportFormat === 'JSON' ? <FileJson size={16} /> : <FileSpreadsheet size={16} />}
                        Download {exportFormat} Backup
                    </button>
                </div>
            </div>

            {/* Import Column */}
             <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-100 dark:border-slate-600 h-full">
                     <h4 className="font-bold text-invest-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                        <Upload size={16} /> Import Database
                    </h4>
                     <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 dark:border-slate-500 border-dashed rounded-lg cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-50 transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-2">
                            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Click to upload backup</p>
                        </div>
                        <input ref={fileInputRef} type="file" className="hidden" accept=".json,.sql,.csv" onChange={handleImportFileSelect} />
                    </label>
                </div>
             </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-bold text-invest-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
          <ImageIcon size={20} /> Login Screen Appearance
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image Source URL</label>
              <input 
                type="text" 
                value={bgUrl.startsWith('data:') ? '' : bgUrl}
                onChange={(e) => {
                    setBgUrl(e.target.value);
                    setLocalFileError('');
                }}
                className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none dark:bg-slate-700 dark:text-white"
              />
            </div>
            
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Opacity Slider */}
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
                      <span>Overlay Opacity</span>
                      <span className="text-invest-gold font-bold">{Math.round(opacity * 100)}%</span>
                   </label>
                   <input 
                        type="range" 
                        min="0" 
                        max="0.95" 
                        step="0.05" 
                        value={opacity}
                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-invest-gold"
                      />
                </div>

                {/* Blur Slider */}
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
                      <span>Image Blur</span>
                      <span className="text-invest-gold font-bold">{blur}px</span>
                   </label>
                   <input 
                        type="range" 
                        min="0" 
                        max="20" 
                        step="1" 
                        value={blur}
                        onChange={(e) => setBlur(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-invest-gold"
                      />
                </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={handleSave}
                className="bg-invest-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 transition-all shadow-lg"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
