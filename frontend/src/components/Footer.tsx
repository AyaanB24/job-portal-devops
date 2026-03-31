import { Briefcase, Twitter, Github, Linkedin, Mail, Sparkles, Globe, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative z-10 bg-slate-950/80 border-t border-white/5 pt-24 pb-12 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    <div className="container px-4 relative">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
        <div className="md:col-span-12 lg:col-span-5 space-y-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 p-px flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:rotate-12 transition-all duration-500">
              <div className="h-full w-full rounded-3xl bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="font-black text-3xl tracking-tighter text-white uppercase italic">
              NEXUS<span className="text-gradient hover:animate-pulse">CORE</span>
            </span>
          </Link>
          <p className="text-muted-foreground max-w-md text-lg font-medium leading-relaxed uppercase tracking-tight">
            The neural network for <span className="text-white">elite engineering talent</span> and hyper-growth technology ventures across the digital landscape.
          </p>
          <div className="flex gap-4">
            {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
              <a key={i} href="#" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 hover:-translate-y-1 transition-all duration-300">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-4 lg:col-span-2 space-y-8">
          <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Protocol</h4>
          <ul className="space-y-5">
            {["System Architecture", "Security Layer", "Verified Nodes", "Nexus API"].map((item) => (
              <li key={item}><a href="#" className="text-sm font-bold text-muted-foreground hover:text-blue-400 hover:translate-x-1 transition-all inline-block uppercase tracking-wider">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4 lg:col-span-2 space-y-8">
          <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Governance</h4>
          <ul className="space-y-5">
            {["Identity Policy", "Standard Nodes", "Privacy Shield", "Code of Conduct"].map((item) => (
              <li key={item}><a href="#" className="text-sm font-bold text-muted-foreground hover:text-blue-400 hover:translate-x-1 transition-all inline-block uppercase tracking-wider">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4 lg:col-span-3 space-y-8 relative">
           <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
           <div className="relative glass-card p-6 rounded-3xl border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                 <Globe className="h-5 w-5 text-teal-400 h-pulse" />
                 <span className="text-xs font-black text-white uppercase tracking-widest">Global Status</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Nodes synced across 24 global regions with 99.99% operational uptimes.</p>
              <div className="flex items-center gap-2 pt-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                 <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Master Node ACTIVE</span>
              </div>
           </div>
        </div>
      </div>
      
      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">
              © 2026 NEXUSCORE PROTOCOL
            </p>
            <span className="hidden md:block h-4 w-px bg-white/5" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500/50" />
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Security Verified</span>
            </div>
        </div>
        <div className="flex items-center gap-8">
           <a href="#" className="text-[10px] font-black text-muted-foreground hover:text-white uppercase tracking-widest transition-colors">Documentation</a>
           <a href="#" className="text-[10px] font-black text-muted-foreground hover:text-white uppercase tracking-widest transition-colors">Terminals</a>
           <a href="#" className="text-[10px] font-black text-white uppercase tracking-widest border border-white/10 px-4 py-2 rounded-xl hover:bg-white/5 transition-all">Support</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;


