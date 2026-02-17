import { Link } from "wouter";
import { Dog, Cat } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-serif font-bold text-xl text-primary">
              <span className="flex items-center gap-0.5"><Dog className="h-5 w-5" /><Cat className="h-5 w-5" /></span>
              Pawtrait Pals
            </div>
            <span className="text-sm text-muted-foreground">Built for Rescue Organizations</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Helping rescue pets find their furever homes through art</span>
            <span className="hidden md:inline">·</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
