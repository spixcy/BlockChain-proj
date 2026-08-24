import os

base_dir = "frontend/src"
os.makedirs(f"{base_dir}/app/cases/new", exist_ok=True)
os.makedirs(f"{base_dir}/app/cases/[id]", exist_ok=True)
os.makedirs(f"{base_dir}/components", exist_ok=True)

files = {
    "app/globals.css": """@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0f172a; /* slate-900 */
  --foreground: #f8fafc; /* slate-50 */
}

body {
  background-color: var(--background);
  color: var(--foreground);
}

/* Custom scrollbar for a professional look */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #1e293b;
}
::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
""",
    "app/layout.tsx": """import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIH26183 - Intelligence Dashboard",
  description: "Real-Time Cryptocurrency Fraud Attribution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={${inter.className} flex h-screen overflow-hidden bg-slate-900 text-slate-50}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </body>
    </html>
  );
}
""",
    "components/Sidebar.tsx": """'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, FilePlus, LayoutDashboard, Settings, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'New Complaint', href: '/cases/new', icon: FilePlus },
    { name: 'System Status', href: '#', icon: Activity },
    { name: 'Settings', href: '#', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <ShieldAlert className="w-6 h-6 text-blue-500 mr-2" />
        <span className="font-bold text-lg tracking-tight">I4C / SIH26183</span>
      </div>
      <div className="flex-1 py-6 px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              )}
            >
              <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-blue-400" : "text-slate-500")} />
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        Investigator: <span className="text-slate-300 font-semibold">INV-8492</span><br/>
        Role: ADMIN
      </div>
    </div>
  );
}
""",
    "app/page.tsx": """import Link from 'next/link';
import { FileText, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  // In a real app, fetch from Spring Boot API (/api/cases)
  // Hardcoded for UI scaffold demonstration
  const mockCases = [
    { id: '1', complaintId: 'NCRP-2026-001', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', chain: 'Bitcoin', status: 'ANALYZED', risk: 'High', date: '2026-08-24' },
    { id: '2', complaintId: 'NCRP-2026-002', address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', chain: 'Tron', status: 'PROCESSING', risk: 'Pending', date: '2026-08-24' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Active Investigations</h1>
        <Link href="/cases/new" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
          + Intake Complaint
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Case ID</th>
              <th className="px-6 py-4 font-semibold">Reported Address</th>
              <th className="px-6 py-4 font-semibold">Chain</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Risk Tier</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {mockCases.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-300">{c.complaintId}</td>
                <td className="px-6 py-4 font-mono text-slate-400">{c.address.substring(0,6)}...{c.address.substring(c.address.length-4)}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300">{c.chain}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium }>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {c.risk === 'High' ? (
                     <span className="flex items-center text-rose-400"><AlertTriangle className="w-4 h-4 mr-1.5"/> High</span>
                  ) : <span className="text-slate-500">{c.risk}</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={/cases/} className="text-blue-400 hover:text-blue-300 font-medium">View &rarr;</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
""",
    "app/cases/new/page.tsx": """'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl shadow-black/20">
        <h1 className="text-2xl font-bold mb-2">Complaint Intake Form</h1>
        <p className="text-slate-400 text-sm mb-8">Enter the victim-reported cryptocurrency details below to initialize the automated tracking and clustering pipeline.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">NCRP Complaint ID</label>
              <input required type="text" placeholder="NCRP-2026-..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Fraud Type</label>
              <select required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200">
                <option value="investment_scam">Investment Scam</option>
                <option value="task_fraud">Task-Based Fraud</option>
                <option value="sextortion">Sextortion</option>
                <option value="ransomware">Ransomware</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Suspect Wallet Address</label>
            <input required type="text" placeholder="1A1zP..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-mono" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Blockchain Network</label>
            <select required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200">
              <option value="bitcoin">Bitcoin (BTC)</option>
              <option value="tron">Tron (TRC20)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-50">
              {loading ? 'Initializing Pipeline...' : 'Submit & Analyze'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
""",
    "app/cases/[id]/page.tsx": """'use client';
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
            Case: {params.id === '1' ? 'NCRP-2026-001' : CASE-}
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
""",
    "components/GraphViewer.tsx": """'use client';
import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function GraphViewer({ graphData }: { graphData: any }) {
  const fgRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: 400
      });
    }
    
    // Auto zoom to fit after load
    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(400, 50);
      }
    }, 500);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[400px]">
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel="label"
        nodeColor={(node: any) => {
          if (node.group === 1) return '#ef4444'; // Red for target
          if (node.group === 2) return '#3b82f6'; // Blue for VASP
          return '#94a3b8'; // Slate for intermediaries
        }}
        linkColor={() => 'rgba(148, 163, 184, 0.4)'}
        nodeRelSize={6}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.2}
      />
    </div>
  );
}
"""
}

for filepath, content in files.items():
    with open(f"{base_dir}/{filepath}", "w") as f:
        f.write(content)

print("Next.js frontend components generated successfully.")
