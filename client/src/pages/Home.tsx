import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import SecurityTrends from '@/components/SecurityTrends';
import Footer from '@/components/Footer';
import MobileDrawer from '@/components/MobileDrawer';
import { useSidebar } from '@/lib/hooks/useSidebar';
import { Resource, ResourceCategory } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
        <div className="max-w-7xl mx-auto w-full px-4 py-6 md:py-8">
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
          
          {/* Security Trends Component */}
          <SecurityTrends />
          
          {/* CENTERED Donate button/CTA */}
          <div className="my-12 flex justify-center">
            <a 
              href="https://cash.app/$sleepingsilverback" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-8 py-4 bg-[hsl(var(--primary))] text-black rounded-md font-medium hover:opacity-90 transition-opacity text-xl"
            >
              <DollarSign className="h-6 w-6" />
              <span>Support Our Project</span>
            </a>
          </div>
          
          {/* CENTERED AI Resource Categories - 3 columns of 2 rows */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6 text-center">AI Resource Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {categories.map((category) => (
                <Link key={category.id} href={`/resources?category=${encodeURIComponent(category.name)}`}>
                  <div className="border border-[hsl(var(--muted))] hover:border-[hsl(var(--primary))] rounded-md p-5 text-center h-full flex flex-col justify-center transition-colors cursor-pointer">
                    <h3 className="font-bold text-[hsl(var(--primary))] mb-2">{category.name}</h3>
                    <p className="text-sm mb-3 text-[hsl(var(--muted-foreground))]">{category.description}</p>
                    <div className="mt-auto flex justify-center">
                      <span className="text-sm text-[hsl(var(--primary))] flex items-center gap-1">
                        Explore Resources
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Popular Resources in THREE columns */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6 text-center">Popular Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {popularResources.map((resource) => (
                <Card key={resource.id} className="border border-[hsl(var(--muted))] hover:border-[hsl(var(--primary))] transition-colors">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-[hsl(var(--primary))] mb-2">{resource.name}</h3>
                    <p className="text-sm mb-2">{resource.description}</p>
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-xs bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]">
                      {resource.category}
                    </Badge>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-[hsl(var(--primary))] hover:underline flex items-center gap-1"
                    >
                      View Details
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </CardFooter>
                </Card>
              ))}
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
