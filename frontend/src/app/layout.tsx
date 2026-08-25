import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

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
      <body className={`font-sans flex h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#181114] via-[#0d070a] to-black text-[#fffbf5] selection:bg-[#f5e6d3]/30 selection:text-[#f5e6d3]`}>
        {/* Creamy and soft rose background glows */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-[#f5e6d3]/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-rose-400/5 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#d4c3b8]/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>
        
        <div className="relative z-10 flex h-screen w-full">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8 backdrop-blur-sm">{children}</main>
        </div>
      </body>
    </html>
  );
}
