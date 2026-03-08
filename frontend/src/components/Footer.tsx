import { Briefcase } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-auto">
    <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Briefcase className="h-4 w-4 text-primary" />
        <span>© 2026 JobPortal. All rights reserved.</span>
      </div>
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
        <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
        <span className="hover:text-foreground cursor-pointer transition-colors">Contact</span>
      </div>
    </div>
  </footer>
);

export default Footer;
