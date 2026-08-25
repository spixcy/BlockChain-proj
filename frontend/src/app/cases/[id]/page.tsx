'use client';
import dynamic from 'next/dynamic';
import { Download, AlertTriangle, ExternalLink, Network } from 'lucide-react';
import { useState } from 'react';

// Dynamically import the graph viewer since it uses window object
const GraphViewer = dynamic(() => import('@/components/GraphViewer'), { ssr: false, loading: () => <div className="w-full h-96 flex items-center justify-center bg-slate-950 rounded-lg border border-slate-800"><div className="animate-pulse text-slate-500">Loading visualization engine...</div></div> });

export default function CaseDetail({ params }: { params: { id: string } }) {
  const [reportGenerating, setReportGenerating] = useState(false);

  const handleExport = () => {
    setReportGenerating(true);
    setTimeout(() => {
      window.print();
      setReportGenerating(false);
    }, 1000);
  };

  // Mock data for UI
  const mockData = {
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    chain: "bitcoin",
    nearest_vasp: { name: "Satoshi (Mixer proxy demo)", category: "mixer", confidence: 0.95 },
    risk_tier: "High",
    reasoning: "0 hops to a known mixer (Satoshi (Mixer proxy demo)). High risk of illicit fund obfuscation. (Base confidence: 0.95, Adjusted: 0.95)",
    clusterSize: 3,
    hopsTraced: 2,
    graphData: {
      nodes: [
        { id: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", group: 1, label: "Reported Target" },
        { id: "1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s", group: 2, label: "Binance" },
        { id: "unknown1", group: 3, label: "Intermediary" },
      ],
      links: [
        { source: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", target: "unknown1", value: 1.5 },
        { source: "unknown1", target: "1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s", value: 1.5 },
      ]
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 print:text-black print:bg-white">
      {/* Header section */}
      <div className="flex justify-between items-start print:hidden">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            Case: {params.id === '1' ? 'NCRP-2026-001' : `CASE-${params.id}`}
            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" /> High Risk
            </span>
          </h1>
          <p className="text-slate-400 mt-1 font-mono text-sm">{mockData.address}</p>
        </div>
        <button onClick={handleExport} disabled={reportGenerating} className="flex items-center bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Download className="w-4 h-4 mr-2" />
          {reportGenerating ? 'Preparing PDF...' : 'Generate Report'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Attribution Card */}
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center"><Network className="w-5 h-5 mr-2 text-blue-400"/> Automated Attribution</h2>
          <div className="bg-slate-950 rounded-lg p-5 border border-slate-800">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Nearest VASP</p>
                <p className="text-lg font-semibold text-rose-400">{mockData.nearest_vasp.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Entity Category</p>
                <p className="text-sm font-medium text-slate-300 capitalize">{mockData.nearest_vasp.category}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Confidence Score</p>
                <p className="text-sm font-medium text-emerald-400">{(mockData.nearest_vasp.confidence * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Hops Traced</p>
                <p className="text-sm font-medium text-slate-300">{mockData.hopsTraced} hops downstream</p>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-4 mt-2">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Explainable Reasoning</p>
              <p className="text-sm text-slate-300 leading-relaxed">{mockData.reasoning}</p>
            </div>
          </div>
        </div>

        {/* Metadata Card */}
        <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Cluster Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase mb-1">Co-controlled Addresses</p>
              <p className="text-2xl font-light">{mockData.clusterSize}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase mb-1">Network</p>
              <p className="text-sm capitalize inline-flex items-center bg-slate-800 px-2 py-1 rounded text-slate-300">{mockData.chain}</p>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center transition-colors">
                View Raw Txs in Block Explorer <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm print:break-before-page">
        <h2 className="text-lg font-semibold mb-4 flex items-center">Fund Flow Visualization</h2>
        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
          <GraphViewer graphData={mockData.graphData} />
        </div>
        <p className="text-xs text-slate-500 mt-3 text-center print:hidden">Interactive layout: Scroll to zoom, drag nodes to reposition.</p>
      </div>
    </div>
  );
}
