import { Link } from 'wouter';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--muted))] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
                <span className="text-black font-bold text-sm">SI</span>
              </div>
              <span className="text-lg font-bold">Superfishal Intelligence</span>
            </div>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Aggregating free AI resources for everyone</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-[hsl(var(--primary))] font-bold mb-3">Site Map</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-[hsl(var(--primary))] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[hsl(var(--primary))] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-[hsl(var(--primary))] transition-colors">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/donate" className="hover:text-[hsl(var(--primary))] transition-colors">
                    Donate
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-[hsl(var(--primary))] font-bold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-[hsl(var(--primary))] transition-colors">LLM Models</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[hsl(var(--primary))] transition-colors">Data Analytics</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[hsl(var(--primary))] transition-colors">Hosting Services</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[hsl(var(--primary))] transition-colors">API Tools</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-[hsl(var(--primary))] font-bold mb-3">Support the Project</h3>
              <div className="flex items-center space-x-2 mb-3">
                <a 
                  href="https://cash.app/$sleepingsilverback" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-3 py-2 bg-[hsl(var(--primary))] text-black rounded-md font-medium hover:opacity-90 transition-opacity"
                >
                  <DollarSign className="h-5 w-5" />
                  <span>Donate</span>
                </a>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Support via CashApp: $sleepingsilverback</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[hsl(var(--muted))] text-sm text-[hsl(var(--muted-foreground))]">
          <p>© {new Date().getFullYear()} Superfishal Intelligence. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
