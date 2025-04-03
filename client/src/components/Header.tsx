import { Link } from 'wouter';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="border-b border-[hsl(var(--muted))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
              <span className="text-black font-bold">SI</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Superfishal<span className="text-[hsl(var(--primary))]">Intelligence</span>
            </h1>
          </div>
          
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-[hsl(var(--secondary))] focus:outline-none"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            
            <div className="hidden md:flex ml-4 space-x-4 items-center">
              <Link href="/about" className="hover:text-[hsl(var(--primary))] transition-colors">
                About
              </Link>
              <Link href="/resources" className="hover:text-[hsl(var(--primary))] transition-colors">
                Resources
              </Link>
              <Link href="/donate" className="hover:text-[hsl(var(--primary))] transition-colors">
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
