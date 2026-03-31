import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Briefcase, LogOut, Menu, X, PlusCircle, LayoutDashboard, History, Sparkles, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const navLinks = (isMobile: boolean = false) => {
    const linkClass = cn(
      "text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-blue-400 relative group py-2",
      isMobile ? "text-lg py-4 border-b border-white/5 w-full flex items-center justify-between" : "text-muted-foreground/80"
    );

    const activeLinkClass = "text-white";

    if (!isAuthenticated || !user) {
      return (
        <div className={cn("flex items-center gap-6", isMobile && "flex-col items-stretch w-full mt-6")}>
          <Link to="/login" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="text-white hover:bg-white/5 font-bold uppercase tracking-widest text-xs h-12 px-6 rounded-xl">Portal Access</Button>
          </Link>
          <Link to="/register" onClick={() => setMobileOpen(false)}>
            <Button className="h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-none shadow-xl shadow-blue-500/20 font-black uppercase tracking-widest text-xs">
              Initiate Signup
            </Button>
          </Link>
        </div>
      );
    }

    const links = [];
    if (user.role === "jobseeker") {
      links.push(
        { to: "/jobs", label: "Neural Network", icon: Sparkles },
        { to: "/applications", label: "My Syncs", icon: History }
      );
    } else if (user.role === "company") {
      links.push(
        { to: "/company/dashboard", label: "Command Center", icon: LayoutDashboard },
        { to: "/company/post-job", label: "New Campaign", icon: PlusCircle, highlight: true }
      );
    } else if (user.role === "admin") {
      links.push({ to: "/admin", label: "Master Control", icon: LayoutDashboard });
    }

    return (
      <div className={cn("flex items-center gap-8", isMobile && "flex-col items-start w-full gap-2")}>
        {links.map((link) => (
          <Link 
            key={link.to} 
            to={link.to} 
            className={cn(linkClass, location.pathname === link.to && activeLinkClass, link.highlight && !isMobile && "px-6 py-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400 hover:bg-blue-500/20")}
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex items-center gap-3">
              {isMobile && <link.icon className="h-5 w-5 text-blue-400" />}
              {link.label}
            </span>
            {!isMobile && !link.highlight && (
              <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full", location.pathname === link.to && "w-full")} />
            )}
            {isMobile && <div className="h-2 w-2 rounded-full bg-white/5" />}
          </Link>
        ))}
        <div className={cn("flex items-center gap-6", isMobile && "mt-10 pt-10 border-t border-white/10 w-full flex-col items-stretch")}>
          {!isMobile && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <UserCircle className="h-3 w-3 text-blue-400" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{user.name}</span>
            </div>
          )}
          {isMobile && (
            <div className="space-y-4">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-1">Linked Identity</p>
               <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-blue-400" />
                  </div>
                  <span className="text-xl font-black text-white uppercase tracking-tight">{user.name}</span>
               </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="h-10 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 font-black uppercase tracking-widest text-[10px]">
            <LogOut className="h-3.5 w-3.5 mr-2" /> {isMobile ? "Terminate Session" : "Logout"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 py-4" : "bg-transparent py-8"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-11 w-11 rounded-[1.25rem] bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 p-px flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:rotate-6 transition-all duration-500">
            <div className="h-full w-full rounded-[1.25rem] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase italic">
            NEXUS<span className="text-gradient">CORE</span>
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden lg:block">
          {navLinks()}
        </nav>

        {/* Mobile toggle */}
        <button 
          className="lg:hidden h-12 w-12 flex items-center justify-center text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all active:scale-95" 
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="lg:hidden absolute top-full left-4 right-4 mt-4 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden shadow-black/50 p-8"
          >
            <div className="flex flex-col gap-6">
              {navLinks(true)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;


