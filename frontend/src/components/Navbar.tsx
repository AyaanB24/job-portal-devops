import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const navLinks = () => {
    if (!isAuthenticated || !user) {
      return (
        <>
          <Link to="/login" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" size="sm">Log In</Button>
          </Link>
          <Link to="/register" onClick={() => setMobileOpen(false)}>
            <Button size="sm">Sign Up</Button>
          </Link>
        </>
      );
    }

    switch (user.role) {
      case "jobseeker":
        return (
          <>
            <Link to="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>Jobs</Link>
            <Link to="/applications" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>Applied Jobs</Link>
            <span className="text-sm font-medium text-foreground">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4 mr-1" />Logout</Button>
          </>
        );
      case "company":
        return (
          <>
            <Link to="/company/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            <Link to="/company/post-job" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>Post Job</Link>
            <span className="text-sm font-medium text-foreground">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4 mr-1" />Logout</Button>
          </>
        );
      case "admin":
        return (
          <>
            <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
            <span className="text-sm font-medium text-foreground">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4 mr-1" />Logout</Button>
          </>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
          <Briefcase className="h-5 w-5 text-primary" />
          JobPortal
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks()}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 flex flex-col gap-3 animate-fade-in">
          {navLinks()}
        </div>
      )}
    </header>
  );
};

export default Navbar;
