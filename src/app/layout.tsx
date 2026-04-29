import type { Metadata } from "next";
import { Noto_Serif_SC } from "next/font/google";
import ClientGate from "@/components/ClientGate";
import "./globals.css";

const notoSerif = Noto_Serif_SC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "该不该买 — 消费决策引擎",
  description: "用蔡叔的认知框架，帮你解决「这个东西该不该买」的纠结",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSerif.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Nav />
        <ClientGate>
          <main className="flex-1 relative z-[1]">{children}</main>
        </ClientGate>
        <Footer />
      </body>
    </html>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-10 py-5 flex justify-between items-center bg-gradient-to-b from-background to-transparent">
      <a href="/" className="text-lg font-black tracking-[4px] text-text">
        该不该<span className="text-accent">买</span>
      </a>
      <div className="flex gap-6">
        <a href="/history" className="text-[13px] font-mono tracking-[1px] text-text-muted hover:text-text transition-colors">历史</a>
        <a href="/settings" className="text-[13px] font-mono tracking-[1px] text-text-muted hover:text-text transition-colors">设置</a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="relative z-[1] px-6 py-16 text-center border-t border-border mt-20">
      <p className="font-serif text-sm text-text-muted italic mb-4 tracking-wide">&ldquo;纠结超过一天了？那就买。&rdquo;</p>
      <p className="text-xs text-text-muted font-mono tracking-[2px]">该不该买 · 基于蔡叔认知框架</p>
    </footer>
  );
}
