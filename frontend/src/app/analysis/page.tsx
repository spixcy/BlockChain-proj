'use client';
import { Network, Search, Filter, AlertTriangle, Play, Pause, Maximize2, Download, ArrowRightLeft, Activity } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useRef } from 'react';

// ForceGraph2D needs to be imported dynamically with ssr disabled
const GraphViewer = dynamic(() => import('@/components/GraphViewer'), { ssr: false });

export default function AnalysisPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const graphRef = useRef<any>(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      graphRef.current?.pauseAnimation();
    } else {
      graphRef.current?.resumeAnimation();
    }
    setIsPlaying(!isPlaying);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => graphRef.current?.zoomToFit(), 100);
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      alert("Graph successfully exported as CSV bundle to your local downloads folder.");
      setExporting(false);
    }, 1500);
  };

  // Mock blockchain clustering data
  const mockGraphData = {
    nodes: [
      { id: '1', label: '1A1zP1eP5... (Suspect Target)', group: 1 },
      { id: '2', label: 'bc1qxy2kg... (Intermediary Node)', group: 3 },
      { id: '3', label: '3J98t1WpE... (Intermediary Node)', group: 3 },
      { id: '4', label: 'Binance Hot Wallet (VASP)', group: 2 },
      { id: '5', label: 'Kraken Deposit (VASP)', group: 2 },
      { id: '6', label: '1F1tAaz5x... (Darknet)', group: 1 },
      { id: '7', label: 'Tornado Cash Proxy A', group: 3 },
      { id: '8', label: 'Tornado Cash Proxy B', group: 3 },
    ],
    links: [
      { source: '1', target: '2', value: 10 },
      { source: '1', target: '3', value: 5 },
      { source: '2', target: '4', value: 10 },
      { source: '3', target: '7', value: 2 },
      { source: '3', target: '8', value: 3 },
      { source: '7', target: '5', value: 2 },
      { source: '8', target: '5', value: 3 },
      { source: '6', target: '1', value: 15 },
    ]
  };

  const recentTx = [
    { hash: 'e3b0c44298f...', amount: '4.2 BTC', time: '2 mins ago', risk: 'High' },
    { hash: '8f2a932b109...', amount: '1.1 BTC', time: '14 mins ago', risk: 'Medium' },
    { hash: 'c1d9f82a93b...', amount: '12.0 BTC', time: '1 hr ago', risk: 'Critical' },
  ];

  return (
    <div className={`mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ${isFullscreen ? 'max-w-full fixed inset-0 z-50 bg-[#0d070a] p-8 overflow-y-auto' : 'max-w-7xl'}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#f5e6d3] animate-pulse shadow-[0_0_10px_rgba(245,230,211,0.8)]"></span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4c3b8]">Live Tracing Engine</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#fffbf5] to-[#d4c3b8] drop-shadow-sm">
            Cluster Analysis
          </h1>
          <p className="text-[#a6958c] text-sm font-medium">Visualizing flow of funds and identifying exchange off-ramps.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 text-[#a6958c] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#f5e6d3] transition-colors duration-300" />
            <input 
              type="text" 
              placeholder="Search nodes or TXIDs..." 
              className="bg-[#181114]/50 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#8a7a72] focus:outline-none focus:ring-2 focus:ring-[#f5e6d3]/50 focus:border-transparent transition-all backdrop-blur-md w-72 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:bg-[#1c1218]/60"
            />
          </div>
          <button className="flex items-center justify-center p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[#a6958c] hover:text-[#f5e6d3] hover:border-[#f5e6d3]/30 hover:bg-[#f5e6d3]/10 transition-all duration-300 shadow-lg group">
            <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Analysis Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar - Stats & Intel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c1218]/80 to-[#100a0d]/80 border border-[#f5e6d3]/5 backdrop-blur-xl shadow-xl group hover:border-[#f5e6d3]/20 transition-all duration-500 animate-in slide-in-from-left-8 duration-700 delay-100 fill-mode-both relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5e6d3]/10 rounded-full filter blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <h3 className="text-xs font-bold text-[#f5e6d3] uppercase tracking-widest mb-4">Cluster Profile</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#a6958c]">Total Volume (USD)</p>
                <p className="text-2xl font-bold text-[#fffbf5]">$1,482,900</p>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#f5e6d3] to-[#e8cbb1] h-1.5 rounded-full w-[85%]"></div>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#a6958c]">Illicit Exposure</span>
                <span className="text-[#f5e6d3]">85%</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-b from-rose-950/30 to-[#100a0d]/80 border border-rose-500/10 backdrop-blur-xl shadow-xl hover:shadow-[0_0_30px_rgba(225,29,72,0.15)] transition-all duration-500 animate-in slide-in-from-left-8 duration-700 delay-200 fill-mode-both">
            <h3 className="text-xs font-bold text-rose-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> High Risk Entities
            </h3>
            <ul className="space-y-3">
              {[
                { name: '1A1zP1eP5...', type: 'Suspect Wallet' },
                { name: '1F1tAaz5x...', type: 'Darknet Market' }
              ].map((entity, i) => (
                <li key={i} className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors cursor-pointer">
                  <span className="text-sm font-bold text-[#fffbf5] font-mono">{entity.name}</span>
                  <span className="text-xs text-rose-300/70">{entity.type}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c1218]/80 to-[#100a0d]/80 border border-[#f5e6d3]/5 backdrop-blur-xl shadow-xl transition-all duration-500 animate-in slide-in-from-left-8 duration-700 delay-300 fill-mode-both">
             <h3 className="text-xs font-bold text-[#f5e6d3] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Real-Time Flow
            </h3>
            <ul className="space-y-4">
              {recentTx.map((tx, i) => (
                <li key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${tx.risk === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-[#f5e6d3]/10 text-[#f5e6d3]'}`}>
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-[#fffbf5] group-hover:text-[#f5e6d3] transition-colors">{tx.hash}</p>
                      <p className="text-[10px] text-[#a6958c]">{tx.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#d4c3b8]">{tx.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center/Right - Graph Area */}
        <div className="lg:col-span-3">
          <div className={`${isFullscreen ? 'h-[80vh]' : 'h-[750px]'} rounded-3xl bg-gradient-to-br from-[#100a0d]/90 to-[#050204]/90 border border-[#f5e6d3]/10 backdrop-blur-2xl overflow-hidden relative shadow-[0_15px_50px_rgba(0,0,0,0.5)] group hover:border-[#f5e6d3]/20 transition-all duration-700`}>
            {/* Top glass reflection */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none z-10"></div>
            
            {/* Toolbar */}
            <div className="absolute top-6 left-6 z-20 flex gap-3">
              <button 
                onClick={handlePlayPause}
                className="p-3 rounded-xl bg-[#1c1218]/80 hover:bg-[#f5e6d3]/20 border border-[#f5e6d3]/10 hover:border-[#f5e6d3]/50 text-[#fffbf5] backdrop-blur-md transition-all shadow-lg"
                title={isPlaying ? "Pause Simulation" : "Resume Simulation"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleFullscreen}
                className="p-3 rounded-xl bg-[#1c1218]/80 hover:bg-white/10 border border-[#f5e6d3]/10 text-[#fffbf5] backdrop-blur-md transition-all shadow-lg"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="absolute top-6 right-6 z-20">
               <button 
                 onClick={handleExport}
                 disabled={exporting}
                 className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#f5e6d3]/10 hover:bg-[#f5e6d3]/20 border border-[#f5e6d3]/30 text-[#fffbf5] font-semibold text-sm backdrop-blur-md transition-all shadow-lg hover:shadow-[0_0_20px_rgba(245,230,211,0.2)] disabled:opacity-50"
               >
                 {exporting ? (
                   <span className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-[#f5e6d3]/20 border-t-[#f5e6d3] rounded-full animate-spin"></div>
                     Exporting...
                   </span>
                 ) : (
                   <><Download className="w-4 h-4" /> Export Graph</>
                 )}
               </button>
            </div>

            {/* Graph Legend */}
            <div className="absolute bottom-6 left-6 z-20 flex gap-5 p-4 rounded-2xl bg-[#0a0507]/80 border border-[#f5e6d3]/10 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                <span className="text-xs text-[#d4c3b8] font-medium uppercase tracking-wider">Suspect</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#e8cbb1] shadow-[0_0_10px_rgba(232,203,177,0.5)]"></div>
                <span className="text-xs text-[#d4c3b8] font-medium uppercase tracking-wider">Intermediary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                <span className="text-xs text-[#d4c3b8] font-medium uppercase tracking-wider">Exchange (VASP)</span>
              </div>
            </div>

            {/* The Graph */}
            <div className="w-full h-full opacity-90">
               <GraphViewer ref={graphRef} graphData={mockGraphData} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
