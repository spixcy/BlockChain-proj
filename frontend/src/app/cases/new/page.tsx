'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileSearch, ShieldAlert, Cpu } from 'lucide-react';

export default function NewComplaint() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 1500);
  }

  return (
    <div className="max-w-3xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          <FileSearch className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-100 drop-shadow-sm">
            Complaint Intake
          </h1>
          <p className="text-pink-400/80 text-sm font-medium tracking-wide">INITIALIZE AUTOMATED TRACKING PIPELINE</p>
        </div>
      </div>

      <div className="relative bg-[#0a0f1c]/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.4)] overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full filter blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-600/10 rounded-full filter blur-[80px] pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-pink-400" />
              Incident Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 uppercase tracking-wider text-[11px]">NCRP Complaint ID</label>
                <input required type="text" placeholder="NCRP-2026-0000" className="w-full bg-[#060a14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 outline-none transition-all shadow-inner shadow-black/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 uppercase tracking-wider text-[11px]">Fraud Type</label>
                <select required className="w-full bg-[#060a14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 outline-none transition-all shadow-inner shadow-black/50 appearance-none">
                  <option value="investment_scam">Investment Scam</option>
                  <option value="task_fraud">Task-Based Fraud</option>
                  <option value="sextortion">Sextortion</option>
                  <option value="ransomware">Ransomware</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-pink-400" />
              Target Vector
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 uppercase tracking-wider text-[11px]">Suspect Wallet Address</label>
                <input required type="text" placeholder="e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" className="w-full bg-[#060a14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 outline-none transition-all font-mono tracking-widest shadow-inner shadow-black/50" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 uppercase tracking-wider text-[11px]">Blockchain Network</label>
                <div className="relative">
                  <select required className="w-full bg-[#060a14]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 outline-none transition-all shadow-inner shadow-black/50 appearance-none">
                    <option value="bitcoin">Bitcoin (BTC)</option>
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="tron">Tron (TRC20)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-4 border-t border-white/10 mt-8 pt-8">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
              Abort
            </button>
            <button type="submit" disabled={loading} className="group relative px-8 py-3 rounded-xl text-sm font-bold text-white transition-all bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] disabled:opacity-50 overflow-hidden">
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-500 ease-in-out skew-x-12"></div>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Deploying Sensors...
                </span>
              ) : 'Launch Analysis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
