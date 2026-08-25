import { Activity } from 'lucide-react';

export default function SystemStatus() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            System Status
          </h1>
          <p className="text-slate-400 text-sm">Monitoring pipeline health and connectivity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'API Gateway', status: 'Operational', ping: '12ms' },
          { name: 'PostgreSQL Database', status: 'Operational', ping: '4ms' },
          { name: 'ClickHouse Analytics', status: 'Operational', ping: '8ms' },
          { name: 'Clustering Engine', status: 'Operational', ping: '45ms' },
          { name: 'Blockstream Node', status: 'Degraded', ping: '150ms' },
          { name: 'TronGrid Node', status: 'Operational', ping: '32ms' },
        ].map((service, i) => (
          <div key={i} className="p-6 rounded-2xl bg-[#0a0f1c]/80 border border-white/10 backdrop-blur-xl flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-4">
              <span className={`relative flex h-3 w-3`}>
                {service.status === 'Operational' ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </>
                ) : (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </>
                )}
              </span>
              <span className="font-semibold text-white">{service.name}</span>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${service.status === 'Operational' ? 'text-emerald-400' : 'text-amber-400'}`}>{service.status}</p>
              <p className="text-xs text-slate-500">{service.ping}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
