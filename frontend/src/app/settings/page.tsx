'use client';
import { useState } from 'react';
import { Settings, Shield, Key, Bell, Database, User, ChevronRight, Lock, Copy, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile & Access');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(true);
  const [contrastToggle, setContrastToggle] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { icon: User, label: 'Profile & Access' },
    { icon: Key, label: 'API Integrations' },
    { icon: Shield, label: 'Security' },
    { icon: Database, label: 'Data Retention' },
    { icon: Bell, label: 'Notifications' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-[#f5e6d3] rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2a1d24] to-[#1c1218] border border-[#f5e6d3]/30 flex items-center justify-center shadow-lg">
            <Settings className="w-7 h-7 text-[#f5e6d3] group-hover:rotate-90 transition-transform duration-700" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#fffbf5] to-[#e6d5c3] drop-shadow-sm">
            System Preferences
          </h1>
          <p className="text-[#c3b1a8] text-sm mt-1">Configure your I4C dashboard parameters and integrations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-2">
          {tabs.map((item, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
                activeTab === item.label 
                  ? 'bg-gradient-to-r from-[#f5e6d3]/20 to-[#f5e6d3]/5 border-[#f5e6d3]/40 text-[#f5e6d3] shadow-[0_0_20px_rgba(245,230,211,0.1)]' 
                  : 'bg-transparent border-transparent text-[#9e8f88] hover:bg-white/5 hover:text-[#d4c3b8]'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${activeTab === item.label ? 'text-[#f5e6d3]' : ''}`} />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-all duration-300 ${activeTab === item.label ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3">
          
          {/* Profile & Access Tab */}
          {activeTab === 'Profile & Access' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1a1215]/90 to-[#0d070a]/90 border border-[#f5e6d3]/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#f5e6d3]/5 rounded-full filter blur-[60px] pointer-events-none transition-all group-hover:bg-[#f5e6d3]/10"></div>
                
                <h2 className="text-xl font-bold text-[#fffbf5] mb-6 border-b border-[#f5e6d3]/10 pb-4">Profile & Access Control</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#b5a39a] uppercase tracking-wider">Investigator ID</label>
                      <input disabled type="text" value="INV-8492" className="w-full bg-[#0a0507]/80 border border-[#f5e6d3]/5 rounded-xl px-4 py-3 text-sm text-[#b5a39a] cursor-not-allowed shadow-inner" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#b5a39a] uppercase tracking-wider">Clearance Level</label>
                      <div className="flex items-center px-4 py-3 bg-pink-900/20 border border-pink-500/20 rounded-xl shadow-inner">
                        <Lock className="w-4 h-4 text-pink-300 mr-2" />
                        <span className="text-sm font-bold text-pink-200">Level 4 (Admin)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#b5a39a] uppercase tracking-wider">Full Name</label>
                    <input type="text" defaultValue="Rajesh Kumar" className="w-full bg-[#120a0d]/80 border border-[#f5e6d3]/20 hover:border-[#f5e6d3]/40 rounded-xl px-4 py-3 text-sm text-[#fffbf5] focus:ring-2 focus:ring-[#f5e6d3]/40 outline-none transition-all shadow-inner" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#b5a39a] uppercase tracking-wider">Department Email</label>
                    <input type="email" defaultValue="r.kumar@i4c.gov.in" className="w-full bg-[#120a0d]/80 border border-[#f5e6d3]/20 hover:border-[#f5e6d3]/40 rounded-xl px-4 py-3 text-sm text-[#fffbf5] focus:ring-2 focus:ring-[#f5e6d3]/40 outline-none transition-all shadow-inner" />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#f5e6d3]/10 flex justify-end">
                  <button className="px-8 py-3 rounded-xl font-bold text-[#3a261c] bg-gradient-to-r from-[#f5e6d3] to-[#e8cbb1] hover:from-[#fffbf5] hover:to-[#f5e6d3] shadow-[0_0_20px_rgba(245,230,211,0.2)] hover:shadow-[0_0_30px_rgba(245,230,211,0.4)] transition-all hover:-translate-y-0.5">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Preferences Sub-section */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1a1215]/90 to-[#0d070a]/90 border border-[#f5e6d3]/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                <h2 className="text-xl font-bold text-[#fffbf5] mb-6 border-b border-[#f5e6d3]/10 pb-4">System Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-[#f5e6d3]/20 transition-colors">
                    <div>
                      <h3 className="font-semibold text-[#e6d5c3]">Real-time Auto Refresh</h3>
                      <p className="text-xs text-[#a6958c] mt-1">Automatically poll for new transactions every 30 seconds.</p>
                    </div>
                    <div onClick={() => setRefreshToggle(!refreshToggle)} className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${refreshToggle ? 'bg-[#f5e6d3]/30 border border-[#f5e6d3]/50 shadow-[0_0_15px_rgba(245,230,211,0.2)]' : 'bg-black/50 border border-white/10'}`}>
                      <div className={`w-4 h-4 rounded-full absolute top-1 transition-transform ${refreshToggle ? 'bg-[#f5e6d3] translate-x-6' : 'bg-slate-500 translate-x-1'}`}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-[#f5e6d3]/20 transition-colors">
                    <div>
                      <h3 className="font-semibold text-[#e6d5c3]">High Contrast Graph</h3>
                      <p className="text-xs text-[#a6958c] mt-1">Increase edge visibility in the Cluster Analysis view.</p>
                    </div>
                    <div onClick={() => setContrastToggle(!contrastToggle)} className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${contrastToggle ? 'bg-[#f5e6d3]/30 border border-[#f5e6d3]/50 shadow-[0_0_15px_rgba(245,230,211,0.2)]' : 'bg-black/50 border border-white/10'}`}>
                      <div className={`w-4 h-4 rounded-full absolute top-1 transition-transform ${contrastToggle ? 'bg-[#f5e6d3] translate-x-6' : 'bg-slate-500 translate-x-1'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Integrations Tab */}
          {activeTab === 'API Integrations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1a1215]/90 to-[#0d070a]/90 border border-[#f5e6d3]/10 backdrop-blur-xl shadow-2xl">
                <h2 className="text-xl font-bold text-[#fffbf5] mb-6 border-b border-[#f5e6d3]/10 pb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#f5e6d3]" />
                  External Data Providers
                </h2>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-bold text-[#b5a39a] uppercase tracking-wider">Blockstream API Key (Bitcoin)</label>
                      <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-500/20">Connected</span>
                    </div>
                    <div className="relative">
                      <input 
                        type={showKey ? 'text' : 'password'} 
                        defaultValue="blks_live_9f82hd912h8f92hf92hf29h" 
                        className="w-full bg-[#120a0d]/80 border border-[#f5e6d3]/20 hover:border-[#f5e6d3]/40 rounded-xl pl-4 pr-24 py-3 text-sm text-[#fffbf5] font-mono outline-none" 
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button onClick={() => setShowKey(!showKey)} className="p-1.5 text-[#9e8f88] hover:text-[#f5e6d3] transition-colors rounded-lg hover:bg-white/5">
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={handleCopy} className="p-1.5 text-[#9e8f88] hover:text-[#f5e6d3] transition-colors rounded-lg hover:bg-white/5">
                          {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-bold text-[#b5a39a] uppercase tracking-wider">TronGrid API Key (Tron)</label>
                      <span className="text-xs text-rose-400 bg-rose-900/30 px-2 py-0.5 rounded border border-rose-500/20">Disconnected</span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Enter API key..." 
                      className="w-full bg-[#120a0d]/80 border border-[#f5e6d3]/20 hover:border-[#f5e6d3]/40 rounded-xl px-4 py-3 text-sm text-[#fffbf5] font-mono outline-none focus:ring-2 focus:ring-[#f5e6d3]/40" 
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#f5e6d3]/10 flex justify-end">
                  <button className="px-6 py-2.5 rounded-xl font-semibold text-[#3a261c] bg-[#f5e6d3] hover:bg-[#fffbf5] shadow-[0_0_15px_rgba(245,230,211,0.2)] transition-all">
                    Test Connections
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dummy content for other tabs */}
          {['Security', 'Data Retention', 'Notifications'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-gradient-to-b from-[#1a1215]/50 to-[#0d070a]/50 border border-[#f5e6d3]/5 backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-500 text-center">
               <Shield className="w-16 h-16 text-[#f5e6d3]/20 mb-4 animate-[pulse_4s_ease-in-out_infinite]" />
               <h3 className="text-lg font-bold text-[#e6d5c3] mb-2">{activeTab} Module Locked</h3>
               <p className="text-[#a6958c] text-sm max-w-sm">
                 This section is locked by central administration. To modify {activeTab.toLowerCase()} policies, contact your division supervisor.
               </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
