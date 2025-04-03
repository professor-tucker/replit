import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileDrawer from '@/components/MobileDrawer';
import { useSidebar } from '@/lib/hooks/useSidebar';
import { Resource, ResourceCategory } from '@/lib/types';
import ResourceCard from '@/components/ResourceCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

export default function Resources() {
  const { isOpen, isMobile, toggle, close } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch all resources
  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<ResourceCategory[]>({
    queryKey: ['/api/categories'],
  });

  // Filter resources based on search and category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-black text-[hsl(var(--foreground))] font-mono min-h-screen flex flex-col">
      <Header toggleSidebar={toggle} />
      
      <main className="flex-grow flex flex-col max-w-6xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">AI <span className="text-[hsl(var(--primary))]">Resources</span></h1>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          </div>
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[hsl(var(--card))] border-[hsl(var(--muted))]"
          />
        </div>
        
        {/* Category tabs */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="bg-[hsl(var(--card))]">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.name}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Resources grid */}
        {isLoading ? (
          <div className="text-center py-8">Loading resources...</div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No resources found matching your criteria.</p>
          </div>
        )}
      </main>
      
      <Footer />
      
      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobile && isOpen} onClose={close} />
    </div>
  );
}
