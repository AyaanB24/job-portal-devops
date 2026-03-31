import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { User } from "@/types/User";
import { Job } from "@/types/Job";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, Building2, Ban, Trash2, ShieldCheck, Activity, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([apiService.getAllUsers(), apiService.getAllJobs()]).then(([u, j]) => {
      setUsers(u);
      setJobs(j);
      setLoading(false);
    });
  }, []);

  const handleBlockUser = async (id: string) => {
    await apiService.blockUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast({ title: "User blocked" });
  };

  const handleRemoveJob = async (id: string) => {
    await apiService.deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast({ title: "Job removed" });
  };

  if (loading) return <Loader />;

  const companies = users.filter((u) => u.role === "company");

  return (
    <div className="container py-12 space-y-12">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <ShieldCheck className="h-3.5 w-3.5" /> Platform Governance
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">System <span className="text-gradient">Administrator</span></h1>
        <p className="text-xl text-muted-foreground max-w-2xl">Overview of platform health, activity, and administrative controls.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: "Total Active Users", value: users.length, icon: Users, color: "blue" },
          { label: "Live Listings", value: jobs.length, icon: Briefcase, color: "teal" },
          { label: "Verified Companies", value: companies.length, icon: Building2, color: "purple" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group glass-card p-8 rounded-[2rem] border-white/5 bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-500 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-bl-[6rem] -mr-16 -mt-16 group-hover:bg-${stat.color}-500/10 transition-colors`} />
            <div className="relative flex items-center gap-6">
              <div className={`h-16 w-16 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center shadow-inner`}>
                <stat.icon className={`h-8 w-8 text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-3xl font-black text-white leading-none">{stat.value}</p>
                <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest mt-2">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Users section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-12 space-y-6"
        >
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Users className="h-6 w-6 text-blue-400" />
               <h2 className="text-2xl font-black text-white uppercase tracking-tight">Identity Management</h2>
             </div>
             <div className="flex gap-2">
                <Button variant="outline" className="h-10 rounded-xl border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white">
                    <Filter className="h-3.5 w-3.5 mr-2" /> Filter
                </Button>
             </div>
          </div>
          
          <div className="glass-card rounded-[2.5rem] border-white/5 bg-slate-900/40 overflow-hidden shadow-2xl">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="py-6 px-8 text-xs font-black uppercase text-muted-foreground tracking-[0.2em]">Profile</TableHead>
                  <TableHead className="py-6 px-8 text-xs font-black uppercase text-muted-foreground tracking-[0.2em]">Platform Role</TableHead>
                  <TableHead className="py-6 px-8 text-xs font-black uppercase text-muted-foreground tracking-[0.2em] text-right">Security Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="hover:bg-white/5 border-white/5 transition-colors">
                    <TableCell className="py-6 px-8">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-sm uppercase">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-white uppercase text-sm tracking-tight">{u.name}</div>
                            <div className="text-xs text-muted-foreground font-medium">{u.email}</div>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="py-6 px-8">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                         u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                         u.role === 'company' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 
                         'bg-blue-500/10 text-blue-400 border-blue-500/20'
                       }`}>
                         {u.role}
                       </span>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-right">
                      {u.role !== "admin" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-muted-foreground">
                                <Ban className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-3xl border-white/10 bg-slate-900/95 backdrop-blur-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-black text-white">Restrict Account?</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                All listing and application data for <span className="text-white font-bold">{u.name} ({u.email})</span> will be permanently locked or removed from the platform.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="pt-6">
                              <AlertDialogCancel className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10">Abort</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleBlockUser(u.id)} className="rounded-xl bg-red-500 hover:bg-red-600 font-bold">Revoke Access</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Jobs section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-12 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-teal-400" />
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Listing Quality Control</h2>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="h-10 rounded-xl border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white">
                    <Activity className="h-3.5 w-3.5 mr-2" /> Recent Activity
                </Button>
             </div>
          </div>
          
          <div className="glass-card rounded-[2.5rem] border-white/5 bg-slate-900/40 overflow-hidden shadow-2xl">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="py-6 px-8 text-xs font-black uppercase text-muted-foreground tracking-[0.2em]">Listing</TableHead>
                  <TableHead className="py-6 px-8 text-xs font-black uppercase text-muted-foreground tracking-[0.2em]">Deployment</TableHead>
                  <TableHead className="py-6 px-8 text-xs font-black uppercase text-muted-foreground tracking-[0.2em] text-right">Moderation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((j) => (
                  <TableRow key={j.id} className="hover:bg-white/5 border-white/5 transition-colors">
                    <TableCell className="py-6 px-8">
                       <div>
                          <div className="font-black text-white uppercase text-sm tracking-tight">{j.title}</div>
                          <div className="text-xs text-muted-foreground font-medium mt-1">{j.companyName || j.company}</div>
                       </div>
                    </TableCell>
                    <TableCell className="py-6 px-8">
                       <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                         {j.location}
                       </span>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-muted-foreground">
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl border-white/10 bg-slate-900/95 backdrop-blur-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-black text-white">Terminate Listing?</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                              This listing for <span className="text-white font-bold">{j.title}</span> will be instantly delisted and all active candidatures will be notified.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="pt-6">
                            <AlertDialogCancel className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10">Abort</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveJob(j.id)} className="rounded-xl bg-red-500 hover:bg-red-600 font-bold">Confirm Deletion</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

