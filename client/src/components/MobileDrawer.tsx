import { X } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { ResourceCategory } from '@/lib/types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { data: categories = [] } = useQuery<ResourceCategory[]>({
    queryKey: ['/api/categories'],
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50">
      <div className="h-full w-64 bg-[hsl(var(--card))] border-r border-[hsl(var(--muted))] p-4 transform translate-x-0 transition-transform">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Menu</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--secondary))] rounded-md focus:outline-none"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        
        <nav className="mb-6">
          <ul className="space-y-4">
            <li>
              <Link href="/">
                <a onClick={onClose} className="block py-2 hover:text-[hsl(var(--primary))] transition-colors">Home</a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a onClick={onClose} className="block py-2 hover:text-[hsl(var(--primary))] transition-colors">About</a>
              </Link>
            </li>
            <li>
              <Link href="/resources">
                <a onClick={onClose} className="block py-2 hover:text-[hsl(var(--primary))] transition-colors">Resources</a>
              </Link>
            </li>
            <li>
              <Link href="/donate">
                <a onClick={onClose} className="block py-2 hover:text-[hsl(var(--primary))] transition-colors">Donate</a>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="border-t border-[hsl(var(--muted))] pt-4">
          <h3 className="font-medium mb-2">Resource Categories</h3>
          <ul className="space-y-2">
            {categories.map(category => (
              <li 
                key={category.id} 
                className="text-sm py-1 hover:text-[hsl(var(--primary))] transition-colors cursor-pointer"
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
