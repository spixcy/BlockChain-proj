'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, FilePlus, LayoutDashboard, Settings, ShieldAlert, Cpu, Network } from 'lucide-react';
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
    { name: 'Cluster Analysis', href: '/analysis', icon: Network },
    { name: 'System Status', href: '/status', icon: Activity },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="w-80 bg-[#0d070a]/80 backdrop-blur-xl border-r border-white/5 flex flex-col relative overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#f5e6d3]/40 to-transparent"></div>
      
      <div className="h-24 flex items-center px-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#f5e6d3] to-[#d4c3b8] shadow-lg shadow-[#f5e6d3]/10 mr-4">
          <ShieldAlert className="w-6 h-6 text-[#2a1d24]" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#fffbf5] to-[#d4c3b8]">I4C System</h1>
          <p className="text-xs uppercase tracking-widest text-[#d4c3b8] font-semibold mt-0.5">SIH26183</p>
        </div>
      </div>
      
      <div className="flex-1 py-8 px-6 space-y-4">
        <p className="text-sm font-semibold text-[#a6958c] mb-6 px-2 tracking-wider uppercase">Menu</p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'group flex items-center px-5 py-4 rounded-xl text-base font-medium transition-all duration-300 relative',
                isActive
                  ? 'text-[#fffbf5] bg-white/5 shadow-inner shadow-white/5 border border-[#f5e6d3]/10'
                  : 'text-[#a6958c] hover:text-[#f5e6d3] hover:bg-white/[0.02]'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#f5e6d3] rounded-r-full shadow-[0_0_15px_rgba(245,230,211,0.6)]"></div>
              )}
              <Icon className={cn("w-6 h-6 mr-4 transition-colors duration-300", isActive ? "text-[#f5e6d3]" : "text-[#8a7a72] group-hover:text-[#d4c3b8]")} />
              {link.name}
            </Link>
          );
        })}
      </div>
      
      <div className="p-6 m-4 mt-auto rounded-2xl bg-gradient-to-br from-[#1c1218]/80 to-[#100a0d]/80 border border-[#f5e6d3]/10 backdrop-blur-md">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f5e6d3] to-[#e8cbb1] flex items-center justify-center shadow-lg mr-3">
            <Cpu className="w-4 h-4 text-[#3a261c]" />
          </div>
          <div>
            <p className="text-xs text-[#a6958c] font-medium">Investigator</p>
            <p className="text-sm text-[#fffbf5] font-bold">INV-8492</p>
          </div>
        </div>
        <div className="w-full bg-black/50 rounded-full h-1.5 mb-1 overflow-hidden">
          <div className="bg-gradient-to-r from-[#f5e6d3] to-[#e8cbb1] h-1.5 rounded-full w-3/4 shadow-[0_0_10px_rgba(245,230,211,0.4)]"></div>
        </div>
        <p className="text-[10px] text-right text-[#8a7a72] font-medium">Clearance: Level 4</p>
      </div>
    </div>
  );
}
