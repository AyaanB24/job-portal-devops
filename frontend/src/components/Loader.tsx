import { motion } from "framer-motion";

const Loader = () => (
  <div className="flex flex-col items-center justify-center py-32 space-y-8">
    <div className="relative h-24 w-24">
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-[2rem] border-[4px] border-blue-500/10" 
      />
      <motion.div 
        animate={{ rotate: -360, scale: [1, 1.2, 1] }} 
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 rounded-[1.5rem] border-[4px] border-teal-500/20 border-t-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.3)]" 
      />
      <motion.div 
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute inset-8 rounded-full bg-blue-500/40 blur-xl"
      />
    </div>
    <motion.p 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="text-xs font-black uppercase tracking-[0.4em] text-blue-400/60"
    >
      Synchronizing Nexus
    </motion.p>
  </div>
);

export const SkeletonCard = () => (
  <div className="rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 space-y-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
    <div className="flex justify-between items-start">
      <div className="flex gap-5 items-center flex-1">
        <div className="h-14 w-14 rounded-2xl bg-slate-800/60" />
        <div className="space-y-3 flex-1">
          <div className="h-6 w-3/4 bg-slate-800/60 rounded-xl" />
          <div className="h-4 w-1/4 bg-slate-800/60 rounded-xl" />
        </div>
      </div>
      <div className="h-8 w-24 bg-slate-800/60 rounded-xl" />
    </div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-slate-800/60 rounded-xl" />
      <div className="h-4 w-2/3 bg-slate-800/60 rounded-xl" />
    </div>
    <div className="flex gap-4 items-center">
      <div className="h-4 w-28 bg-slate-800/60 rounded-xl" />
      <div className="h-4 w-28 bg-slate-800/60 rounded-xl" />
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-20 bg-slate-800/60 rounded-xl" />
      <div className="h-6 w-20 bg-slate-800/60 rounded-xl" />
    </div>
    <div className="grid grid-cols-2 gap-4 pt-4">
      <div className="h-14 bg-slate-800/60 rounded-2xl" />
      <div className="h-14 bg-slate-800/60 rounded-2xl" />
    </div>
  </div>
);

export default Loader;


