import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResourceCategory, Resource } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
}

export default function Sidebar({ isOpen, isMobile }: SidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: categories = [], isLoading: loadingCategories } = useQuery<ResourceCategory[]>({
    queryKey: ['/api/categories'],
  });
  
  const { data: popularResources = [], isLoading: loadingPopular } = useQuery<Resource[]>({
    queryKey: ['/api/resources/popular'],
  });
  
  if (!isOpen) return null;
  
  return (
    <aside className={`${isMobile ? 'fixed inset-0 z-50 bg-black bg-opacity-80' : 'hidden md:block'} w-64 border-r border-[hsl(var(--muted))] p-4 overflow-y-auto`}>
      <div className="mb-6">
        <h2 className="text-[hsl(var(--primary))] font-bold mb-3">AI Resource Categories</h2>
        {loadingCategories ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full bg-[hsl(var(--secondary))]" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <button 
                  className={`w-full text-left py-2 px-3 rounded hover:bg-[hsl(var(--secondary))] transition-colors focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-[hsl(var(--primary))] font-bold mb-3">Popular Resources</h2>
        {loadingPopular ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full bg-[hsl(var(--secondary))]" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {popularResources.map((resource) => (
              <li key={resource.id} className="py-2 px-3 hover:bg-[hsl(var(--secondary))] rounded transition-colors">
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="font-medium">{resource.name}</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">{resource.description}</div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-[hsl(var(--primary))] font-bold mb-3">Recent Queries</h2>
        <ul className="space-y-2">
          <li className="py-1 text-sm truncate hover:text-[hsl(var(--primary))] cursor-pointer">
            Building a web app with React and Firebase
          </li>
          <li className="py-1 text-sm truncate hover:text-[hsl(var(--primary))] cursor-pointer">
            Free AI models for sentiment analysis
          </li>
          <li className="py-1 text-sm truncate hover:text-[hsl(var(--primary))] cursor-pointer">
            How to use Hugging Face transformers
          </li>
        </ul>
      </div>
    </aside>
  );
}
