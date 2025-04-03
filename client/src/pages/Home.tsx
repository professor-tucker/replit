import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { DollarSign } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import Footer from '@/components/Footer';
import MobileDrawer from '@/components/MobileDrawer';
import { useSidebar } from '@/lib/hooks/useSidebar';
import { Resource, ResourceCategory } from '@/lib/types';

export default function Home() {
  const { isOpen, isMobile, toggle, close } = useSidebar();
  const [showResourceCards, setShowResourceCards] = useState(true);
  const { data: popularResources = [] } = useQuery<Resource[]>({
    queryKey: ['/api/resources/popular'],
  });
  const { data: categories = [] } = useQuery<ResourceCategory[]>({
    queryKey: ['/api/categories'],
  });

  return (
    <div className="bg-black text-[hsl(var(--foreground))] font-mono min-h-screen flex flex-col">
      <Header toggleSidebar={toggle} />
      
      <main className="flex-grow flex flex-col">
        {/* Main content in a vertical layout */}
        <div className="max-w-4xl mx-auto w-full px-4 py-6 md:py-8">
          {/* Title at the top */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to <span className="text-[hsl(var(--primary))]">Superfishal Intelligence</span></h1>
            <p className="text-[hsl(var(--muted-foreground))] mb-2">Discover premium AI resources for your projects</p>
          </div>
          
          {/* Navigation below title */}
          <div className="mb-8">
            <div className="flex justify-center space-x-4">
              <Link href="/" className="text-[hsl(var(--primary))] hover:underline">Home</Link>
              <Link href="/about" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">About</Link>
              <Link href="/resources" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">Resources</Link>
              <Link href="/donate" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">Donate</Link>
            </div>
          </div>
          
          {/* Chat interface */}
          <ChatInterface showResourceCards={false} />
          
          {/* Donate button/CTA */}
          <div className="my-8 flex justify-center">
            <a 
              href="https://cash.app/$sleepingsilverback" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-3 bg-[hsl(var(--primary))] text-black rounded-md font-medium hover:opacity-90 transition-opacity text-lg"
            >
              <DollarSign className="h-6 w-6" />
              <span>Support Our Project</span>
            </a>
          </div>
          
          {/* Resource listings */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Categories */}
            <div>
              <h2 className="text-xl font-bold text-[hsl(var(--primary))] mb-4">AI Resource Categories</h2>
              <ul className="space-y-2 border border-[hsl(var(--muted))] rounded-md p-4">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/resources?category=${encodeURIComponent(category.name)}`}
                      className="block py-2 px-3 rounded hover:bg-[hsl(var(--secondary))] transition-colors">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Popular Resources */}
            <div>
              <h2 className="text-xl font-bold text-[hsl(var(--primary))] mb-4">Popular Resources</h2>
              <ul className="space-y-2 border border-[hsl(var(--muted))] rounded-md p-4">
                {popularResources.map((resource) => (
                  <li key={resource.id} className="py-2 px-3 hover:bg-[hsl(var(--secondary))] rounded transition-colors">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="font-medium">{resource.name}</div>
                      <div className="text-sm text-[hsl(var(--muted-foreground))]">{resource.description}</div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobile && isOpen} onClose={close} />
    </div>
  );
}
