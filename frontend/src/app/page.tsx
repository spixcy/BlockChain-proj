import Link from 'next/link';
import { AlertTriangle, Plus, Search, Activity, ChevronRight, Filter } from 'lucide-react';

export default function Dashboard() {
  // Mock data for UI demonstration
  const mockCases = [
    { id: '1', complaintId: 'NCRP-2026-001', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', chain: 'Bitcoin', status: 'ANALYZED', risk: 'Critical', date: '2026-08-24', amount: '$45,200' },
    { id: '2', complaintId: 'NCRP-2026-002', address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', chain: 'Tron', status: 'PROCESSING', risk: 'High', date: '2026-08-24', amount: '$12,550' },
    { id: '3', complaintId: 'NCRP-2026-003', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', chain: 'Ethereum', status: 'COMPLETED', risk: 'Low', date: '2026-08-23', amount: '$850' },
    { id: '4', complaintId: 'NCRP-2026-004', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', chain: 'Bitcoin', status: 'ANALYZED', risk: 'Medium', date: '2026-08-22', amount: '$4,100' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-pink-400 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">Live Intel Feed</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm">
            Active Investigations
          </h1>
          <p className="text-slate-400 text-sm font-medium">Monitoring and analyzing cross-chain illicit activities.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-pink-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search address or ID..." 
              className="bg-[#0a0f1c]/50 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all backdrop-blur-md w-64 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
            />
          </div>
          <Link href="/cases/new" className="group relative inline-flex items-center justify-center px-5 py-2.5 font-semibold text-white transition-all duration-200 bg-gradient-to-b from-rose-500 to-rose-600 rounded-xl hover:from-rose-400 hover:to-rose-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] overflow-hidden">
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-500 ease-in-out skew-x-12"></div>
            <Plus className="w-4 h-4 mr-2" />
            <span>Intake Complaint</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Flagged Volume', value: '$2.4M', trend: '+14%', color: 'from-purple-500 to-indigo-600' },
          { label: 'Active Clusters', value: '142', trend: '+5', color: 'from-pink-400 to-rose-500' },
          { label: 'High Risk Addresses', value: '89', trend: '-2', color: 'from-rose-500 to-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-lg overflow-hidden group hover:border-white/10 transition-colors">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full mix-blend-screen filter blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
            <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <span className={`text-xs font-semibold mb-1 ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.trend} this week
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="relative rounded-2xl bg-[#0a0f1c]/80 border border-white/10 backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
        
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-pink-400" />
            Recent Reports
          </h2>
          <button className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/[0.02] border-b border-white/5 text-slate-400 text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Case ID</th>
                <th className="px-6 py-4">Target Address</th>
                <th className="px-6 py-4">Chain</th>
                <th className="px-6 py-4">Involved Vol.</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Risk Tier</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockCases.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-pink-100/90 font-medium">{c.complaintId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-pink-400 transition-colors"></div>
                      <span className="font-mono text-slate-300">{c.address.substring(0,8)}...{c.address.substring(c.address.length-6)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {c.chain === 'Bitcoin' && <div className="w-4 h-4 rounded-full bg-[#F7931A]"></div>}
                      {c.chain === 'Ethereum' && <div className="w-4 h-4 rounded-full bg-[#627EEA]"></div>}
                      {c.chain === 'Tron' && <div className="w-4 h-4 rounded-full bg-[#FF060A]"></div>}
                      <span className="text-slate-200 font-medium">{c.chain}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{c.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm
                      ${c.status === 'ANALYZED' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 
                        c.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 
                        'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${c.status === 'ANALYZED' ? 'bg-pink-400' : c.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {c.risk === 'Critical' || c.risk === 'High' ? (
                       <span className={`flex items-center font-semibold ${c.risk === 'Critical' ? 'text-rose-400' : 'text-orange-400'}`}>
                         <AlertTriangle className="w-4 h-4 mr-1.5"/> {c.risk}
                       </span>
                    ) : (
                      <span className="flex items-center font-medium text-emerald-400">
                        <span className="w-4 h-4 mr-1.5 flex items-center justify-center">✓</span> {c.risk}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/cases/${c.id}`} className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-all border border-transparent hover:border-pink-500/20 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
